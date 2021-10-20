
/* 
Example invocation of the sampler. 

This can be run in node:

    node experiments/test.js

*/

let fs = require("fs");
let vm = require("vm");
vm.runInThisContext(fs.readFileSync("sampler.js"))

let spec = {xs:[1,0,1],ys:[0,1,1],valids:["   "," ##","# #","## "]};
let val = make_validity(20, 10, [spec], 1e6);

let result = val.sample(10, null);

for(word of result.words) {
    for(y of range(val.height)) 
        console.log(word.slice(y*val.width,(y+1)*val.width));
    console.log("");
}

console.log(val.comment);
