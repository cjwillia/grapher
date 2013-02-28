var NODE_STYLE = "#235D79";
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

// whether or not you're moving the currently selected node ir not
var movingNode;
var lastMouseX;
var lastMouseY;

var arrow = new Image();
arrow.src = "arrow.png";


function resizeCanvas() {
    if (canvas) {
        var canvasPanel = $("#canvasPanel");
        canvas.width = canvasPanel.width();
        var marginAtBottomOfCanvas = 30;
        var newHeight = $(window).height() - $(canvas).offset().top -
            marginAtBottomOfCanvas
        if (newHeight >= 0) {
        canvas.height = newHeight;
        }
    }
}

$(window).resize(resizeCanvas);


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
	if((0<=event.offsetX && event.offsetX<=70)&&
	   (event.offsetY>=canvas.height-40)){
	  display($("#chooseScale"));
	  return;
	}

        canvasData.onMouseDown(event);
        if(currentSelectedNode){
            if(hoveredNodeId.toString() == currentSelectedNode.id.toString()){
                movingNode = true;
                lastMouseX = event.offsetX;
                lastMouseY = event.offsetY;
            }
            else if(hoveredNodeId && manager.mode == NO_MODE){
                currentSelectedNode = manager.project.nodes[hoveredNodeId];
                onEditNode();
                movingNode = true;
                lastMouseX = event.offsetX;
                lastMouseY = event.offsetY;
            }
        }
        else if(manager.mode === NO_MODE && hoveredNodeId){
            currentSelectedNode = manager.project.nodes[hoveredNodeId];
            onEditNode();
            movingNode = true;
            lastMouseX = event.offsetX;
            lastMouseY = event.offsetY;
        }
    }, false);
    canvas.addEventListener('mouseup', function(event) {
        canvasData.onMouseUp(event);

        // save the description, just in case it actually matters.
        // you can never save too much!
        saveDesc();

        if(movingNode){
            movingNode = false;
        }
        if (manager.mode === CREATE_MODE) {
            var addedNode = manager.project.addNode("", event.offsetX, event.offsetY)
            if(addedNode){
                manager.mode = NO_MODE;
                currentSelectedNode = addedNode;
                onEditNode();
                $(".selected").removeClass("selected");
                $("#selectNode").addClass("selected");

            }

        }
        else if(manager.mode === DELETE_MODE) {
            manager.project.deleteNode(event.offsetX, event.offsetY);
        }
        else if(manager.mode === CONNECTOR_MODE) {
            if(!connectorStartNode){
                connectorStartNode = manager.project.findNodeByPosition(
                    event.offsetX, event.offsetY);
            }
            else{
                var possibleEndNode = manager.project.findNodeByPosition(
                    event.offsetX, event.offsetY);
                if(possibleEndNode){
                    manager.project.addConnector(
                        connectorStartNode, possibleEndNode);
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
            }
            else{
                putDescAway();
            }
        }
    }, false);
    canvas.addEventListener('mousemove', function(event) {

        hoveredNodeId = manager.project.findNodeByPosition(
            event.offsetX, event.offsetY);

        if(hoveredNodeId){
            overNode = true;
        }
        else{
            overNode = false;
        }

        // canvasData.mouseX and Y will be 0 if never used
        if (canvasData.mouseX && canvasData.mouseY) {

            if(movingNode){

                // if you're dragging around a particular node, move it
		//change the deadline desc instantly
		fillDeadLine();
                var dx = canvasData.mouseX - event.offsetX;
                var dy = canvasData.mouseY - event.offsetY;
                currentSelectedNode.x -= dx;
                currentSelectedNode.y -= dy;

            } else if (canvasData.mousePressed && manager.mode === NO_MODE) {

                // if no mode and dragging, move all nodes

                var dx = canvasData.mouseX - event.offsetX;
                var dy = canvasData.mouseY - event.offsetY;
                for (var nodeId in manager.project.nodes) {
                    manager.project.nodes[nodeId].x -= dx;
                    manager.project.nodes[nodeId].y -= dy;
                }

            }
            else if (overNode && manager.mode === NO_MODE && !currentSelectedNode){
                displayNode(manager.project.nodes[hoveredNodeId]);
            }
        }

        // regardless, log the current location of the mouse
        canvasData.onMouseMove(event);

    }, false);

    canvas.setAttribute('tabindex','0');
    canvas.focus();

    $(window).resize(resizeCanvas);

    setInterval(redrawAll, REDRAW_ALL_PERIOD);

}


/* shamelessly copied from the course notes */
function drawCircle(cx, cy, radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2*Math.PI, false);
    ctx.fill();
}


function canvas_arrow(context, fromx, fromy, tox, toy){
    ctx.fillStyle = "green";
    ctx.beginPath();
    var headlen = 20;   // length of head in pixels
    var angle = Math.atan2(toy-fromy,tox-fromx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),
                   toy-headlen*Math.sin(angle-Math.PI/6));
    context.moveTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),
                   toy-headlen*Math.sin(angle+Math.PI/6));
    ctx.lineTo(tox, toy);
    ctx.fill();
}


function drawArrowhead(locx, locy, angle, sizex, sizey) {
    var hx = sizex / 2;
    var hy = sizey / 2;

    ctx.save();
    ctx.translate((locx ), (locy));
    ctx.rotate(angle);
    ctx.translate(-hx,-hy);

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,1*sizey);
    ctx.lineTo(1*sizex,1*hy);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}


function drawArrow(x0, y0, x1, y1) {

    var theta = Math.atan2(y1 - y0, x1 - x0);
    var girth = 20;
    var headLength = 30;
    var headWidth = 20;
    var dist = distance(x0, y0, x1, y1);

    ctx.save();
    ctx.translate(x0, y0);
    ctx.rotate(theta);

    ctx.moveTo(0,0);
    ctx.lineTo(dist-headLength, girth/2);
    ctx.lineTo(dist-headLength, girth/2 + headWidth);
    ctx.lineTo(dist, 0);
    ctx.lineTo(dist-headLength, -girth/2 - headWidth);
    ctx.lineTo(dist-headLength, -girth/2);
    ctx.lineTo(0, -girth);
    ctx.fill();

    ctx.restore();

}

/* Draws a line from (x0, y0), (x1, y1). If you need to make line-drawing
 * fancier, this is the place to do it! */
function drawConnection(x0, y0, x1, y1) {

    ctx.fillStyle = "green";

    var theta = Math.atan2(y1 - y0, x1 - x0);
    var dist = distance(x0, y0, x1, y1);
    var offX = ((x1 - x0) / dist) * NODE_RADIUS;
    var offY = ((y1 - y0) / dist) * NODE_RADIUS;

    drawArrow(x0 + offX, y0 + offY, x1 - offX, y1 - offY);
    drawArrow(50, 50, 200, 200);

    // canvas_arrow(ctx, x0+offX, y0+offY, 20, 20);
    // drawArrowhead(50, 50, Math.PI/4, 20, 200);

    var theta = Math.atan2(y1 - y0, x1 - x0);
    var cx = (x0 + x1) / 2;
    var cy = (y0 + y1) / 2;
    var arrowWidth = 20;
    var arrowLength = distance(x0, y0, x1, y1) - NODE_RADIUS*2;

    // drawRotated(arrow, cx, cy, arrowLength, arrowWidth, theta);

    // ctx.strokeStyle = CONNECTION_STYLE;
    // ctx.beginPath();
    // ctx.moveTo(x0, y0);
    // ctx.lineTo(x1, y1);
    // ctx.closePath();
    // ctx.stroke();

}


/* The function that does it all: draws every node you have */
function drawNodes() {
    drawTimeScale();
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
	ctx.font="15px Arial"
        ctx.textAlign = "center";
        ctx.textBase = "bottom";
        ctx.fillText(node.name, node.x, node.y - NODE_RADIUS - 5);

        ctx.fillStyle = NODE_STYLE;
	if(passDeadline(node)){
		ctx.fillStyle="#ddd";
	}
        else if (overNode){
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
                    ctx.fillStyle = "555555";
                }
            }

        }
        if(connectorStartNode){
            if(connectorStartNode.toString() == nodeId.toString()){
                ctx.fillStyle = "green";
            }
        }
        if(currentSelectedNode){
            if(manager.mode == NO_MODE &&
               nodeId.toString() == currentSelectedNode.id.toString()){
                ctx.fillStyle = "white";
            }
        }
        drawCircle(node.x, node.y, NODE_RADIUS);
        ctx.fillStyle = NODE_STYLE;
    });

    drawCurrentTime();
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
    // save if they hit S
    if(canvasData.keyPressed(83) && !lastCanvasData.keyPressed(83)){
        manager.updateProject();
        return true;
    }
    return false;
}

/* All drawings on the canvas should come from here. Nowhere else*/
function redrawAll() {

    resizeCanvas();

    if (manager.hasProject()) {
        if(!manager.deleting){
            hackyStateChanger();


            ctx.fillStyle = "grey";
            if(checkSave() || buttonSave){
                ctx.fillStyle = "white";
                buttonSave = false;
            }
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawNodes();

            if (manager.mode === CREATE_MODE) {
                ctx.fillStyle = NEW_NODE_STYLE;
                if(canvasData.mouseX < NODE_RADIUS ||
                   canvasData.mouseX > canvas.width - NODE_RADIUS ||
                   canvasData.mouseY < NODE_RADIUS ||
                   canvasData.mouseY > canvas.height - NODE_RADIUS){
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
