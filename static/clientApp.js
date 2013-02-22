//contains all server communication functions for committing data to the server from the client as well as providing APIs for
//use in implementation of final model


//TODO LIST:
//Finish node class
//Add nodes to project
//Add connectors to nodes
//remove connectors from nodes
//edit descriptions
//move nodes
//delete nodes

var currentProject;
var numNodes;
function extend(child,parent){
	child.prototype=new parent();
	child.prototype.constructor=child;
}
// Position object. Pretty simple.
function Position(x, y){
    this.x = x;
    this.y = y;

}
function switchPanel(A,B){
	A.css("visibility","visible");
	B.css("visibility","hidden");
	
}
function onCreateNode(){
	console.log("onCreateNode");
}
function onDelNode(){
	console.log("onDelNode");
}
function onEditNode(){
	console.log("onEditNode");
}
function onAddEdge(){
	console.log("onAddEdge");
}
$(document).ready(function(){
	$("#newProject").click(function(){
		console.log("clicked");
		if ($("#textfield").val()!==""){
			newProject($("#textfield").val());
			$("#textfield").val("");
			switchPanel($("#projectControls"),$("#projectSelect"));
		}
		else{
			console.log("please type a name");
		}
	});
	$("#selectProject").click(function(){
		getProject($("#idSelect").val());
		$("#idSelect").val("");
	});
	$("#addNode").click(function(){
		onCreateNode();
	});
	$("#delNode").click(function(){
		onDelNode();
	});
	$("#editNode").click(function(){
		onEditNode();
		$("#editDesc").css("visibility","visible");
	});
	$("#addEdge").click(function(){
		onAddEdge();
	});
});

//The function representing a Node object.
function Node(name, position){
	var index = numNodes;
	this.name = name;
	this.position = position;
	this.desc = "";
	this.connectors = [];
	this.setTime=function(start,end){
		this.start=start;
		this.end=end;
	}
	this.delete = function() {
		currentProject.nodes.splice(index, 1);
	}
}
function schedule(){};
extend(schedule,Node);
schedule.prototype.location="";
function task(){};
extend(task,Node);


//Adds and returns a node
function addNode(name, position){
	var node = new Node(name, position);
	currentProject.push(node);
	numNodes++;
	return node;
}

//Adds a connector between two nodes
function addConnector(startNode, endNode){
	startNode.connectors.push(endNode);
}

//removes a connector between two nodes
function removeConnector(startNode, endNode){
	var allConnected = startNode.connectors;
	allConnected.forEach(function(element, index){
		if(JSON.stringify(endNode) === JSON.stringify(element)){
			startNode.connectors.splice(index, 1);
		}
	});
};

//edits a description, this shit is just obvious
function editDescription(node, newDesc){
	node.desc = newDesc;
}

//Moves a node to a new position
function moveNode(node, newPos){
	node.position = newPos;
}


function getProject(id){
	$.ajax({
		type : "get",
		url : "/projects/" + id,
		success : function(data){
			if (data.project===undefined){
				console.log("no such project");
			}
			else{
				currentProject=data.project;
				switchPanel($("#projectControls"),$("#projectSelect"));
			}
			console.log(currentProject);
		}

	});
}

function newProject(name){
	$.ajax({
		type : "put",
		url : "/projects",
		data : {
			"name" : name
		},
		success : function(data){
			currentProject=data.project;
			console.log(data.project,data.id);
		}
	});
}

function updateProject(id, name, nodes){
	$.ajax({
		type : "post",
		url : "/projects/" + id,
		data : {
			"name" : name,
			"nodes" : nodes
		},
		success : function(){
			console.log("Successfully updated project.");
		}
	});
}

function deleteProject(id){
	$.ajax({
		type : "delete",
		url : "/projects/" + id,
		success : function(){
			console.log("Successfully deleted project.");
		}
	});
}

function initPage(){

}

$(document).ready(initPage);
