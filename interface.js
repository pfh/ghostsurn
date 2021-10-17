

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
    
    get_trim_top(blank) {
        let y = 0;
        outer: while(y < this.height) {
            for(let x of range(this.width))
            if (this.get(x,y) != blank)
                break outer;
            y++;
        }
        
        return new Picture(this.width, this.height-y, this.word.slice(y*this.width, this.height*this.width));
    }
    
    get_trim(blank) {
        let result = this;
        for(let i of range(4))
            result = result.get_trim_top(blank).get_rot();
        return result;
    }
    
    get_string() {
        return `${this.width}|${this.height}|${this.word}`;
    }
}

function string_to_picture(str) {
    let parts = str.split("|");
    if (parts.length != 3)
        return null;
        
    let [width,height,word] = parts;
    width = parseInt(width);
    height = parseInt(height);
    if (width * height !== word.length)
        return null;

    return new Picture(width, height, word);
}


function sp_get_int(sp, field, default_value) {
    let result = parseInt(sp.get(field));
    if (!Number.isInteger(result))
        result = default_value;
    return result;
}

function sp_get_str(sp, field, default_value) {
    let result = sp.get(field);
    if (typeof result !== "string")
        result = default_value;
    return result;
}

function sp_get_fixed_str(sp, field, default_value) {
    let result = sp.get(field);
    if (typeof result !== "string" || result.length != default_value.length)
        result = default_value;
    return result;
}

function sp_get_picture(sp, field, default_value) {
    let result = sp.get(field);
    if (result === null)
        return default_value;
    result = string_to_picture(result);
    if (result === null)
        return default_value;
    return result;
}

class Click_map {
    constructor(id, pic, choices, palette, onchange, color_get) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
        this.scale = 20;
        this.pic = pic;
        this.choices = choices;
        this.palette = palette;
        this.onchange = onchange;
        this.color_get = color_get;
        
        this.start_x = null;
        this.start_y = null;
        this.start_c = null;

        this.canvas.onclick = this.click.bind(this);
        this.canvas.onmousedown = this.down.bind(this);
        this.canvas.onmousemove = this.move.bind(this);
    }

    redraw() {
        this.canvas.width = this.pic.width*this.scale;
        this.canvas.height = this.pic.height*this.scale;
        
        let b=0.2;
        
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);

        for(let y of range(this.pic.height)) {
            for(let x of range(this.pic.width)) {
                this.ctx.fillStyle = this.palette[this.pic.get(x,y)];
                this.ctx.fillRect(x*this.scale+b/2,y*this.scale+b/2,this.scale-b,this.scale-b);
            }
        }    
    }
    
    where(e) {
        let rect = this.canvas.getBoundingClientRect();
        let x = ((e.clientX-rect.left)/this.scale)>>0;
        let y = ((e.clientY-rect.top)/this.scale)>>0;
        x = Math.max(0,Math.min(this.pic.width-1,x));
        y = Math.max(0,Math.min(this.pic.height-1,y));
        return [x,y];
    }

    click(e) {
        let [x,y] = this.where(e);
        let c;
        if (this.color_get !== null)
            c = this.color_get();
        else
            c = this.choices[(this.choices.search(this.pic.get(x,y))+1)%this.choices.length];
        
        if (x != this.start_x || y != this.start_y)
            return;
        
        if (this.pic.get(x,y) == c)
            return;
        
        this.pic.set(x,y,c);

        if (this.onchange !== null) 
            this.onchange();
    }
    
    down(e) {
        let [x,y] = this.where(e);
        this.start_x = x;
        this.start_y = y;
        this.start_c = this.pic.get(this.start_x,this.start_y);
    }
    
    move(e) {
        let [x,y] = this.where(e);
        if (e.buttons == 1 && 
            this.start_c != null && 
            this.start_c != this.pic.get(x,y)) {
            this.pic.set(x,y,this.start_c);
            if (this.onchange !== null) 
                this.onchange();            
        }
    }

    //todo: preview color on hover
    //todo: paint by dragging
}

