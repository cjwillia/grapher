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
        return node.startM + "-" + node.startD + "-" + node.startY + ", " +
            hour;
    } else {
        return "";
    }
}

function getEndDate(node) {
    var time=node.x*convertTime(manager.project.timeScale)/20;
    var date=new Date(time+manager.project.startDate);
    var year=(date.getFullYear());
    var month=(date.getMonth()+1);
    var day=(date.getDate());
    var hour=(date.getHours());
    if (hour<12){hour=hour+" am";}
    else if (hour===12){hour="12 pm";}
    else if (hour*1===24){hour="12 am";}
    else {hour=hour%12+" pm";}
    return month + "-" + day + "-" +year + ", " +
            hour;
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
/* What is the distance between (x1,y1) and (x2, y2) */
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
};
