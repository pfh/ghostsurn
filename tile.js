
class XY {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    
    add(other) {
        return xy(this.x+other.x,this.y+other.y);
    }
    
    scale(scale) {
        return xy(this.x*scale,this.y*scale);
    }
    
    // anticlockwise
    rot(angle) {
        angle = angle * (Math.PI/180);
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        return xy(this.x*c+this.y*s, this.x*-s+this.y*c);
    }
}

function xy(x,y) { return new XY(x,y); }


const edge_specs = {
    "A":[1,1],
    "a":[1,-1],
    "B":[0.75,1],
    "b":[0.75,-1],
    
    "0":[1,0],
    "1":[0.75,0],
};

const edge_partners = {
    "-":"-",
    "0":"0",
    "1":"1",
    
    "A":"a",
    "a":"A",
    "B":"b",
    "b":"B",
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

function spin_tiles(input) {
    let tiles = [ ];
    let seen = new Set();
    for(let tile of input)
    for(let i of range(tile.length)) {
        let spun = tile.slice(i,tile.length)+tile.slice(0,i);
        if (seen.has(spun)) continue;
        tiles.push(spun);
        seen.add(spun);
    }
    return tiles;
}

function tile_specs(tiles) {
    let n = tiles[0].length;
    let adjacency = n==4?adjacency_4:adjacency_6;
    
    let specs = [ ];
    for(let item of adjacency) {
        let spec = { xs:item.xs, ys:item.ys, valids:[] };
        for(let a of range(tiles.length))
        for(let b of range(tiles.length))
        if (edge_partners[tiles[a][item.i]] == tiles[b][item.j])
            spec.valids.push( String.fromCodePoint(a)+String.fromCodePoint(b) );
        
        specs.push(spec);
    }
    
    return specs;
}



function make_edge(char) {
    if (char == "-")
        return [ ];
    
    let [width, dent] = edge_specs[char];    
    width *= 0.5;
    dent *= 0.5;
    return [ xy(-width/2,0.5), xy(-width/2,1), xy(0, 1+dent/2), xy(width/2, 1), xy(width/2, 0.5) ];
}

function make_tile(tile) {
    let angle = 360/tile.length;
    let points = [ ];
    for(i of range(tile.length))
        points.push(...make_edge(tile[i]).map(point => point.rot(angle*i) ));
    
    return points;
}

function draw_tile(ctx, tile, x, y, scale, border) {
    let n = tile.length;
    let step = n==4?step_4:step_6;

    let offset = step.x.scale(x).add( step.y.scale(y) ).add(xy(2,2));
    let points = make_tile(tile);
    
    if (points.length == 0) return;
    
    points = points.map(p => p.add(offset).scale(scale));
    
    ctx.fillStyle = "#88ffff";
    
    ctx.beginPath();
    ctx.moveTo(points[0].x,points[0].y);
    for(let i=1;i<points.length;i++)
        ctx.lineTo(points[i].x,points[i].y);
    ctx.closePath();
    if (border)
        ctx.stroke();
    else
        ctx.fill();
}

function draw_tile_layout(canvas, width, height, scale, word, tiles) {
    let ctx = canvas.getContext("2d");
    
    let n = tiles[0].length;
    let step = n==4?step_4:step_6;
    let offset = step.x.scale(width-1).add( step.y.scale(height-1) ).add(xy(4,4)).scale(scale);
    
    canvas.width = offset.x;
    canvas.height = offset.y;
    
    ctx.fillStyle ="#f8f8f8";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(let y of range(height))
    for(let x of range(width))
    if (y*width+x < word.length)
        draw_tile(ctx, tiles[ word[y*width+x].codePointAt() ], x, y, scale, false);
    
    for(let y of range(height))
    for(let x of range(width))
    if (y*width+x < word.length)
        draw_tile(ctx, tiles[ word[y*width+x].codePointAt() ], x, y, scale, true);
}