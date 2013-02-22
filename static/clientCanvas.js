/*
	TODO: Implement all the canvas code here.
*/

/*
 * 
 *
 *
 *
 *
 * THIS FILE DOESN'T WORK SO DON'T EDIT OR TRY TO USE IT
 *
 *
 *
 *
 *
 *
 *
 *
 */

var NODE_STYLE = "blue";
var NODE_RADIUS = 25;
var CONNECTION_STYLE = "green";

var ctx;
var canvas;

// something I use to auto-generate names
var hackyNamingNumber = 0;


/* "main" function of the whole canvas. Sets everything up. */
function canvasMain() {

    // select the canvas and ctx
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");

    // set key listeners
    canvas.addEventListener('keydown', onKeyDown, false);
    canvas.addEventListener('keyup', onKeyUp, false);
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.setAttribute('tabindex','0');
    canvas.focus();

    // TODO: remove (just testing)
    ctx.fillStyle = "red";
    var off = 0;
    ctx.fillRect(off, off, canvas.width-2*off, canvas.height-2*off);

}


/* Called when they press a key down. */
function onKeyUp(event) {
    console.log(event.keyCode + " up!");
}

/* Called when they lift a key up. */
function onKeyDown(event) {
    console.log(event.keyCode + " down!");
    if (event.keyCode === 65) {
        drawNodes();
    }
}


/* Called when they click mouse down. */
function onMouseDown(event) {
    console.log("down!");
    var x = event.offsetX;
    var y = event.offsetY;
    console.log(x, y);
}


/* Called when they release mouse. */
function onMouseUp(event) {
    console.log("up!");
    var x = event.offsetX;
    var y = event.offsetY;
    console.log(x, y);
    // addNode("node" + hackyNamingNumber++, new Position(x, y));
}


/* shamelessly copied from the course notes */
function drawCircle(cx, cy, radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2*Math.PI, false);
    ctx.fill();
}

/* Draws a line from (x0, y0), (x1, y1). If you need to make line-drawing
 * fancier, this is the place to do it! */
function drawConnection(x0, y0, x1, y1) {
    ctx.strokeStyle = CONNECTION_STYLE;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();
}


/* The function that does it all: draws every node you have */
function drawNodes() {

    // first, draw every connection
    console.log(1);
    currentProject.nodes.forEach(function(node) {
        console.log(2);
        node.connections.forEach(function(neighbor) {
            console.log(3);
            drawConnection(node.position.x, node.position.y,
                           neighbor.position.x, neighbor.position.y);
        });
    });

    // second, draw every node
    ctx.fillStyle = NODE_STYLE;
    currentProject.nodes.forEach(function(node) {
        drawCircle(node.x, node.y, NODE_RADIUS);
    });
}
