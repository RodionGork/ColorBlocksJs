function ColorBlocks() {
    this.score = 0;
    this.size = 15;
    this.w = 35;
    this.h = 25;
    this.colors = 4;
    this.shades = ['#ff0000', '#ffff00', '#00dd00', '#4444ff'];
    this.ch = null;
    this.box = [];
    this.init();
}

ColorBlocks.prototype.init = function () {
    var self = this;
    var canvas = this.getCanvas();
    this.setupGeometry(canvas);
    this.ctx = canvas.getContext('2d');
    this.ch = new CanvasHelper(canvas, this.ctx);
    this.initBox();
    this.draw();
    canvas.onmousedown = function(e) {self.onMouseDown(e);};
}

ColorBlocks.prototype.setupGeometry = function(canvas) {
    canvas.width = this.size * this.w - 1;
    canvas.height = this.size * this.h - 1;
}

ColorBlocks.prototype.initBox = function(canvas) {
    var seed = document.getElementById('seed').value / 137;
    this.ch.rand(seed);
    this.box = [];
    for (var x = 0; x < this.w; x++) {
        var col = [];
        for (var y = 0; y < this.h; y++) {
            col[y] = Math.floor(this.ch.rand() * this.colors) + 1;
        }
        this.box[x] = col;
    }
}

ColorBlocks.prototype.getCanvas = function() {
    return document.getElementById('demo');
}


ColorBlocks.prototype.reset = function() {
    this.score = 0;
    this.initBox();
    this.draw();
}

ColorBlocks.prototype.remove = function(x, y) {
    var c = this.box[x][y];
    if (c < 1) {
        return -1;
    }
    var cells = [{x: x, y: y}];
    var count = 0;
    while (cells.length > 0) {
        var cur = cells.pop();
        count++;
        this.box[cur.x][cur.y] = -1;
        if (cur.x > 0 && this.box[cur.x - 1][cur.y] == c) {
            cells.push({x: cur.x - 1, y: cur.y});
        }
        if (cur.y > 0 && this.box[cur.x][cur.y - 1] == c) {
            cells.push({x: cur.x, y: cur.y - 1});
        }
        if (cur.x < this.w - 1 && this.box[cur.x + 1][cur.y] == c) {
            cells.push({x: cur.x + 1, y: cur.y});
        }
        if (cur.y < this.h - 1 && this.box[cur.x][cur.y + 1] == c) {
            cells.push({x: cur.x, y: cur.y + 1});
        }
    }
    this.sweep();
    this.score += count * (count + 1) / 2;
}

ColorBlocks.prototype.sweep = function() {
    for (var x = 0; x < this.w; x++) {
        var col = [];
        for (var y = 0; y < this.h; y++) {
            var c = this.box[x][y];
            if (c > 0) {
                col.push(c);
            }
        }
        while (col.length < this.h) {
            col.push(0);
        }
        this.box[x] = col;
    }
    for (var xx = this.w - 1; xx >= 0; xx--) {
        if (this.box[xx][0] == 0) {
            var col = this.box[xx];
            this.box.splice(xx, 1);
            this.box[this.w - 1] = col;
        }
    }
}

ColorBlocks.prototype.onMouseDown = function(event) {
    var pos = this.ch.posFromEvent(event);
    this.remove(Math.floor(pos.x / this.size), this.h - Math.floor(pos.y / this.size) - 1);
    this.draw();
}

ColorBlocks.prototype.draw = function() {
    var ctx = this.ctx;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.size * this.w, this.size * this.h);
    for (var x = 0; x < this.w; x++) {
        for (var y = 0; y < this.h; y++) {
            var color = this.box[x][y] - 1;
            if (color < 0) {
                continue;
            }
            var sx = this.size * x;
            var sy = this.size * (this.h - y - 1);
            ctx.fillStyle = this.shades[color];
            ctx.fillRect(sx, sy, this.size - 1, this.size - 1);
        }
    }
    document.getElementById('score').value = '' + this.score;
}


