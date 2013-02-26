/*
	TODO: Implement all the canvas code here.
*/

var NODE_STYLE = "blue";
var NEW_NODE_STYLE = "turquoise";
var NODE_RADIUS = 25;
var CONNECTION_STYLE = "green";
var REDRAW_ALL_PERIOD = 30;
var NODE_NAME_STYLE = "white";

var ctx;
var canvas;

var canvasData;
var lastCanvasData;

var overNode;
var hoveredNodeId;

var connectorStartNode;

var currentSelectedNode;

var movingNode;
var lastMouseX;
var lastMouseY;

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
            if(currentSelectedNode){
                if(hoveredNodeId.toString() == currentSelectedNode.id.toString()){
                    movingNode = true;
                    lastMouseX = event.offsetX;
                    lastMouseY = event.offsetY;
                }
            }
        }, false);
    canvas.addEventListener('mouseup', function(event) {
            canvasData.onMouseUp(event);
            if(movingNode){
                movingNode = false;
            }
            if (manager.mode === CREATE_MODE) {
                manager.project.addNode("clicknode",
                                        event.offsetX, event.offsetY);
            }
            else if(manager.mode === DELETE_MODE) {
                manager.project.deleteNode(event.offsetX, event.offsetY);
            }
            else if(manager.mode === CONNECTOR_MODE) {
                if(!connectorStartNode){
                    connectorStartNode = manager.project.findNodeByPosition(event.offsetX, event.offsetY);
                }
                else{
                    var possibleEndNode = manager.project.findNodeByPosition(event.offsetX, event.offsetY);
                    if(possibleEndNode){
                        manager.project.addConnector(connectorStartNode, possibleEndNode);
                    }
                    connectorStartNode = undefined;
                }
            }
            else if(manager.mode === CONNECTOR_CLEAR_MODE) {
                if(hoveredNodeId){
                    manager.project.removeAllConnectors(hoveredNodeId);
                }
            }
            else if(manager.mode === NO_MODE) {
                if(hoveredNodeId){
                    currentSelectedNode = manager.project.nodes[hoveredNodeId];
                    displayNode(currentSelectedNode);
                }
                else{
                    currentSelectedNode = undefined;
                }
            }
        }, false);
    canvas.addEventListener('mousemove', function(event) {
            canvasData.onMouseMove(event);
            hoveredNodeId = manager.project.findNodeByPosition(event.offsetX, event.offsetY)
            if(hoveredNodeId){
                overNode = true;
            }
            else{
                overNode = false;
            }
            if(movingNode){
                var dx = lastMouseX - event.offsetX;
                var dy = lastMouseY - event.offsetY;
                currentSelectedNode.x = currentSelectedNode.x - dx;
                currentSelectedNode.y = currentSelectedNode.y - dy;
                lastMouseX = event.offsetX;
                lastMouseY = event.offsetY;
            }
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

        // draw the node's name
        ctx.fillStyle = NODE_NAME_STYLE;
        ctx.textAlign = "center";
        ctx.textBase = "bottom";
        ctx.fillText(node.name, node.x, node.y - NODE_RADIUS - 5);

        ctx.fillStyle = NODE_STYLE;
        if(overNode){
            if(nodeId.toString() == hoveredNodeId.toString()){
                if(manager.mode == DELETE_MODE){
                    ctx.fillStyle = "red";
                }
                else if(manager.mode == CONNECTOR_MODE){
                    ctx.fillStyle = "yellow";
                }
                else if(manager.mode == CONNECTOR_CLEAR_MODE){
                    ctx.fillStyle = "orange";
                }
                else if(manager.mode == NO_MODE){
                    ctx.fillStyle = "555555"
                }
            }

        }
        if(connectorStartNode){
            if(connectorStartNode.toString() == nodeId.toString()){
                ctx.fillStyle = "green";
            }
        }
        if(currentSelectedNode){
            if(manager.mode == NO_MODE && nodeId.toString() == currentSelectedNode.id.toString()){
                ctx.fillStyle = "white";
            }
        }
        drawCircle(node.x, node.y, NODE_RADIUS);
        ctx.fillStyle = NODE_STYLE;
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
        }
        else{
            manager.mode = NO_MODE;
        }
    }
    else if(canvasData.keyPressed(67) && !lastCanvasData.keyPressed(67)) {
        if(manager.mode !== CONNECTOR_MODE){
            manager.mode = CONNECTOR_MODE;
        }
        else{
            manager.mode = NO_MODE;
        }
    }
    else if(canvasData.keyPressed(70) && !lastCanvasData.keyPressed(70)) {
        if(manager.mode !== CONNECTOR_CLEAR_MODE){
            manager.mode = CONNECTOR_CLEAR_MODE;
        }
        else{
            manager.mode = NO_MODE;
        }
    }
}

function checkSave(){
    if(canvasData.keyPressed(83) && !lastCanvasData.keyPressed(83)){
        manager.updateProject;
        return true;
    }
    return false;
}

/* All drawings on the canvas should come from here. Nowhere else. */
function redrawAll() {

    if (manager.hasProject()) {
        if(!manager.deleting){
            hackyStateChanger();


            ctx.fillStyle = "grey";
            if(checkSave()){
                ctx.fillStyle = "white";
            }
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawNodes();

            if (manager.mode === CREATE_MODE) {
                ctx.fillStyle = NEW_NODE_STYLE;
                if(canvasData.mouseX < NODE_RADIUS || canvasData.mouseX > 600 - NODE_RADIUS ||
                    canvasData.mouseY < NODE_RADIUS || canvasData.mouseY > 400 - NODE_RADIUS){
                    ctx.fillStyle = "pink";
                }
                drawCircle(canvasData.mouseX, canvasData.mouseY, NODE_RADIUS);
            }
            else if (manager.mode === DELETE_MODE) {

            }
        }
    }

    lastCanvasData = canvasData.clone();

}
