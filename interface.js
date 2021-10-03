

function sp_get_int(sp, field, default_value) {
    let result = parseInt(sp.get(field));
    if (!Number.isInteger(result))
        result = default_value;
    return result;
}


class Click_map {
    constructor(id, pic, choices, palette) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
        this.scale = 20;
        this.pic = pic;
        this.choices = choices;
        this.palette = palette;

        this.canvas.onclick = this.click.bind(this);
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
        this.pic.set(x,y,c);
        this.redraw();
    }

    //todo: preview color on hover
    //todo: paint by dragging
}

