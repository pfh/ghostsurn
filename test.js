
let fs = require("fs");
let vm = require("vm");
vm.runInThisContext(fs.readFileSync("sampler.js"))


let val = new Validity(80,20, 2,2, "ab", ["aaaa","aabb","abab","abba","baaa","babb","bbab","bbba"]);

//console.log( get_samples(5*5, "ab", 10, word=>val.check(word)) )
//console.log( get_samples(10, "abc", 10, word=>true) )
//let dist = val.sample(10);

let dist = new Validity(80,20, 2,2, "ab", ["aaaa","aabb","abab","abba","baaa","babb","bbab","bbba"]).sample(10);

for(word of dist) {
    for(y of range(val.height)) 
        console.log(word.slice(y*val.width,(y+1)*val.width).replace(/a/g," "));
    console.log("");
}

