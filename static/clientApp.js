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


//The Object that represents a project
function Project(name, id){
    // "xyz" or some random string
	this.id = id;
    // title of the project, e.g. "237 Term Project"
	this.name = name;
	this.nodes = [];
    // always add new objects to savedProjects
}


function extend(child,parent){
	child.prototype=new parent();
	child.prototype.constructor=child;
}


// Position object. Pretty simple.
function Position(x, y){
    this.x = x;
    this.y = y;
}


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


function switchPanel(A,B){
	A.css("visibility","visible");
	B.css("visibility","hidden");
}

/*******************************************************
 * node update
 *******************************************************/
// these functions are called by the user clicking on the thing at the top


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

function schedule(){};
extend(schedule,Node);
schedule.prototype.location="";
function task(){};
extend(task,Node);


//Adds and returns a node
function addNode(name, position){
    var node = new Node(name, position);
	currentProject.nodes.push(node);
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


/* Fetch a project from the server. If callback is given, call it once you get
 * the project. */
function getProject(id, callback){
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

            // console.log(currentProject);

            if (callback !== undefined) {
                callback();
            }
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
            currentProject = new Project(name, data.id);
			console.log("Successfully created project.");
		}
	});
}

function updateProject(id, name, nodes){
    console.log(id);
    console.log(name);
    console.log(nodes);

	$.post({
		url : "/projects/" + id,
		data : {
			"name" : name,
			"nodes" : nodes
		},
		success : function(){
			console.log("TODO: implement");
            },
        failure: function() {
                console.log("fuck");
            }
        });

}

function deleteProject(id){
	$.ajax({
		type : "delete",
		url : "/projects/" + id,
		success : function(){
			console.log("TODO: implement");
		}
	});
}


/* Main function called when the page loads. */
function initPage(){
    canvasMain();
}

$(document).ready(initPage);
