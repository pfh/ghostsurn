
class XY {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    
    add(other) {
        return xy(this.x+other.x,this.y+other.y);
    }
    
    sub(other) {
        return xy(this.x-other.x,this.y-other.y);
    }
    
    scale(scale) {
        return xy(this.x*scale,this.y*scale);
    }
    
    dot(other) {
        return this.x*other.x+this.y*other.y;
    }
    
    // anticlockwise
    rot(angle) {
        angle = angle * (Math.PI/180);
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        return xy(this.x*c+this.y*s, this.x*-s+this.y*c);
    }
    
    length() {
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }
}

function xy(x,y) { return new XY(x,y); }

function good_bezier(a,b,c,d) {
    let p0 = a;
    let v0 = b.sub(a);
    let v1 = d.sub(c);
    let p1 = d;
    
    v0 = v0.scale(1/v0.length());
    v1 = v1.scale(1/v1.length());
    let dot = v0.dot(v1);
    
    // Clip floating point errors
    dot = Math.max(-1,Math.min(dot,1));
    
    //For arc
    //https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
    //let angle = Math.acos(Math.min(dot,1));
    //let n = 2*Math.PI / angle;
    //let straight_line_length = Math.sqrt( (1-Math.cos(2*Math.PI/n))**2+Math.sin(2*Math.PI/n)**2 );
    //a0 = 4*Math.tan(Math.PI/(2*n)) / straight_line_length;
    
    //let straight_line_length = Math.sin(angle/2)*2;
    //a0 = 4*Math.tan(angle/4) / straight_line_length;
    
    // Wolfram Alpha says
    let s = 2/(Math.cos(Math.acos(dot)*0.5)+1);

    s *= p1.sub(p0).length();

    // Hermite to Bezier conversion    
    return [ v0.scale(1/3 * s).add(p0), v1.scale(-1/3 * s).add(p1) ];
}


const edge_specs = {
    "A":[1,1.25,0],
    "a":[1,-1.25,0],
    "B":[0.5,1,0],
    "b":[0.5,-1,0],
    "C":[0.25,0.75,0],
    "c":[0.25,-0.75,0],
    "D":[0.1,0.5,0],
    "d":[0.1,-0.5,0],

    "E":[0.5,0,0.5],
    "e":[0.5,0,-0.5],
    "F":[0.25,0,0.25],
    "f":[0.25,0,-0.25],
    
    "1":[1,0,0],
    "2":[0.5,0,0],
    "3":[0.25,0,0],
    "4":[0.1,0,0],
};

const edge_partners = {
    "-":"-",
    "1":"1",
    "2":"2",
    "3":"3",
    "4":"4",    
    "A":"a",
    "a":"A",
    "B":"b",
    "b":"B",
    "C":"c",
    "c":"C",
    "D":"d",
    "d":"D",
    "E":"e",
    "e":"E",
    "F":"f",
    "f":"F",
};

const adjacency_4 = [ 
    {xs:[0,0], ys:[0,1], y1:1,x1:0,i:0,j:2}, 
    {xs:[0,1], ys:[0,0], i:1,j:3} 
];
const step_4 = { x:xy(2,0), y:xy(0,2) };

const adjacency_6 = [ 
    {xs:[0,1], ys:[0,0], i:1,j:4},
    {xs:[0,0], ys:[0,1], i:0,j:3},
    {xs:[1,0], ys:[0,1], i:5,j:2},
];
const step_6 = { x:xy(2,0).rot(-30), y:xy(0,2) };

function spin_tiles(input, knotwork) {
    let tiles = [ ];
    for(let j of range(input.length)) {
        let tile = input[j];
        let seen = new Set();
        
        let ind = Array.from(range(tile.tile.length)).filter(i => tile.tile[i] != "-");
        let knotstack;
        if (!knotwork || ind.length != 4)
            knotstack = [ tile.tile ];
        else
            knotstack = [
                tile.tile.slice(0,ind[0])+"-"+tile.tile.slice(ind[0]+1,ind[2])+"-"+tile.tile.slice(ind[2]+1),
                tile.tile.slice(0,ind[1])+"-"+tile.tile.slice(ind[1]+1,ind[3])+"-"+tile.tile.slice(ind[3]+1),
            ];
        
        // Hack for this one case that doesn't draw nicely!
        if (knotwork && tile.tile.length == 6)
            knotstack = knotstack.map(item => item.replace(/[Aa]/g,"1"));
        
        for(let i of range(tile.tile.length)) {
            let spun = {
                ...tile, 
                origin:j,
                spin:i,
                tile:tile.tile.slice(i)+tile.tile.slice(0,i),
                knotstack:knotstack.map(item => item.slice(i)+item.slice(0,i)),
            };
            if (seen.has(spun.tile)) continue;
            tiles.push(spun);
            seen.add(spun.tile);
        }
    }
    return tiles;
}

function tile_specs(tiles) {
    let n = tiles[0].tile.length;
    let adjacency = n==4?adjacency_4:adjacency_6;
    
    let specs = [ ];
    for(let item of adjacency) {
        let spec = { xs:item.xs, ys:item.ys, valids:[] };
        for(let a of range(tiles.length))
        for(let b of range(tiles.length))
        if (edge_partners[tiles[a].tile[item.i]] == tiles[b].tile[item.j])
            spec.valids.push( String.fromCodePoint(a)+String.fromCodePoint(b) );
        
        specs.push(spec);
    }
    
    return specs;
}

function tile_weights(tiles) {
    let result = { };
    for(let i of range(tiles.length))
        result[ String.fromCodePoint(i) ] = tiles[i].weight;
    return result;
}


function make_edge(char, halfside) {
    let [width, dent, skew] = edge_specs[char];    
    width *= halfside;
    dent *= halfside;
    skew *= halfside;
    
    let a = 0;
    return [ 
        xy(-width+skew,a), 
        xy(-width+skew,1), 
        xy(0+skew, 1+dent/2), 
        xy(width+skew, 1), 
        xy(width+skew, a) 
    ];
}

function make_tile(tile) {
    let angle = 360/tile.tile.length;
    let halfside = Math.tan(angle/(360/Math.PI));
    let points = [ ];
    for(i of range(tile.tile.length))
    if (tile.tile[i] != "-")
        points.push(make_edge(tile.tile[i], halfside).map(point => point.rot(angle*i)));
    
    return points;
}

function draw_tile(ctx, tile, x, y, scale, all_offset, what) {
    let n = tile.tile.length;
    let step = n==4?step_4:step_6;

    let offset = step.x.scale(x).add( step.y.scale(y) );
    let p = make_tile(tile);
    
    if (p.length == 0) return;
    
    if (p.length == 1) {
        let a = p[0][2];
        a = a.scale(-0.5/a.length());
        //let b = a.scale(1.5);
        //p.push([ a.add(b.rot(-90)), a,a,a, a.add(b.rot(90)) ])
        
        let b = p[0][3].add(a);
        p.push([p[0][3],b,b,b,b.add(a)]);
        b = p[0][1].add(a);
        p.push([b.add(a),b,b,b,p[0][1]]);
    }
    
    p = p.map(points => points.map(point => point.add(offset).scale(scale).add(all_offset)));
    
    /* Main body */
    if (what == "fill" || what == "border") {
        ctx.beginPath();
        ctx.moveTo(p[0][1].x,p[0][1].y);
        for(let i=0;i<p.length;i++) {
            let j=(i+1)%p.length;
            ctx.lineTo(p[i][2].x,p[i][2].y);
            ctx.lineTo(p[i][3].x,p[i][3].y);
            
            let a=p[i][3], b=p[i][4], c=p[j][0], d=p[j][1];
            //let l = d.sub(a).length() * 0.4;
            //b = b.sub(a);
            //b = b.scale(l/b.length()).add(a);
            //c = c.sub(d);
            //c = c.scale(l/c.length()).add(d);
            [b,c] = good_bezier(a,b,c,d);
            ctx.bezierCurveTo(b.x,b.y,c.x,c.y,d.x,d.y);
        }
        ctx.closePath();
        
        if (what == "fill") {
            ctx.fillStyle = tile.color;
            ctx.fill();

            ctx.strokeStyle = tile.color;
            ctx.lineWidth = 0.75;
            ctx.stroke();
        }

        if (what == "border") {
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        } 
    }

    if (what == "knotlines") {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1.5;
        for(let i=0;i<p.length;i++) {
            let j=(i+1)%p.length;
            
            let a=p[i][3], b=p[i][4], c=p[j][0], d=p[j][1];
            //let l = d.sub(a).length() * 0.4;
            //b = b.sub(a);
            //b = b.scale(l/b.length()).add(a);
            //c = c.sub(d);
            //c = c.scale(l/c.length()).add(d);
            [b,c] = good_bezier(a,b,c,d);
            ctx.beginPath();
            ctx.moveTo(a.x,a.y);
            ctx.bezierCurveTo(b.x,b.y,c.x,c.y,d.x,d.y);
            ctx.stroke();
        }
    }
}

function draw_tile_layout(canvas, width, height, scale, word, tiles, outlines, do_grid, bg_color) {
    let ctx = canvas.getContext("2d");

    ctx.lineJoin = "miter";
    ctx.lineCap = "round";
    
    let last_y = word.length/width-1;
    
    let n = tiles[0].tile.length;
    let step = n==4?step_4:step_6;
    
    scale *= 2/step.x.x;
    
    let offset0 = step.x.scale(width-1).scale(scale);
    let offset1 = step.y.scale(height-1).scale(scale);
    let offset2 = step.y.scale(last_y).scale(scale);
    let offset = xy(0, Math.min(0, (offset1.y-offset2.y)/2-offset0.y));
    
    let cwidth = offset0.x;
    let cheight = offset1.y - offset0.y
    let cscale = Math.max(2, window.devicePixelRatio);  // Force high quality rendering
    canvas.style.width = cwidth+"px";
    canvas.style.height = cheight+"px";
    canvas.width = (cwidth*cscale)>>0;
    canvas.height = (cheight*cscale)>>0;
    ctx.scale(cscale,cscale);
    
    ctx.fillStyle = bg_color;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if (do_grid)
    for(let y of range(height))
    for(let x of range(width))
        draw_tile(ctx, {tile:n==4?"1111":"111111"}, x, y, scale, offset, "border");
        
    for(let i of [0,1]) {
        for(let y of range(height))
        for(let x of range(width))
        if (y*width+x < word.length) {
            let tile = tiles[ word[y*width+x].codePointAt() ];
            if (tile.knotstack.length > i) {
                draw_tile(ctx, {...tile, tile:tile.knotstack[i]}, x, y, scale, offset, "fill");
            }
        }
        
        if (outlines > 0)
        for(let y of range(height))
        for(let x of range(width))
        if (y*width+x < word.length) {
            let tile = tiles[ word[y*width+x].codePointAt() ];
            
            // One weird case where borders aren't nice
            if (tile.tile == "1111" && outlines == 3) 
                continue;
            
            if (tile.knotstack.length > i) {
                draw_tile(ctx, {...tile, tile:tile.knotstack[i]}, x, y, scale, offset, outlines==1?"border":"knotlines");
            }
        }
    }
}