"use strict";

// TODO: multiple "masks"
//       A color choice is valid if each position in each mask is satisfied by a part of the pattern picture.
//
// - "join masks" as initial step, then work with one mask henceforth
// ##   #  #    provides hex-tile masks
//     #   #
//
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

function get_subword(word, indices) {
    //let subword = "";
    //for(let i of indices)
    //    subword += word[i];
    //return subword;
    
    return indices.map(i => word[i]).join("");
}

/* Sample a set of words produced by making [n] choices amongst [choices].

   initial is an initial blank slate.
   
   get_advancer returns a function to advance a word by making the ith choice. If the choice is invalid, the function will return null.

   callback is periodically called back with current set of words.
 */
function get_samples(initial, n, choices, effort, get_advancer, callback) {
    let n_choices = choices.length;
    let saturated = null;
    let words = [ initial ];
    
    let last_callback = Date.now();

    for(let i of range(n)) {
        let todo = Array.from(range(words.length * n_choices));
        shuffle(todo);
        
        let advancer = get_advancer(i);

        let new_words = [ ];
        for(let j of todo) {
            let item = advancer(words[j/n_choices>>0], choices[j % n_choices]);
            if (item === null) continue;
            new_words.push(item);
            if (new_words.length >= effort) break;
        }
        
        if (saturated === null && new_words.length >= effort)
            saturated = i;

        words = new_words;
        
        if (callback !== null && Date.now() > last_callback + 200) {
            callback({words, saturated});
            last_callback = Date.now();
        }
    }

    return {words, saturated};
}


class Validity {
    constructor(width, height, initial, choices) {
        this.width = width;
        this.height = height;
        this.initial = initial;
        this.choices = choices;
    }

    sample(effort, callback) {
        if (callback === null) 
            callback = ()=>null;
        
        let resulter = (result, finished) => {
            let output = { 
                ...result, 
                width:this.width,
                height:this.height,
                choices:this.choices,
                effort:effort, 
                finished:finished
            }
            
            //Only report one sample while running, save some time decoding.
            if (!finished) output.words = output.words.slice(0,1);
            
            output.words = output.words.map(item => this.get_state_word(item));
            return output;
        };
        function callback2(words) { 
            callback(resulter(words, false)); 
        }

        let words = get_samples(
            this.initial,
            this.width*this.height, 
            this.choices, 
            effort, 
            this.get_advancer.bind(this),
            callback2);

        return resulter(words, true);
    }
    
    get_state_word(state) { return state; }
}


class Validity_pat extends Validity {
    constructor(width, height, xs, ys, valids) {
        let choices = new Set();
        for(let word of valids)
            for(let choice of word)
                choices.add(choice);
        choices = Array.from(choices);
        
        super(width, height, "", choices);
        
        this.xs = xs;
        this.ys = ys;
        this.valids = valids;
        
        this.subvalid_cache = { };
    }
    
    get_advancer(i) {
        let check = this.get_check(i);
        
        return (word, choice) => {
            let new_word = word + choice;
            if (!check(new_word)) return null;
            return new_word;
        }
    }
    
    // Returns a function to check words of a given length
    get_check(i) {
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
            
            checks.push({word_index, valid_index});
        }
        
        checks.sort( (a,b) => b.word_index.length-a.word_index.length );
        
        // Remove any checks entirely contained in another check.
        // ** Assumes valids have been pruned. **
        let c=0;
        //console.log([checks.length]);
        while(c<checks.length) {
            let subsumed = false;
            outer: for(let j=0;j<c;j++) {
                for(let k=0;k<checks[c].word_index.length;k++)
                if (checks[j].word_index.indexOf( checks[c].word_index[k] ) == -1)
                       continue outer;
                
                subsumed = true;
                continue
            }
            
            if (subsumed) {
                checks.splice(c,1);
            } else
                c++;
        }
        //console.log([checks.length, "to"]);

        for(let check of checks) {        
            let key = JSON.stringify(check.valid_index);
            if (!this.subvalid_cache.hasOwnProperty(key)) {
                let subvalids = new Set();
                for(let valid of this.valids) {
                    subvalids.add(Symbol.for( get_subword(valid, check.valid_index) ));
                }
                //check.subvalids = subvalids;
                //console.log(["key", key]);
                this.subvalid_cache[key] = subvalids;
            }
        
            check.subvalids = this.subvalid_cache[key]
        }
        
        return (word) => {
            for(let check of checks)
            if (!check.subvalids.has(Symbol.for( get_subword(word, check.word_index) )))
                return false;
            
            return true;
        }
    }
}

// WaveFunctionCollapse-like validity checking
// Note: Unlike WFC, this makes choices in raster scan order.
class Validity_WFC extends Validity {
    constructor(width, height, xs, ys, valids) {
        let choices = new Set();
        for(let word of valids)
            for(let choice of word)
                choices.add(choice);
        choices = Array.from(choices);
        
        super(width, height, ["", new Uint8Array(width*height*choices.length).fill(1)], choices);
        
        this.choices = choices;
        this.choice_map = { };
        for(let i of range(choices.length))
            this.choice_map[choices[i]] = i;
        
        this.width = width;
        this.height = height;
        this.n = this.width*this.height;
        this.nc = choices.length;
        
        this.xs = xs;
        this.ys = ys;
        this.valids = valids.map(word => 
            Array.from(word).map(c => 
                this.choice_map[c]));
    }
    
    get_state_word(state) { return state[0]; }
    
    get_advancer(i) {
        return (state, choice) => {
            let [word, on] = state;
            on = new Uint8Array(on);
            
            if (!this.set(on, word.length, this.choice_map[choice]))
                return null;
            
            return [word+choice, on];
        }
    }
    
    set(on, i, c) {
        for(let j=0;j<this.nc;j++)
        if (j != c)
            on[i*this.nc+j] = false;
        
        return this.propagate_checks(on, i);
    }
    
    propagate_checks(on, i) {
        let xs=this.xs, ys=this.ys, width=this.width, height=this.height, nc=this.nc;
        
        let todo = new Set();
        //todo.add(i);
        let xi = i % width;
        let yi = (i / width)>>0;
        
        for(let cind=0;cind<xs.length;cind++)
        for(let ind=0;ind<xs.length;ind++) {
            let x = xi + xs[ind] - xs[cind];
            let y = yi + ys[ind] - ys[cind];
            if (x < 0 || y < 0 || x >= width || y >= height)
                continue;
            if (y*width+x >= i) //Assumes raster scan choices.
                todo.add(y*width+x);
        }            
        
        
        while(todo.size) {
            let i = Math.min(...todo);
            todo.delete(i);
            
            let [any_good, any_changed] = this.check(on, i);
            
            if (!any_good)
                return false;
            
            if (!any_changed)
                continue;
            
            let xi = i % width;
            let yi = (i / width)>>0;
            
            for(let cind=0;cind<xs.length;cind++)
            for(let ind=0;ind<xs.length;ind++) {
                let x = xi + xs[ind] - xs[cind];
                let y = yi + ys[ind] - ys[cind];
                if (x < 0 || y < 0 || x >= width || y >= height)
                    continue;
                if (y*width+x >= i) //Assumes raster scan choices
                    todo.add(y*width+x);
            }            
        }
        
        return true;
    }
    
    // Update validity of each choice at position i in on
    check(on, i) {
        let nc=this.nc, n=this.n, xs=this.xs, ys=this.ys, width=this.width, height=this.height;
        let xi = i % width;
        let yi = (i / width)>>0;
        let any_good = false, any_changed = false;
        
        check_choices: for(let j=0;j<nc;j++) {
            if (!on[i*nc+j]) continue;
        
            check_centers: for(let cind=0;cind<xs.length;cind++) {
                check_valids: for(let valid of this.valids) {
                    for(let ind=0;ind<xs.length;ind++) {
                        let x = xi + xs[ind] - xs[cind];
                        let y = yi + ys[ind] - ys[cind];
                        if (x < 0 || y < 0 || x >= width || y >= height)
                            continue;
                        if (!on[(y*width+x)*nc+valid[ind]])
                            continue check_valids;
                    }
                    
                    // A valid matched, continue
                    continue check_centers;
                }
                
                // No valids matched, ban choice
                on[i*nc+j] = 0;
                any_changed = true;
                continue check_choices;
            }
            
            // The choice was not banned
            any_good = true;
        }
        
        return [any_good, any_changed];
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



// Tile elaborate: for xs,ys,valids,  tilex,tiley
// new choices become choices^tail.length
// enumerate all valids^tile.length, check self-consistency

function thick_tiles(xo, yo, xs, ys, valids) {
    let choices = new Set();
    for(let word of valids)
        for(let choice of word)
            choices.add(choice);
    choices = Array.from(choices);
    
    let choice_map = { };
    for(let i of range(choices.length))
        choice_map[choices[i]] = i;
    
    let nc = choices.length;
    let nv = xs.length;
    
    let must_match = [ ];
    
    for(let i of range(nv))
    for(let j of range(nv))
    if (xs[i] == xs[j]+xo && ys[i] == ys[j]+yo)
        must_match.push( [i,j] );
    
    let new_valids = [ ];
    for(let valid1 of valids) {
        outer: for(let valid2 of valids) {
            for(let [i,j] of must_match)
                if (valid1[i] != valid2[j])
                    continue outer;
            
            let new_valid = "";
            for(let i of range(nv))
                new_valid += String.fromCodePoint( choice_map[valid1[i]]*nc+choice_map[valid2[i]] );
            new_valids.push(new_valid);
        }
    }
    
    let demap = { };
    for(let i of range(nc))
    for(let j of range(nc))
        demap[ String.fromCodePoint(i*nc+j) ] = choices[i]+choices[j];
    
    return { valids:new_valids, demap }
}

class Validity_wider extends Validity {
    constructor(make_sub, width, height, xs, ys, valids) {
        let thick = thick_tiles(1,0, xs,ys,valids);
        let sub = make_sub(width-1, height, xs, ys, thick.valids);
    
        super(width,height,sub.initial,sub.choices);
        
        this.sub = sub;
        this.demap = thick.demap;
    }
    
    get_state_word(state) {
        state = this.sub.get_state_word(state);
        
        let result = "";
        let i=0;
        outer: for(let y of range(this.height))
            for(let x of range(this.width-1)) {
                if (i >= state.length) break outer;
                if (x == this.width-2)
                    result += this.demap[state[i]];
                else
                    result += this.demap[state[i]][0];
                i++;
            }
        
        return result;
    }
    
    get_advancer(i) { return this.sub.get_advancer(i); }
}

class Validity_higher extends Validity {
    constructor(make_sub, width, height, xs, ys, valids) {
        let thick = thick_tiles(0,1, xs,ys,valids);
        let sub = make_sub(width, height-1, xs, ys, thick.valids);
    
        super(width,height,sub.initial,sub.choices);
        
        this.sub = sub;
        this.demap = thick.demap;
    }
    
    get_state_word(state) {
        state = this.sub.get_state_word(state);

        let result = "", result_extra = "";
        let i=0;
        outer: for(let y of range(this.height-1))
            for(let x of range(this.width)) {
                if (i >= state.length) break outer;
                result += this.demap[state[i]][0];
                if (y == this.height-2)
                    result_extra += this.demap[state[i]][1];
                i++;
            }
        
        return result + result_extra;
    }
    
    get_advancer(i) { return this.sub.get_advancer(i); }
}

// complete failure
function make_stack(thick_width, thick_height, width, height, xs, ys, valids) {
    console.log( valids.length );
    if (thick_width <= 0 && thick_height <= 0) {
        let result = new Validity_WFC(width, height, xs, ys, valids);
        console.log(result.choices.length + " choices");
        return result;
    }
    
    if (thick_width > thick_height)
        return new Validity_wider( (...p) => make_stack(thick_width-1, thick_height, ...p), width, height, xs, ys, valids )
    
    return new Validity_higher( (...p) => make_stack(thick_width, thick_height-1, ...p), width, height, xs, ys, valids )
}


/* Perform an inner join on two sets of patterns, using their overlapping positions. */
function join(x0s, y0s, valid0s, x1s, y1s, valid1s, max_memory) {    
    let new_xs = x0s.slice();
    let new_ys = y0s.slice();
    let new_valids = [ ];
    let grab1 = [ ];
    let must_match0 = [ ];
    let must_match1 = [ ];
    let memory = 0;

    outer: for(let i of range(x1s.length)) {
        for(let j of range(x0s.length))
        if (x1s[i] == x0s[j] && y1s[i] == y0s[j]) {
            must_match0.push(j);
            must_match1.push(i);
            continue outer;
        }
        grab1.push(i);
        new_xs.push(x1s[i]);
        new_ys.push(y1s[i]);
    }
    
    let subword_valid1 = { };
    for(let valid1 of valid1s) {
       let subword = get_subword(valid1, must_match1);
       if (!subword_valid1.hasOwnProperty(subword))
          subword_valid1[subword] = [ ];
        subword_valid1[subword].push(valid1);
    }
    
    for(let valid0 of valid0s) {
        let subword = get_subword(valid0, must_match0);
        if (!subword_valid1.hasOwnProperty(subword))
            continue;
        for(let valid1 of subword_valid1[subword]) {
            let new_word = valid0 + get_subword(valid1, grab1)
            new_valids.push(new_word);
            
            memory += new_word.length;
            if (memory > max_memory) return null;
        }
    }
    
    return {xs:new_xs, ys:new_ys, valids:new_valids};
}


/* Join a set of patterns to an offset version of itself. */
function elaborate(x1, y1, xs, ys, valids, max_memory) {
    let x1s = xs.map(x => x+x1);
    let y1s = ys.map(y => y+y1);
    return join(xs,ys,valids, x1s,y1s,valids, max_memory);
}


/* Remove any patterns that can not overlap any other patterns (for all possible offsets). */
function prune(xs, ys, valids) {
    let all_overlaps = [ ];

    for(let i of range(xs.length))
    for(let j of range(xs.length))
    if (i != j) {
        let overlap = [ xs[j]-xs[i], ys[j]-ys[i] ];
        if (overlap[1]<0 || (overlap[1]==0 && overlap[0]<=0)) continue;
        if (all_overlaps.filter(item=> item[0]==overlap[0] && item[1]==overlap[1]).length) continue;
        all_overlaps.push(overlap);
    }
    
    while(true) { 
        let any = false;
        for(let [x1,y1] of all_overlaps) {
            let must_match0 = [ ];
            let must_match1 = [ ];
            outer: for(let i of range(xs.length)) {
                for(let j of range(xs.length))
                if (xs[i]+x1 == xs[j] && ys[i]+y1 == ys[j]) {
                    must_match0.push(j);
                    must_match1.push(i);
                    continue outer;
                }
            }
            
            let subwords0 = valids.map(valid => get_subword(valid, must_match0));
            let subwords1 = valids.map(valid => get_subword(valid, must_match1));
            let set0 = new Set(subwords0);
            let set1 = new Set(subwords1);
            
            let new_valids = [ ];
            for(let i of range(valids.length))
            if (set1.has(subwords0[i]) && set0.has(subwords1[i]))
                new_valids.push(valids[i]);
                                 
            any = any || (valids.length > new_valids.length);
            valids = new_valids;
        }
        
        if (!any) break;
    }
        
    return valids;
}


function run_job(width, height, specs, effort, max_memory) {
    if (specs.length == 0) 
        specs = [{xs:[], ys:[], valids:[]}];
    
    let spec = specs[0];
    spec.valids = prune(spec.xs, spec.ys, spec.valids);
    for(let i=1;i<specs.length;i++) {
        spec = join(spec.xs,spec.ys,spec.valids, specs[i].xs,specs[i].ys,specs[i].valids, Infinity);
        spec.valids = prune(spec.xs, spec.ys, spec.valids);
    }
    
    let spec_initial_p = spec.xs.length;
    let spec_initial_n = spec.valids.length;

    //let max_memory = 50e6;
    let seq = "";
    let new_spec;
    for(let i of range(4)) {
        new_spec = elaborate(1,0, spec.xs, spec.ys, spec.valids, max_memory);
        if (new_spec === null) break;
        spec = new_spec;
        spec.valids = prune(spec.xs, spec.ys, spec.valids);
        seq += "→";
        
        new_spec = elaborate(0,1, spec.xs, spec.ys, spec.valids, max_memory);
        if (new_spec === null) break;
        spec = new_spec;
        spec.valids = prune(spec.xs, spec.ys, spec.valids);
        seq += "↓";
    }

    //spec.valids = prune(spec.xs, spec.ys, spec.valids);
        
    let comment = `Initial ${spec_initial_p}:${spec_initial_n} patterns expanded to ${spec.xs.length}:${spec.valids.length} (${seq}).`;
    
    let validity = new Validity_pat(width, height, spec.xs,spec.ys,spec.valids);

    let result = validity.sample(effort, result => self.postMessage({...result, comment}));        
    self.postMessage({...result, comment});
}
