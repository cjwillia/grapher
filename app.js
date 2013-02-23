// Other really important thing
// Really important thing

//Main app.js

var express = require("express"); // imports express
var app = express();        // create a new instance of express

// imports the fs module (reading and writing to a text file)
var fs = require("fs");

//Data storage object for projects
var savedProjects;

var size = 5;

// the bodyParser middleware allows us to parse the
// body of a request
app.use(express.bodyParser());

//randomly generates an ID for a project of size "length"
// e.g. generateID(5) === "xUeA4n"
function generateID(length){
	var res = "";
	var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	for(var i = 0; i < length; i++){
		res += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	if(savedProjects[res]){
		return generateID(length);
	}
	else{
		return res;
	}
}

//The Object that represents a project
function Project(name){
    // "xyz" or some random string
	this.id = generateID(size);
    // title of the project, e.g. "237 Term Project"
	this.name = name;
	this.nodes = [];
    // always add new objects to savedProjects
	savedProjects[this.id] = this;
}

// Asynchronously read file contents, then call callbackFn
// -taken from eebae.js starter file
function readFile(filename, defaultData, callbackFn) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log("Error reading file: ", filename);
      data = defaultData;
    } else {
      console.log("Success reading file: ", filename);
    }
    if (callbackFn) callbackFn(err, data);
  });
}

// Asynchronously write file contents, then call callbackFn
// -taken from eebae.js starter file
function writeFile(filename, data, callbackFn) {
  fs.writeFile(filename, data, function(err) {
    if (err) {
      console.log("Error writing file: ", filename);
    } else {
      console.log("Success writing file: ", filename);
    }
    if (callbackFn) callbackFn(err);
  });
}

//return the project for a given id
app.get("/projects/:id", function(request, response){
	var id = request.params.id;
	if(savedProjects[id]){
		response.send({
			"project" : savedProjects[id],
			"success" : true
		});
	}
	else{
		response.send({
			"success" : false
		});
	}
});
//send the static file
app.get("/static/:file",function(request,response){
	response.sendfile("static/"+request.params.file);
	});

	
//commit a project to the "database"
app.put("/projects", function(request, response){
	var name = request.body.name;
	var newProj = new Project(name);

	writeFile("data.txt", savedProjects, function(){
		response.send({
			id : newProj.id,
			success: true
		});
	});
});

//delete a project from the "database"
app.delete("/projects/:id", function(request, response){
	savedProjects[request.params.id] = undefined;
	writeFile("data.txt", savedProjects, function(){
		response.send({
			success : true
		});
	});
});

//edit a project in the database
app.post("projects/:id", function(request, response){
	var name = request.body.name;
	var nodes = request.body.nodes;
	var toEdit = savedProjects[request.params.id];

	toEdit.name = name;
	toEdit.nodes = nodes;
    // why do we only write the most recent changed project?
    // Why not all projects?
	writeFile("data.txt", savedProjects, function(){
		response.send({
			data : toEdit,
			success : true
		});
	});
});


//initialize the server
function initServer(){
	var empty = "{}";
	readFile("data.txt", empty, function(err, data){
		savedProjects = JSON.parse(data);
	});
}

initServer();

//set app on aribitrary port
app.listen(8789);
