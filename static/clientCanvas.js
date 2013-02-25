/*
	TODO: Implement all the canvas code here.
*/

var NODE_STYLE = "blue";
var NEW_NODE_STYLE = "turquoise";
var NODE_RADIUS = 25;
var CONNECTION_STYLE = "green";
var REDRAW_ALL_PERIOD = 30;
var UPDATE_SERVER_PERIOD = 10*1000;

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
            else if(manager.mode === DELETE_MODE) {
                manager.project.deleteNode(event.offsetX, event.offsetY);
            }
        }, false);
    canvas.addEventListener('mousemove', function(event) {
            canvasData.onMouseMove(event);
        }, false);
    canvas.setAttribute('tabindex','0');
    canvas.focus();

    setInterval(redrawAll, REDRAW_ALL_PERIOD);

    setInterval(function() {
        manager.updateProject();
    }, UPDATE_SERVER_PERIOD);

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
    Object.keys(manager.project.nodes).forEach(function(nodeId) {
        var node = manager.project.nodes[nodeId];
        if(node){
            node.connectors.forEach(function(neighborId) {
                    var neighbor = manager.project.nodes[neighborId];
                    drawConnection(node.x, node.y, neighbor.x, neighbor.y);
                });
        }
    });

    // second, draw every node
    ctx.fillStyle = NODE_STYLE;
    Object.keys(manager.project.nodes).forEach(function(nodeId){
        var node = manager.project.nodes[nodeId];
        drawCircle(node.x, node.y, NODE_RADIUS);
    });
}

/* A temporary function to change the state based on keyboard input. */
function hackyStateChanger() {

    if (canvasData.keyPressed(66) && !lastCanvasData.keyPressed(66)) {
        if (manager.mode !== CREATE_MODE) {
            manager.mode = CREATE_MODE;
        }
        
        else {
            manager.mode = NO_MODE;
        }
    }
    else if(canvasData.keyPressed(68) && !lastCanvasData.keyPressed(68)) {
        if(manager.mode !== DELETE_MODE){
            manager.mode = DELETE_MODE;
            console.log("I'M GONNA WRECK IT.");
        }
        else{
            manager.mode = NO_MODE;
        }
    }
}

/* All drawings on the canvas should come from here. Nowhere else. */
function redrawAll() {

    if (manager.hasProject()) {
        if(!manager.deleting){
            hackyStateChanger();

            ctx.fillStyle = "red";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawNodes();

            if (manager.mode === CREATE_MODE) {
                ctx.fillStyle = NEW_NODE_STYLE;
                drawCircle(canvasData.mouseX, canvasData.mouseY, NODE_RADIUS);
            }
            else if (manager.mode === DELETE_MODE) {

            }
        }
    }

    lastCanvasData = canvasData.clone();

}
