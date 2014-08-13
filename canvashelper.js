function CanvasHelper(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.rndval = 0;
}

CanvasHelper.prototype.lineRel = function(x1, y1, dx, dy) {
    this.line(x1, y1, x1 + dx, y1 + dy);
}

CanvasHelper.prototype.line = function(x1, y1, x2, y2) {
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}

CanvasHelper.prototype.circle = function(x, y, r) {
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

CanvasHelper.prototype.posFromEvent = function(e) {
    var e = e || window.event;
    var cnv = this.canvas;
    var offsetX = e.pageX - cnv.clientLeft - cnv.offsetLeft;
    var offsetY = e.pageY - cnv.clientTop - cnv.offsetTop;
    return {x: offsetX, y: offsetY};
}

CanvasHelper.prototype.rand = function(seed) {
    if (typeof(seed) != 'undefined') {
        this.rndval = seed;
    }
    this.rndval = parseFloat('0.' + Math.sin(this.rndval + 0.31415926).toString().substr(6));
    return this.rndval;
}
