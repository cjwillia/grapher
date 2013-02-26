/* A place to hold all the information I need about the canvas. */

function CanvasData() {
    this.mousePressed = false;
    this.mouseX = 0;
    this.mouseY = 0;
    // this.lastMouseX
    this.keys = {};
}

// is the keyCode pressed down right now?
CanvasData.prototype.keyPressed = function(keyCode) {
    return this.keys[keyCode] !== undefined;
};

CanvasData.prototype.clone = function() {
    var clone = new CanvasData();
    clone.mousePressed = this.mousePressed;
    clone.mouseX = this.mouseX;
    clone.mouseY = this.mouseY;
    clone.keys = $.extend({}, this.keys); // shallow copy
    return clone;
}



// random listeners. Set listeners to these.
CanvasData.prototype.onMouseDown = function(event) {
    this.mousePressed = true;
};

CanvasData.prototype.onMouseUp = function(event) {
    this.mousePressed = false;
};

CanvasData.prototype.onMouseMove = function(event) {
        var x = event.offsetX;
        var y = event.offsetY;
        this.mouseX = x;
        this.mouseY = y;
};

CanvasData.prototype.onKeyDown = function(event) {
    if (this.keys[event.keyCode]) {
        delete this.keys[event.keyCode];
    }
};

CanvasData.prototype.onKeyUp = function(event) {
    this.keys[event.keyCode] = true;
};
