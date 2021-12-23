#!/usr/bin/env node
"use strict";

let fs = require("fs");
let commander = require("commander");

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
    
    dot(other) {
        return this.x*other.x+this.y*other.y;
    }

    cos(other) {
        return Math.max(-1,Math.min(1,
            this.dot(other)/(this.length()*other.length())));
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

function node(p,vneg,vpos) { return new Node(p,vneg,vpos); }

function flat(x,y,dx,dy) { return new Node(xy(x,y),xy(-dx,-dy),xy(dx,dy)); }

function good_bezier(p0,v0, p1,v1) {
    v0 = v0.scale(1/v0.length());
    v1 = v1.scale(1/v1.length());
    let cos = v0.cos(v1);
    
    //For arc
    //https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
    //let angle = Math.acos(Math.min(dot,1));
    //let n = 2*Math.PI / angle;
    //let straight_line_length = Math.sqrt( (1-Math.cos(2*Math.PI/n))**2+Math.sin(2*Math.PI/n)**2 );
    //s = 4*Math.tan(Math.PI/(2*n)) / straight_line_length;
    
    //let straight_line_length = Math.sin(angle/2)*2;
    //s = 4*Math.tan(angle/4) / straight_line_length;
    
    // Wolfram Alpha says
    let s = 2/(Math.cos(Math.acos(cos)*0.5)+1);

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

function flip(path) {
    let result = path.map(node => node.rot(180).rev());
    result.reverse();
    return result;
}

function put(p,rot,scale,path) {
    return path.map(node => node.rot(rot).scale(scale).add(p));
}

function preprocess(items, opts) {
    let max_turn = opts.maxturn;
    let run_in = opts.runin * 72/2.54;

    let max_cos = Math.cos(max_turn*Math.PI/180);

    let splits = [ ];
    for(let i of range(items.length))
    if (items[i].vneg.cos(items[i].vpos) >= max_cos)
        splits.push(i);
    
    // Smooth loop
    if (splits.length == 0) {
        return [ items.concat([ items[0] ]) ];
    }

    let cuts = [ 
        [...items.slice(splits[splits.length-1],items.length), ...items.slice(0,splits[0]+1)] 
    ];
    for(let i of range(splits.length-1)) {
        cuts.push(items.slice(splits[i],splits[i+1]+1));
    }

    let result = [ ];
    for(let cut of cuts) {
        let a = cut[0];
        //let astep = a.vpos.scale(-run_in/a.vpos.length());
        let astep = a.vneg.scale(-run_in/a.vneg.length());
        let b = cut[cut.length-1];
        //let bstep = b.vneg.scale(-run_in/b.vneg.length());
        let bstep = b.vpos.scale(-run_in/b.vpos.length());
        result.push([
            node(a.p.add(astep),astep,astep.scale(-1)),
            node(a.p,astep,a.vpos),
            ...cut.slice(1,cut.length-1),
            node(b.p,b.vneg,bstep),
            node(b.p.add(bstep),bstep.scale(-1),bstep),
        ]);
    }

    return result;
}

function render_to_path(items) {
    let result = `M ${items[0].p.x} ${items[0].p.y} `;

    for(let i of range(items.length-1)) {
        let j = i+1;
        if (items[j].p.sub(items[i].p).length() < 1e-6) continue;
        
        let [b,c] = good_bezier(items[i].p,items[i].vpos, items[j].p,items[j].vneg.scale(-1));
        result += `C ${b.x} ${b.y}, ${c.x} ${c.y}, ${items[j].p.x} ${items[j].p.y} `;
    }

    //result += "Z ";

    return result;
}

function render_to_svg(filename, paths, padding, scale, opts) {
    // svg uses flipped y coordinates
    paths = paths.map(path => path.map(node => node.scale(scale).mirror_y()));
    padding *= scale;

    let cuts = [ ];
    for(let path of paths)
        cuts.push(...preprocess(path, opts));

    let all_nodes = [].concat(...cuts);
    let min_x = Math.min(...all_nodes.map(node=>node.p.x));
    let min_y = Math.min(...all_nodes.map(node=>node.p.y));
    let max_x = Math.max(...all_nodes.map(node=>node.p.x));
    let max_y = Math.max(...all_nodes.map(node=>node.p.y));

    let width = max_x-min_x+padding*2;
    let height = max_y-min_y+padding*2;
    let offset = xy(padding-min_x, padding-min_y);
    
    console.log(`${filename} ${width/72*2.54}cm x ${height/72*2.54}cm`);

    let result = `<svg version="1.1" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    result += `<path d="`;
    for(let cut of cuts) {
        result += render_to_path(cut.map(node => node.add(offset)));
    }
    result += `" fill="none" stroke="black"/>`;
    result += `</svg>`;

    fs.writeFileSync(filename, result);
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

let inie = flip(outie);

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

//let corner = rounded_polyline(1, [
//    xy(0,0),
//    xy(0,2),
//    xy(-2,2),
//    xy(-2,0),
//    xy(0,0),
//]);

let big_bang = [
//        ...put(-1,1, 0, s, corner),
    
//        ...put(1,1,  90, s, corner),
        flat(-1,0, 0,1),
        flat(1,0, 0,-1),

        ...put(xy(1,-1),  180, 1/5, corner),
        ...put(xy(0,-1), 180,  1/5, outie),

        ...put(xy(-1,-1), 270, 1/5, corner),
    
];

function cell(in0,in1,in2,out) {
    let s = 1/5;
    let s1 = 1/5;
    let o = 1/5;
    return [
        ...put(xy(-1,1), 0, s, corner),
        ...put(xy(0,1), 0, s1, in1?inie:[]),
    
        ...put(xy(1,1),  90, s, corner),
        ...put(xy(1,0-o),  90, s, in2?(in1?inout:inie):(in1?outie:[])),

        ...put(xy(1,-1),  180, s, corner),
        ...put(xy(0,-1), 180, s1, out?outie:[]),

        ...put(xy(-1,-1), 270, s, corner),
        ...put(xy(-1,0-o), 270, s, in0?(in1?inout:inie):(in1?outie:[])),        
    ];
}

function layout(paths, row, step_x, step_y) {
    let result = [ ];
    for(let i of range(paths.length)) {
        result.push(put(xy( (i%row)*step_x, ((i/row)>>0)*step_y, ), 0,1, paths[i]));
    }
    return result;
}

function rep(items,n) {
    let result = [ ];
    for(let i of range(n))
        result.push(...items);
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

function make_automaton(opts) {
    let rule = opts.rule;
    let black_tiles = [ ];
    let white_tiles = [ ];
    for(let i of range(8)) {
        let out = (rule>>i)&1;
        let in0 = (i>>2)&1;
        let in1 = (i>>1)&1;
        let in2 = i&1;
        (out?black_tiles:white_tiles).push( cell(in0,in1,in2,out) );
    }

    render_to_svg("black.svg", layout(rep(black_tiles,opts.reps),4,3.7,3.25), 0.5, 1.5* 72/2.54, opts);
    render_to_svg("white.svg", layout(rep(white_tiles,opts.reps),4,3.7,3.25), 0.5, 1.5* 72/2.54, opts);
    render_to_svg("big_bang.svg", [big_bang], 2, 1.5* 72/2.54, opts);
}


function mid(p0,p1) {
    return xy((p0.x+p1.x)/2, (p0.y+p1.y)/2);
}

function vee(p0,p1,p2) {
    return node(p1, p0.sub(p1), p2.sub(p1));
}

function rhomb(ang, side0,side1,side2,side3) {
    let v = xy(2,0);

    let p0 = xy(0,0);
    let p1 = p0.add(v.rot(-ang));
    let p2 = p1.add(v.rot(ang));
    let p3 = p2.add(v.rot(180-ang));

    return [
        vee(p3,p0,p1),
        ...put(mid(p0,p1), -ang, 1, side0),
        vee(p0,p1,p2),
        ...put(mid(p1,p2), ang, 1, side1),
        vee(p1,p2,p3),
        ...put(mid(p2,p3), 180-ang, 1, side2),
        vee(p2,p3,p0),
        ...put(mid(p3,p0), 180+ang, 1, side3),
    ];
}

function make_penrose(opts) {

    let sideA = put(xy(1/3,0),0, 1/6, outie);// [node(xy(-0.5,0),v.rot(180),v.rot(90)), node(xy(0.5,0),v.rot(180-90),v)];
    let sideB = put(xy(1/3,0),0, 1/8, outie);//[node(xy(-0.5,0),v.rot(180),v.rot(135)), node(xy(0.5,0),v.rot(180-135),v)];

    let thin = rhomb(18, sideA,flip(sideA),sideB,flip(sideB));
    let thick = rhomb(36, flip(sideA),flip(sideB),sideB,sideA);

    thin = put(xy(0,0), -18,1, thin);
    thick = put(xy(0,0), -36*3,1, thick);

    render_to_svg("penrose-thin.svg", layout(rep([thin],24),3,3.4,1.75), 0.25, 2* 72/2.54, opts);
    render_to_svg("penrose-thick.svg", layout(rep([thick],16),4,2.6,3.25), 0.25, 2* 72/2.54, opts);
}

let opts = commander.program
    .option("--maxturn <number>", "Fishtail turns more acute than this. Zero to disable.", parseFloat, 80)
    .option("--runin <cm>", "Length of fishtail in cm.", parseFloat, 0.5)
    .option("--reps <n>", "Number of copies of each tile to output.", parseInt, 6)
    .option("--rule <number>", "Cellular automaton rule number.", parseInt, 30)
    .parse()
    .opts();
console.log(opts);

make_penrose(opts);
make_automaton(opts);

//make_automaton(30);

//global.x = 42;
//require("repl").start({useGlobal:true});

// Max-turn, run-in rendering options

// "Computation can be local."