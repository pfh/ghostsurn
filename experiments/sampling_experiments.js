



function make_dropper(items, weights) {
    if (items.length == 0)
        return null;

    if (items.length == 1)
        return {leaf:true,item:items[0],n:1,weight:weights[0]};
    
    let mid = (items.length/2)>>0;
    let left = make_dropper(items.slice(0,mid), weights.slice(0,mid));
    let right = make_dropper(items.slice(mid,items.length), weights.slice(mid,items.length));
    return {leaf:false,n:left.n+right.n,weight:left.weight+right.weight,left:left,right:right};
}

function dropper_drop(dropper, total) {
    if (dropper.leaf)
        return [dropper.item, dropper.weight, null];
    
    let weight1 = total*dropper.left.n-dropper.left.weight;
    let weight2 = total*dropper.right.n-dropper.right.weight;

    let sub1 = dropper.left, sub2 = dropper.right;
    if (Math.random()*(weight1+weight2) > weight1)
        [sub1,sub2] = [sub2,sub1];
    
    let item, weight;
    [item, weight, sub1] = dropper_drop(sub1, total);
    
    if (sub1 === null)
        return [ item, weight, sub2 ];
    
    return [item, weight, {leaf:false,n:sub1.n+sub2.n,weight:sub1.weight+sub2.weight,left:sub1,right:sub2}];
}


/* Too easily drops an important thing */
function drop_all(items, weights) {
    let dropper = make_dropper(items, weights);
    let item, weight;
    let result = [ ];
    while(dropper !== null) {
        [item,weight,dropper] = dropper_drop(dropper, dropper.weight);
        result.push([item,weight]);
    }    
    result.reverse();
    return result;
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
