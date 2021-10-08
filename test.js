
let fs = require("fs");
let vm = require("vm");
vm.runInThisContext(fs.readFileSync("sampler.js"))

let val = new Validity_pat(80,20, [1,0,1], [0,1,1], ["   "," ##","# #","## "]);

let result = val.sample(10, null);

for(word of result.words) {
    for(y of range(val.height)) 
        console.log(word.slice(y*val.width,(y+1)*val.width));
    console.log("");
}

