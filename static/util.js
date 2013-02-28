/* Just handy, uncategorized functions */
function clone(obj) {
    var newObj = {};
    for (var attribute in obj) {
        newObj[attribute] = obj[attribute];
    }
    return newObj;
}


function getStartDate(node) {
    if (node.startY && node.startM && node.startD && node.startH) {
        return node.startM + "-" + node.startD + "-" + node.startY + " " +
            node.startH;
    } else {
        return "";
    }
}

function getEndDate(node) {
    if (node.endY && node.endM && node.endD && node.endH) {
        return node.endM + "-" + node.endD + "-" + node.endY + " " +
            node.endH;
    } else {
        return "";
    }
}

/* hides the interface that lets you fill in a description of a node away, and
 * saves it (if necessary). It can be called multiple times, even if the
 * interface is already put away. */
function putDescAway() {

    // save it
    if (currentSelectedNode) {
        saveDesc();
    }
    // hide it
	$("#showDesc").css("display","block");
	$("#editDesc").css("display","none");
    currentSelectedNode = undefined;
}

// copied from brian/hw/1/src/util.js
/* draw img at x, y with width, height. Rotated about centerpoint of image by
 * theta radians. */
function drawRotated(img, cx, cy, width, height, theta) {
    ctx.save();
    ctx.translate(Math.floor(cx), Math.floor(cy));
    ctx.rotate(theta);
    // now move image so that center of image is at center of rotation
    ctx.drawImage(img, Math.floor(-width/2), Math.floor(-height/2),
                  Math.floor(width), Math.floor(height));
    ctx.restore();
}

// copied from brian/hw/1/src/util.js
/* What is the distance between (x1,y1) and (x2, y2) */
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
};

// copied from brian/hw/1/src/util.js
/* Given a theta in radians, returns an [x, y] unit vector.
 *
 * unitVector(0.0) === [1.0, 0.0]
 * unitVector(Math.PI/2) === [0.0, 1.0]
 * unitVector(Math.PI/4) === [0.707, 0.707] // 1/sqrt(2)
 *
 */
function unitVector(theta) {
    theta = modulo(theta, Math.PI*2);
    // quadrant 0, 1, 2, or 3, in counter-clockwise order
    var quadrant = Math.floor(theta / (Math.PI/2));
    var x, y;
    //////////////// scary trig section //////////////////
    switch (quadrant) {
    case 0:
        x = Math.cos(theta);
        y = Math.sin(theta);
        break;
    case 1:
        theta = Math.PI - theta;
        x = -Math.cos(theta);
        y = Math.sin(theta);
        break;
    case 2:
        theta = theta - Math.PI;
        x = -Math.cos(theta);
        y = -Math.sin(theta);
        break;
    case 3:
        theta = Math.PI*2 - theta;
        x = Math.cos(theta);
        y = -Math.sin(theta);
        break;
    }
    return [x, y];
};
