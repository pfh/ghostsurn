
"use strict";

let fs = require("fs");


function* range(length) {
    for(let i=0;i<length;i++) yield i;
}

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
    
    // clockwise
    rot(angle) {
        angle = angle * (Math.PI/180);
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        return xy(this.x*c+this.y*s, this.x*-s+this.y*c);
    }

    mirror_y() { return xy(this.x,-this.y); }
    
    length() {
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }
}

function xy(x,y) { return new XY(x,y); }


class Node {
    constructor(p,vneg,vpos) {
        this.p = p;
        this.vneg = vneg;
        this.vpos = vpos;
    }

    rev() { return new Node(this.p,this.vpos,this.vneg); }
    
    rot(angle) { 
        return new Node(this.p.rot(angle),this.vneg.rot(angle),this.vpos.rot(angle)); 
    }

    add(offset) { return new Node(this.p.add(offset), this.vneg, this.vpos); }

    scale(scale) { return new Node(this.p.scale(scale), this.vneg.scale(scale), this.vpos.scale(scale)); }

    mirror_y() { return new Node(this.p.mirror_y(), this.vneg.mirror_y(), this.vpos.mirror_y()); }

    corner(rad) {
        let vneg = this.vneg.scale(1/this.vneg.length());
        let vpos = this.vpos.scale(1/this.vpos.length());
        let dot = vneg.dot(vpos);
        dot = Math.max(-1,Math.min(dot,1));
        rad /= Math.tan(Math.acos(dot)/2);

        let pneg = vneg.scale(rad).add(this.p);
        let ppos = vpos.scale(rad).add(this.p);
        return [
            new Node(pneg, this.vneg,this.vneg.scale(-1)),
            new Node(ppos, this.vpos.scale(-1),this.vpos),
        ];
    }
}

function flat(x,y,dx,dy) { return new Node(xy(x,y),xy(-dx,-dy),xy(dx,dy)); }

function good_bezier(p0,v0, p1,v1) {
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
    //s = 4*Math.tan(Math.PI/(2*n)) / straight_line_length;
    
    //let straight_line_length = Math.sin(angle/2)*2;
    //s = 4*Math.tan(angle/4) / straight_line_length;
    
    // Wolfram Alpha says
    let s = 2/(Math.cos(Math.acos(dot)*0.5)+1);

    s *= p1.sub(p0).length();

    // Hermite to Bezier conversion    
    return [ v0.scale(1/3 * s).add(p0), v1.scale(-1/3 * s).add(p1) ];
}

function rounded_polyline(rad, points) {
    let result = [ ];
    for(let i=1;i<points.length-1;i++) {
        result.push(...new Node(
                points[i], 
                points[i-1].sub(points[i]), 
                points[i+1].sub(points[i])
            ).corner(rad));
    }
    return result;
}

function render_to_path(items) {
    let result = `M ${items[0].p.x} ${items[0].p.y} `;

    for(let i of range(items.length)) {
        let j = (i+1)%items.length;
        if (items[j].p.sub(items[i].p).length() < 1e-6) continue;
        
        let [b,c] = good_bezier(items[i].p,items[i].vpos, items[j].p,items[j].vneg.scale(-1));
        result += `C ${b.x} ${b.y}, ${c.x} ${c.y}, ${items[j].p.x} ${items[j].p.y} `;
    }

    result += "Z";

    return result;
}

function render_to_svg(paths, padding, scale, color) {
    // svg uses flipped y coordinates
    paths = paths.map(path => path.map(node => node.scale(scale).mirror_y()));
    padding *= scale;

    let all_nodes = [].concat(...paths);
    let min_x = Math.min(...all_nodes.map(node=>node.p.x));
    let min_y = Math.min(...all_nodes.map(node=>node.p.y));
    let max_x = Math.max(...all_nodes.map(node=>node.p.x));
    let max_y = Math.max(...all_nodes.map(node=>node.p.y));

    let width = max_x-min_x+padding*2;
    let height = max_y-min_y+padding*2;
    let offset = xy(padding-min_x, padding-min_y);

    let result = `<svg version="1.1" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    result += `<path d="`;
    for(let path of paths) {
        result += render_to_path(path.map(node => node.add(offset)));
    }
    result += `" fill="${color}" stroke="black"/>`;
    result += `</svg>`;

    return result;
}




let outie = rounded_polyline(3/4, [
    xy(-3,0),
    xy(0,0),
    xy(-2,2),
    xy(0,4),
    xy(2,2),
    xy(2,0),
    xy(4,0)
]);

let inie = outie.map(node => node.rot(180).rev());
inie.reverse();

let inout = rounded_polyline(3/4, [
    xy(-4,0),
    xy(-2,0),
    xy(-2,-2),
    xy(0,-4),
    xy(2,-2),
    xy(0,0),
    xy(-2,2),
    xy(0,4),
    xy(2,2),
    xy(2,0),
    xy(4,0),
]);

let corner = [ new Node(xy(0,0), xy(0,-1), xy(1,0)) ];

function put(x,y,rot,scale,path) {
    let p=xy(x,y);
    return path.map(node => node.rot(rot).scale(scale).add(p));
}

function cell(in0,in1,in2,out) {
    let s = 1/5;
    let s1 = 1/5;
    let o = 1/5;
    return [
        ...put(-1,1, 0, s, corner),
        ...put(0,1, 0, s1, in1?inie:[]),
    
        ...put(1,1,  90, s, corner),
        ...put(1,0-o,  90, s, in2?(in1?inout:inie):(in1?outie:[])),

        ...put(1,-1,  180, s, corner),
        ...put(0,-1, 180, s1, out?outie:[]),

        ...put(-1,-1, 270, s, corner),
        ...put(-1,0-o, 270, s, in0?(in1?inout:inie):(in1?outie:[])),        
    ];
}

function layout(paths) {
    let result = [ ];
    for(let i of range(paths.length)) {
        result.push(put( (i%6)*4, ((i/6)>>0)*4, 0,1, paths[i]));
    }
    return result;
}

//let path = cell(1,1,1,1);

//path = [
//    flat(-3,0, 1,0),
//    ...inout,
//    flat(3,0, 1,0),
//    flat(0,-6, -1,0),
//];

//fs.writeFile("test.svg", render_to_svg([path], 5, 72/2.54, "#088"), "utf8", x => console.log(x) );

let rule = 30;
let black_tiles = [ ];
let white_tiles = [ ];
for(let i of range(8)) {
    let out = (rule>>i)&1;
    let in0 = (i>>2)&1;
    let in1 = (i>>1)&1;
    let in2 = i&1;
    (out?black_tiles:white_tiles).push( cell(in0,in1,in2,out) );
}

fs.writeFileSync("black.svg", render_to_svg(layout(black_tiles), 1, 72/2.54, "#444"))
fs.writeFileSync("white.svg", render_to_svg(layout(white_tiles), 1, 72/2.54, "#ddd"))