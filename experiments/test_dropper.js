

let fs = require("fs");
let vm = require("vm");
vm.runInThisContext(fs.readFileSync("sampler.js"))

console.log(Array.from( drop_all([1,2,3,4], [1,2,3,1e6])))