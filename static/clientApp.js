//contains all server communication functions for committing data to the server from the client as well as providing APIs for
//use in implementation of final model
var buttonSave;
var manager;

var buttonSave;

/***************************************************
 * main
 ***************************************************/
//css configuration
function verticalCenter(parent, child){
	var height1=$(parent).height();
	var height2=$(child).height();
	var height=(height1-height2)/2;
	$(child).css("margin-top",height);
}

function centerEverything() {
    // make the whole search thing centered.

    $("#projectSelect").css("margin-top", $(window).height() * 0.3);

    verticalCenter("#findForm", "#findProject");
}
/* Main function called when the page loads. */
function initPage(){
    manager = new ProjectManager();
}

/***************************************************
 * node update
 ***************************************************/
// these functions are called by the user clicking on the thing at the top.

function onCreateNode(){
    manager.mode = CREATE_MODE;
    // and now make sure that the createNode button is selected
    $(".selected").removeClass("selected");
    $("#addNode").addClass("selected");
    putDescAway();
}


function onDelNode(){
    manager.mode = DELETE_MODE;
    $(".selected").removeClass("selected");
    $("#delNode").addClass("selected");
    putDescAway();
}


/* so we no longer have an edit button, but this is still a useful function for
 * when you select a node */
function onEditNode(){
	$("#editDesc").css("display","inline-block");
	$("#helpText").css("display", "none");
    $("#showDesc").css("display","none");

    // fill the form with the currentSelectedNode's data
    // closures!
    function fillIfTrue(jQueryObj, value) {
        if (value) {
            jQueryObj.val(value);
        } else {
            jQueryObj.val("");
        }
    }

	fillIfTrue($("#nodeTitle"), currentSelectedNode.name);
	fillIfTrue($("#descText"), currentSelectedNode.desc);
	fillIfTrue($("#startYear"), currentSelectedNode.startY);
    fillIfTrue($("#startMonth"), currentSelectedNode.startM);
	fillIfTrue($("#startdate"), currentSelectedNode.startD);
	fillIfTrue($("#startHour"), currentSelectedNode.startH);
	fillDeadLine()
	fillIfTrue($("#ownership"), currentSelectedNode.holder);
}


function onAddEdge(){
    manager.mode = CONNECTOR_MODE;
    $(".selected").removeClass("selected");
    $("#addEdge").addClass("selected");
    putDescAway();
}

function onSelectNode(){
	manager.mode = NO_MODE;
    $(".selected").removeClass("selected");
    $("#selectNode").addClass("selected");
    putDescAway();
}

/***************************************************
 * jquery and button stuff
 ***************************************************/
function enterEditMode(){
    $("ProjectControls").css("display", "none");
    $("#bottomLine").css("display","none");
    $("#canvasPanel").css("display","block");
    $("#nodeDesc").css("display", "inline-block");
}

// save the description of the current node, assuming it's
// stored in the form thingie on the right.
function saveDesc() {
    if (!currentSelectedNode || $("#editDesc").css("display") === "none") {
        return;
    }

	var name=$("#nodeTitle").val();
	var desc=$("#descText").val();
	var startY=$("#startYear").val();
    var startM=$("#startMonth").val();
	var startD=$("#startDate").val();
	var startH=$("#startHour").val();
	var endY=$("#endYear").val();
	var endM=$("#endMonth").val();
	var endD=$("#endDate").val();
	var endH=$("#endHour").val();
	var holder=$("#ownership").val();
	saveDeadLineFromDesc(endY,endM,endD,endH);

	if (name !== undefined) {
        currentSelectedNode.name=name;
    } if(desc !== undefined) {
        currentSelectedNode.desc=desc;
    } if (holder !== undefined) {
        currentSelectedNode.holder=holder;
    } if (startY !== undefined) {
        currentSelectedNode.startY = startY;
    } if (startM !== undefined) {
        currentSelectedNode.startM = startM;
    } if (startD !== undefined) {
        currentSelectedNode.startD = startD;
    } if (startH !== undefined) {
        currentSelectedNode.startH = startH;
    } if (endY !== undefined) {
        currentSelectedNode.endY = endY;
    } if (endM !== undefined) {
        currentSelectedNode.endM = endM;
    } if (endD !== undefined) {
        currentSelectedNode.endD = endD;
    } if (endH !== undefined) {
        currentSelectedNode.endH = endH;
    }
}

$(document).ready(function(){

    centerEverything();

    // submits a search like "project foo" and loads the result
    saveScaleData();
    var submitFindProject = function() {
		if ($("#textfield").val()!==""){
			manager.findProject($("#textfield").val(), function() {
                if (manager.hasProject()) {
                    $(".selected").removeClass("selected");
                    $("#selectNode").addClass("selected");
		    $("#projectTitle").html($("#textfield").val());
                    canvasMain();
                }
			    enterEditMode();
            });
		}
	return false;
	};
	$("#findProject").click(submitFindProject);

    // if they hit enter on findProject, continue
    // copied from http://stackoverflow.com/questions/4418819
    $("#textfield").keydown(function(event) {
        if (event.keyCode === 13) {
            submitFindProject();
            // return false means don't register the key as being pressed
            return false;
        }
    }).focus(); // also, focus on textarea to begin with (a la google)

    $("#editDesc").keyup(saveDesc);
    $("#nodeTitle").keydown(function(event) {
        // they can't press enter to submit this
        if (event.keyCode === 13) {
            return false;
        }
    });
    $("#editDesc").keydown(saveDesc);

	$("#selectProject").click(function(){
		manager.getProject($("#idSelect").val(), function() {
            if (manager.hasProject()) {
                canvasMain();
		        enterEditMode();
            }
        });
		$("#idSelect").val("");
	});
	$("#addNode").click(function(){
		onCreateNode();
	});
	$("#delNode").click(function(){
		onDelNode();
	});
	$("#editNode").click(function(){
		if (currentSelectedNode!==undefined){
		    onEditNode();
        };
	});
	$("#addEdge").click(function(){
		onAddEdge();
	});

	$("#selectNode").click(onSelectNode);

	$("#saveProj").click(function(){
		manager.updateProject();
		buttonSave = true;
	});

	$("#showHelp").click(function(){
		$("#helpText").css("display", "inline-block");
		$("#editDesc").css("display", "none");
		$("#showDesc").css("display", "none");
	});

    $("#canvasPanel").css("display", "none");
    // and last but not least, run the main function
    initPage();
});

$(window).resize(centerEverything);

function displayNode(curNode){
	$("#showDesc").css("display","inline-block");
	$("#editDesc").css("display","none");
	$("#helpText").css("display", "none");
	$(".clear2").html("");
	var name=curNode.name;
	var desc=curNode.desc;
	var start=getStartDate(curNode);
	var end=getEndDate(curNode);
	var holder=curNode.holder;
	$("#curName").html(name);
	if(holder){
	    $("#curHolder").html(holder+" ");
    }
	else{
	   $("#curHolder").html("public ");
    }
	if(end){
	    $("#curTime").html(end);
    }
	else{
		$("#curTime").html("No deadline");
	}
	if (desc){
	    $("#curDesc").html(desc);
    }
	else{
	    $("#curDesc").html("No description yet");
	    $("#curDesc").html("");
    }
}
