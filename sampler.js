"use strict";

// TODO: multiple "masks"
//       A color choice is valid if each position in each mask is satisfied by a part of the pattern picture.
// TODO: WaveFunctionCollapse validity checking
// TODO: weight by compressability (see WFC entropy heuristic)


function* range(length) {
    for(let i=0;i<length;i++) yield i;
}

function random_choice(array) {
    return array[Math.floor(array.length * Math.random())];
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function get_samples(n, choices, effort, get_check, callback) {
    let n_choices = choices.length;
    let saturated = null;
    let words = [ "" ];
    
    let last_callback = Date.now();

    for(let i of range(n)) {
        let todo = Array.from(range(words.length * n_choices));
        shuffle(todo);
        
        let check = get_check(i+1);

        let new_words = [ ];
        for(let j of todo) {
            let item = words[j/n_choices>>0] + choices[j % n_choices];
            if (!check(item)) continue;
            new_words.push(item);
            if (new_words.length >= effort) break;
        }
        
        if (saturated === null && new_words.length >= effort)
            saturated = i;

        words = new_words;
        
        if (callback !== null && Date.now() > last_callback + 100) {
            callback({words, saturated});
            last_callback = Date.now();
        }
    }

    return {words, saturated};
}


class Validity {
    constructor(width, height, choices) {
        this.width = width;
        this.height = height;
        this.choices = choices;
    }

    sample(effort, callback) {
        if (callback === null) 
            callback = ()=>null;
        
        let resulter = (result, finished) => ({ 
            ...this,
            ...result, 
            effort:effort, 
            finished:finished, 
        });
        function callback2(words) { 
            callback(resulter(words, false)); 
        }

        let words = get_samples(
            this.width*this.height, 
            this.choices, 
            effort, 
            this.get_check.bind(this),
            callback2);

        return resulter(words, true);
    }
}


class Validity_pat extends Validity {
    constructor(width, height, xs, ys, valids) {
        let choices = new Set();
        for(let word of valids)
            for(let choice of word)
                choices.add(choice);
        choices = Array.from(choices);
        
        super(width, height, choices);
        
        this.xs = xs;
        this.ys = ys;
        this.valids = valids;
    }
    
    // Returns a function to check words of a given length
    get_check(word_length) {
        let i = word_length-1;
        let x_last = i % this.width;
        let y_last = (i / this.width)>>0;
        let checks = [ ];
        
        for(let j=0;j<this.xs.length;j++) {
            let valid_index = [ ];
            let word_index = [ ];

            for(let k=0;k<this.xs.length;k++) {
                let y = y_last + this.ys[k]-this.ys[j];
                let x = x_last + this.xs[k]-this.xs[j];
                if (x < 0 || y < 0 || x >= this.width || y*this.width+x > i)
                    continue;
                valid_index.push(k);
                word_index.push(y*this.width+x);
            }
            
            if (valid_index.length <= 1) 
                continue;
            
            let subvalids = new Set();
            for(let valid of this.valids) {
                subvalids.add( valid_index.map(j => valid[j]).join("") );
            }
            
            checks.push({word_index, subvalids});
        }
        
        return (word) => {
            for(let check of checks) {
                let subword = check.word_index.map(i => word[i]).join("");
                if (!check.subvalids.has(subword))
                    return false;
            }
            
            return true;
        }
    }
}


//function expand(max_width, max_height, xs,ys,words, max_elaboration) {
//    function saturation_abort(status) {
//        if (status.saturated !== null)
//            throw "saturated";
//    }
//    
//    let width = Math.max(...xs)-Math.min(...xs)+1;
//    let height = Math.max(...ys)-Math.min(...ys)+1;
//    let best = { xs,ys,words };
//   
//    let val, result;
//    console.log("hi");
//    
//    while(width <= max_width && height <= max_height) {
//        val = new Validity_pat(width, height, best.xs, best.ys, best.words);
//        try {
//            result = val.sample(max_elaboration, saturation_abort);
//        } catch(e) { 
//            if (e !== "saturated") throw e; 
//            result = null; 
//        }
//        
//        console.log("step");
//        console.log(result)
//        if (result === null || result.saturated !== null) break;
//        
//        best = {xs:[], ys:[], words:result.words};
//        for(let y of range(width))
//        for(let x of range(height)) {
//            best.xs.push(x);
//            best.ys.push(y);
//        }
//        //break;
//        
//        if (width < height)
//            width++;
//        else
//            height++;
//        console.log([width, height]);
//    }
//    
//    return best;
//}


function run_job(width, height, xs, ys, words, effort) {
    //let best = expand(width, height, xs,ys,words, 100000);
    //console.log(best);

    let validity = new Validity_pat(width, height, xs,ys,words);
    let result = validity.sample(effort, result => self.postMessage(result));        
    self.postMessage(result);
}
