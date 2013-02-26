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
