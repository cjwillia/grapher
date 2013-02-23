//Main app.js

var express = require("express"); // imports express
var app = express();        // create a new instance of express
// imports the fs module (reading and writing to a text file)
var fs = require("fs");
// the bodyParser middleware allows us to parse the
// body of a request
app.use(express.bodyParser());

//Data storage object for projects.
var savedProjects;

/***************************************************
 * main/initialization
 ***************************************************/


//initialize the server
function initServer() {
    // While I wait for server response, there are no projects.
    savedProjects = {};
	readFile("data.txt", JSON.stringify({}), function(err, data) {
            savedProjects = JSON.parse(data);
        });
}



/***************************************************
 * get
 ***************************************************/

//send the static file
app.get("/static/:file", function(request, response) {
        response.sendfile("static/" + request.params.file);
});

//return the project for a given id
app.get("/projects/:id", function(request, response){
	var id = request.params.id;
	if(savedProjects[id]) {
		console.log("Project " + JSON.stringify(id) + " found. Sending back");
		response.send({
			"project" : savedProjects[id],
			"success" : true
		});
	}
	else {
		console.log("Project " + JSON.stringify(id) + " not found.");
		response.send({
			"success" : false
		});
	}
});


/***************************************************
 * put
 ***************************************************/


//commit a project to the database
app.put("/projects", function(request, response){
	var name = request.body.name;
	var newProj = new ServerProject(generateID(), name);

	writeFile("data.txt", JSON.stringify(savedProjects));

    response.send({
        project : newProj,
        success: true
    });
});


/***************************************************
 * post
 ***************************************************/


//edit a project in the database
app.post("projects/:id", function(request, response){

    savedProjects[request.params.id] = request.body.project;

	writeFile("data.txt", JSON.stringify(savedProjects));

    response.send({
        data : toEdit,
        success : true
    });


});


/***************************************************
 * delete
 ***************************************************/


//delete a project from the "database"
app.delete("/projects/:id", function(request, response){
        delete savedProjects[request.params.id];
        writeFile("data.txt", JSON.stringify(savedProjects));
        response.send({
            success : true
        });
    });


/***************************************************
 * ...and call main
 ***************************************************/

initServer();


//set app on aribitrary port
app.listen(8789);






/***************************************************
 * utility functions
 ***************************************************/


// size of a project id.
var ID_LENGTH = 5;

//randomly generates an ID for a project of length ID_LENGTH
// e.g. generateID() === "xUeA4n"
function generateID(){
	var res = "";
	var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	for(var i = 0; i < ID_LENGTH; i++){
		res += characters.charAt(Math.floor(Math.random() * characters.length));
	}
    // recurse until you find an unused id. Unless there are close to
    // 62^ID_LENGTH used ids, this will terminate pretty quickly.
	if(savedProjects[res]){
		return generateID(length);
	}
	else{
		return res;
	}
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
