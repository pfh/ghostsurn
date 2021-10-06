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


class Validity_pat extends Validity {
    constructor(width, height, xs, ys, valids) {
        let choices = new Set();
        for(let word of valids)
            for(let choice of word)
                choices.add(choice);
        choices = Array.from(choices);
        
        super(width, height, choices);
        
        this.checks = [ ];
        for(let i=0;i<this.width*this.height;i++) {
            let x_last = i % this.width;
            let y_last = (i / this.width)>>0;
            
            this.checks[i] = [ ];
            
            for(let j=0;j<xs.length;j++) {
                let valid_index = [ ];
                let word_index = [ ];

                for(let k=0;k<xs.length;k++) {
                    let y = y_last + ys[k]-ys[j];
                    let x = x_last + xs[k]-xs[j];
                    if (x < 0 || y < 0 || x >= this.width || y*this.width+x > i)
                        continue;
                    valid_index.push(k);
                    word_index.push(y*this.width+x);
                }
                
                if (valid_index.length <= 1) 
                    continue;
                
                let subvalids = new Set();
                for(let valid of valids) {
                    subvalids.add( valid_index.map(j => valid[j]).join("") );
                }
                
                this.checks[i].push({
                    word_index:word_index,
                    subvalids: subvalids
                });
            }
        }
    }
    
    check(word) {
        let i = word.length-1;
        
        for(let check of this.checks[i]) {
            let subword = check.word_index.map(i => word[i]).join("");
            if (!check.subvalids.has(subword))
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
