"use strict";

// TODO: WaveFunctionCollapse validity checking


function* range(length) {
    for(let i=0;i<length;i++) yield i;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function get_samples(n, choices, effort, valid) {
    let n_choices = choices.length;
    let words = [ "" ];

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
    }

    return words;
}

class Picture {
    constructor(width, height, initial) {
        this.width = width;
        this.height = height;
        if (initial.length == 1)
            initial = initial.repeat(width*height);
        this.word = initial;
    }

    get(x,y) {
        return this.word[y*this.width+x];
    }

    set(x,y,c) {
        let i = y*this.width+x;
        this.word = this.word.slice(0,i)+c+this.word.slice(i+1,this.width*this.height);
    }

    get_part(x,y,w,h) {
        let new_word = "";
        for(let i of range(h))
            new_word += this.word.slice((y+i)*this.width+x,(y+i)*this.width+x+w);
        return new Picture(w,h,new_word);
    }

    get_rot() {
        let new_word = "";
        for(let x=this.width-1;x>=0;x--)
            for(let y=0;y<this.height;y++)
                new_word += this.get(x,y);
        return new Picture(this.height, this.width, new_word);
    }
}

class Validity {
    constructor(width, height, pat_width, pat_height, choices, valids) {
        this.width = width;
        this.height = height;
        this.pat_width = pat_width;
        this.pat_height = pat_height;
        this.choices = choices;

        let n = this.pat_width*this.pat_height;
        this.valid = Array.from(range(n+1), i => new Set());
        for(let i of range(n+1)) {
            for(let word of valids) {
                this.valid[i].add( word.slice(0,i) );
            }
        }
    }

    sample(effort) {
        let words = get_samples(
            this.width*this.height, 
            this.choices, 
            effort, 
            this.check.bind(this));

        return {words:words, effort:effort, ...this};
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



