
self.importScripts("sampler.js");

self.onmessage = function(msg) { 
    self.postMessage(eval(msg.data)); 
}
