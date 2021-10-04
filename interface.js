

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

class Click_map {
    constructor(id, pic, choices, palette, onchange) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
        this.scale = 20;
        this.pic = pic;
        this.choices = choices;
        this.palette = palette;
        this.onchange = onchange;
        
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

        for(let y of range(this.pic.height)) {
            for(let x of range(this.pic.width)) {
                this.ctx.fillStyle = this.palette[this.pic.get(x,y)];
                this.ctx.fillRect(x*this.scale,y*this.scale,this.scale,this.scale);
            }
        }    
    }

    click(e) {
        let rect = this.canvas.getBoundingClientRect();
        let x = ((e.clientX-rect.left)/this.scale)>>0;
        let y = ((e.clientY-rect.top)/this.scale)>>0;
        let c = this.choices[(this.choices.search(this.pic.get(x,y))+1)%this.choices.length];
        
        if (x != this.start_x || y != this.start_y)
            return;
        
        this.pic.set(x,y,c);

        if (this.onchange !== null) 
            this.onchange();
    }
    
    down(e) {
        let rect = this.canvas.getBoundingClientRect();
        this.start_x = ((e.clientX-rect.left)/this.scale)>>0;
        this.start_y = ((e.clientY-rect.top)/this.scale)>>0;
        this.start_c = this.pic.get(this.start_x,this.start_y);
    }
    
    move(e) {
        let rect = this.canvas.getBoundingClientRect();
        let x = ((e.clientX-rect.left)/this.scale)>>0;
        let y = ((e.clientY-rect.top)/this.scale)>>0;
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

