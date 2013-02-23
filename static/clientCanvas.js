/*
	TODO: Implement all the canvas code here.
*/

var NODE_STYLE = "blue";
var NEW_NODE_STYLE = "turquoise";
var NODE_RADIUS = 25;
var CONNECTION_STYLE = "green";
var REDRAW_ALL_PERIOD = 30;

var ctx;
var canvas;

var canvasData;
var lastCanvasData;

/* "main" function of the whole canvas. Sets everything up. */
function canvasMain() {


    // canvas = document.getElementById("mainCanvas");
    // because JQUERY
    canvas = $("#mainCanvas")[0];

    // select the canvas and ctx
    ctx = canvas.getContext("2d");

    canvasData = new CanvasData();
    lastCanvasData = canvasData.clone();

    // set key listeners
    canvas.addEventListener('keydown', function(event) {
            canvasData.onKeyDown(event);
        }, false);
    canvas.addEventListener('keyup', function(event) {
            canvasData.onKeyUp(event);
        }, false);
    canvas.addEventListener('mousedown', function(event) {
            canvasData.onMouseDown(event);
        }, false);
    canvas.addEventListener('mouseup', function(event) {
            canvasData.onMouseUp(event);
            if (manager.mode === CREATE_MODE) {
                manager.project.addNode("clicknode",
                                        event.offsetX, event.offsetY);
            }
        }, false);
    canvas.addEventListener('mousemove', function(event) {
            canvasData.onMouseMove(event);
        }, false);
    canvas.setAttribute('tabindex','0');
    canvas.focus();

    setInterval(redrawAll, REDRAW_ALL_PERIOD);
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

    assert(manager.hasProject());

    // first, draw every connection
    var nodeId;
    for (nodeId in manager.project.nodes) {
        var node = manager.project.nodes[nodeId];
        node.connectors.forEach(function(neighborId) {
                var neighbor = manager.project.nodes[neighborId];
                drawConnection(node.x, node.y, neighbor.x, neighbor.y);
            });
    }

    // second, draw every node
    ctx.fillStyle = NODE_STYLE;
    for (nodeId in manager.project.nodes) {
        var node = manager.project.nodes[nodeId];
        drawCircle(node.x, node.y, NODE_RADIUS);
    }
}

/* A temporary function to change the state based on keyboard input. */
function hackyStateChanger() {

    if (canvasData.keyPressed(66) && !lastCanvasData.keyPressed(66)) {
        if (manager.mode === NO_MODE) {
            manager.mode = CREATE_MODE;
        } else {
            manager.mode = NO_MODE;
        }
    }
}

/* All drawings on the canvas should come from here. Nowhere else. */
function redrawAll() {

    if (manager.hasProject()) {
        hackyStateChanger();

        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawNodes();

        console.log(manager);
        if (manager.mode === CREATE_MODE) {
            ctx.fillStyle = NEW_NODE_STYLE;
            drawCircle(canvasData.mouseX, canvasData.mouseY, NODE_RADIUS);
        }
    }

    lastCanvasData = canvasData.clone();

}
