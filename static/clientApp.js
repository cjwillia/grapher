<<<<<<< HEAD
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
<<<<<<< HEAD

// Position object. Pretty simple.
function Position(x, y){
    this.x = x;
    this.y = y;
}

=======
>>>>>>> add new project
//The function representing a Node object.
function Node(name, position){
	var index = numNodes;
	this.name = name;
	this.position = position;
	this.desc = "";
	this.connectors = [];
	this.delete = function() {
		currentProject.nodes.splice(index, 1);
	}
}

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
			currentProject = data.project;
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
		success : function(){
			console.log("Successfully created project.");
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
=======
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

// Position object. Pretty simple.
function Position(x, y){
    this.x = x;
    this.y = y;
}

$(document).ready(function(){
	$("#newProject").click(function(){
		newProject($("#textfield").val());
	})
})

//The function representing a Node object.
function Node(name, position){
	var index = numNodes;
	this.name = name;
	this.position = position;
	this.desc = "";
	this.connectors = [];
	this.delete = function() {
		currentProject.nodes.splice(index, 1);
	}
}

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
			currentProject = data.project;
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
		success : function(){
			console.log("Successfully created project.");
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
>>>>>>> master
