
self.importScripts("sampler.js");

self.onmessage = function(msg) { 
    eval(msg.data); 
}
