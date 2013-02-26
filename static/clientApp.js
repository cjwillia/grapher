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
	switchPanel($("#projectControls"),$("#projectSelect"));
        $("#canvasPanel").css("display","block");
}
$(document).ready(function(){
	$("#newProject").click(function(){
		console.log("clicked");
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
	});
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

    // and last but not least, run the main function
    initPage();
});

function displayNode(curNode){
	var name=curNode.name;
	var desc=curNode.desc;
	var start=curNode.startPoint;
	var end=curNode.endPoint;
	var holders=curNode.holders;
	$("#curName").html(name);
	if(holders){
	$("#curHolder").html("by "+holders+".");}
	if(start && end){
	$("#curTime").html("From "+start+" to "+end+".");}

	if (desc){
	$("#curDesc").html(desc);}
	else{
	$("#curDesc").html("No description yet");}
}
function switchPanel(A,B){
	A.css("display","block");
	B.css("display","none");
}
