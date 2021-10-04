"use strict";

// TODO: WaveFunctionCollapse validity checking
// TODO: weight by compressability (see WFC entropy heuristic)


function* range(length) {
    for(let i=0;i<length;i++) yield i;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function get_samples(n, choices, effort, valid, callback) {
    let n_choices = choices.length;
    let words = [ "" ];
    
    let last_callback = 0;

    for(let i of range(n)) {
        let todo = Array.from(range(words.length * n_choices));
        shuffle(todo);

        let new_words = [ ];
        for(let j of todo) {
            let item = words[j/n_choices>>0] + choices[j % n_choices];
            if (!valid(item)) continue;
            new_words.push(item);
            if (new_words.length >= effort) break;
        }

        words = new_words;
        
        if (callback !== null && Date.now() > last_callback + 10) {
            callback(words);
            last_callback = Date.now();
        }
    }

    return words;
}

class Validity {
    constructor(width, height, choices) {
        this.width = width;
        this.height = height;
        this.choices = choices;
    }

    sample(effort, callback) {
        let resulter = (words, finished) => ({ 
            words:words, 
            effort:effort, 
            finished:finished, 
            ...this
        });
        function callback2(words) { 
            if (callback !== null)
                callback(resulter(words, false)); 
        }

        let words = get_samples(
            this.width*this.height, 
            this.choices, 
            effort, 
            this.check.bind(this),
            callback2);

        return resulter(words, true);
    }
}


class Validity_block extends Validity {
    constructor(width, height, choices, pat_width, pat_height, valids) {
        super(width, height, choices);

        this.pat_width = pat_width;
        this.pat_height = pat_height;

        let n = this.pat_width*this.pat_height;
        this.valid = Array.from(range(n+1), i => new Set());
        for(let i of range(n+1)) {
            for(let word of valids) {
                this.valid[i].add( word.slice(0,i) );
            }
        }
    }

    check(word) {
        let i = word.length-1;
        let x_last = i % this.width;
        let y_last = (i / this.width)>>0;

        for(let pat_n=this.pat_width*this.pat_height;pat_n>0;pat_n--) {
            let pat_x_last = (pat_n-1) % this.pat_width;
            let pat_y_last = ((pat_n-1) / this.pat_width)>>0;
            let x_start = x_last - pat_x_last;
            let y_start = y_last - pat_y_last;

            if (x_start < 0 ||
                y_start < 0 || 
                x_start+this.pat_width > this.width ||
                y_start+this.pat_height > this.height)
                continue;

            let subword = "";
            for(let i=0;i<pat_n;i++) {
                let y = y_start + ((i/this.pat_width)>>0);
                let x = x_start + i%this.pat_width;
                subword += word[y*this.width+x];
            }
        
            if (!this.valid[pat_n].has(subword))
                return false;
            
            // Finish early ?????????????????
            if (pat_x_last == 0)
                break;
        }
        
        return true;
    }
}

class Validity_pat extends Validity {
    constructor(width, height, xs, ys, valids) {
        // xs and ys should be in raster order
        
        let choices = new Set();
        for(let word of valids)
            for(let choice of word)
                choices.add(choice);
        choices = Array.from(choices);
        
        super(width, height, choices);
        
        let n = xs.length;
        xs = xs.map(x => x-xs[n-1]);
        ys = ys.map(y => y-ys[n-1]);

        this.xs = xs;
        this.ys = ys;

        this.valid = [ ];
        for(let i=0;i<=n;i++) {
            for(let j=i+1;j<=n;j++) {
                let a_valid = {
                    xs : xs.slice(i,j).map(x => x-xs[j-1]),
                    ys : ys.slice(i,j).map(y => y-ys[j-1]),
                    words : new Set()
                };                 
                for(let word of valids) {
                    a_valid.words.add( word.slice(i,j) );
                }
                this.valid[this.valid.length] = a_valid;
            }
        }
    }
    
    check(word) {
        let i = word.length-1;
        let x_last = i % this.width;
        let y_last = (i / this.width)>>0;

        outer: for(let valid of this.valid) {
            let subword = "";
            for(let i=0;i<valid.xs.length;i++) {
                let y = y_last + valid.ys[i];
                let x = x_last + valid.xs[i];
                if (x < 0 || y < 0 || x >= this.width)
                    continue outer;
                subword += word[y*this.width+x];
            }
        
            if (!valid.words.has(subword))
                return false;
        }
        
        return true;
    }
}


function run_job(width, height, xs, ys, valids, effort) {
    let validity = new Validity_pat(width, height, xs,ys,valids);
    let result = validity.sample(effort, result => self.postMessage(result));        
    self.postMessage(result);
}
