
let fs = require("fs");
let vm = require("vm");
vm.runInThisContext(fs.readFileSync("sampler.js"))

if (false) {
    let result = thick_tiles(0,1, [1,0,1], [0,1,1], ["   "," ##","# #","## "]);

    console.log(result);
}

if (true) {
    //let val = new Validity_pat(80,20, [1,0,1], [0,1,1], ["   "," ##","# #","## "]);

    //let val = new Validity_WFC(20,10, [1,0,1], [0,1,1], ["   "," ##","# #","## "]);
    //let val = new Validity_wider((...p) => new Validity_pat(...p), 20,10, [1,0,1], [0,1,1], ["   "," ##","# #","## "]);
    //let val = make_stack(2,2,  20,10, [1,0,1], [0,1,1], ["   "," ##","# #","## "]);
    
    let spec = {xs:[1,0,1],ys:[0,1,1],valids:["   "," ##","# #","## "]};
    spec = elaborate(1,0, spec.xs, spec.ys, spec.valids);
    spec = elaborate(0,1, spec.xs, spec.ys, spec.valids);
    console.log(spec);
    let val = new Validity_pat(20,10, spec.xs,spec.ys,spec.valids);

    let result = val.sample(10, null);

    for(word of result.words) {
        for(y of range(val.height)) 
            console.log(word.slice(y*val.width,(y+1)*val.width));
        console.log("");
    }
}
