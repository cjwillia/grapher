//contains all server communication functions for committing data to the server from the client as well as providing APIs for
//use in implementation of final model

var manager;

/***************************************************
 * main
 ***************************************************/

/* Main function called when the page loads. */
function initPage(){
    manager = new ProjectManager();

}


/***************************************************
 * node update
 ***************************************************/
// these functions are called by the user clicking on the thing at the top.

// In the future, they'll actually do something.

function onCreateNode(){
    manager.mode = CREATE_MODE;
}


function onDelNode(){
    manager.mode = DELETE_MODE;
}


function onEditNode(){
	console.log("onEditNode");
}


function onAddEdge(){
    manager.mode = CONNECTOR_MODE;
}

function onSelectNode(){
	manager.mode = NO_MODE;
}
/***************************************************
 * jquery and button stuff
 ***************************************************/
function enterEditMode(){
    $("ProjectControls").css("display", "none");
    $("#canvasPanel").css("display","block");
}
$(document).ready(function(){
    // submits a search like "project foo" and loads the result
    var submitFindProject = function() {
		console.log("clicked")
		if ($("#textfield").val()!==""){
			manager.findProject($("#textfield").val(), function() {
                if (manager.hasProject()) {
                    canvasMain();
                }
            });
			$("#textfield").val("");
			enterEditMode();
		}
		else{
			console.log("please type a name");
		}
	};
	$("#findProject").click(submitFindProject);

    // if they hit enter on findProject, continue
    // copied from http://stackoverflow.com/questions/4418819
    $("#textfield").keydown(function(event) {
        if (event.keyCode == 13) {
            submitFindProject();
            // why return false? no idea, but removing it breaks things
            return false;
         }
    }).focus(); // also, focus on textarea to begin with (a la google)

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
		$("#editDesc").css("display","block");
    $("#showDesc").css("display","none");};
	});
	$("#addEdge").click(function(){
		onAddEdge();
	});

	$("#selectNode").click(onSelectNode);

    // when they click on the save button, save your changes!
    // Then, the description-editting thing disappear.
    $("#saveDesc").click(function(){
	    var name=$("#nodeTitle").val();
	    var desc=$("#descText").val();
	    var startY=$("#startYear").val();
        var startM=$("#startMonth").val();
	    var startD=$("#startdate").val();
	    var startH=$("#startHour").val();
	    var endY=$("#endYear").val();
	    var endM=$("#endMonth").val();
	    var endD=$("#endDate").val();
	    var endH=$("#endHour").val();
	    var holder=$("#ownership").val();
	    console.log("holder = " + holder);

	    if (name){
            currentSelectedNode.name=name;
        }
	    if(desc){
            currentSelectedNode.desc=desc;
        }
	    if (holder){
            currentSelectedNode.holders=holder;
        }
	    if(startY!=="" && startM!=="" && startH!=="" && startD!=""){
		    currentSelectedNode.startPoint=
		        startY+"\\"+startM+'\\'+startD+", "+startH;
	    }
	    if(endY && endM && endH && endD){
		    currentSelectedNode.endPoint=
		        endY+"\\"+endM+'\\'+endD+", "+endH;
	    }
        $(".clear").val("");

    });

    $("#canvasPanel").css("display", "none");
    // and last but not least, run the main function
    initPage();
});

function displayNode(curNode){
	$("#showDesc").css("display","block");
	$("#editDesc").css("display","none");
	$(".clear2").html("");
	var name=curNode.name;
	var desc=curNode.desc;
	var start=curNode.startPoint;
	var end=curNode.endPoint;
	var holders=curNode.holders;
	$("#curName").html(name);
	if(holders){
	    $("#curHolder").html("by "+holders+".");
    }
	if(start && end){
	    $("#curTime").html("From "+start+" to "+end+".");
    }
	if (desc){
	    $("#curDesc").html(desc);
    }
	else{
	    $("#curDesc").html("No description yet");
    }
}
