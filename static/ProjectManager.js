/* A persistant object that keeps track of everything a client will need to
 * know about their current project, as well as some methods to update the
 * project (e.g. download a new one). If you want to edit something about a
 * project, use ProjectManager.project.addNode(), etc.
 */

var NO_MODE = "no mode";
var CREATE_MODE = "create mode";
var DELETE_MODE = "delete mode";
var CONNECTOR_MODE = "connector mode";
var CONNECTOR_CLEAR_MODE = "connector clear mode";

/***************************************************
 * interface
 ***************************************************/

function ProjectManager() {

    // ClientProject object. null means no project.
    this.project = null;

    // are you creating a mode? creating an edge? doing nothing? ...or maybe deleting something? ....OR LOTS OF OTHER STUFF MAYBE
    this.mode = NO_MODE;
}

/* all functions are implemented further below. */

// Do we have a project?
ProjectManager.prototype.hasProject = function() {};

// Fetch a project from the server. If you already have a project,
// updates it. If callback is given, calls it when the ajax completes.
ProjectManager.prototype.getProject = function(projectId, callback) {};

// Make a new project, given a name. Tell the server.
ProjectManager.prototype.newProject = function(projectName, callback) {};

// Update the server with your latest version.
ProjectManager.prototype.updateProject = function(callback) {};

// Delete this project, and tell the server.
ProjectManager.prototype.deleteProject = function(callback) {};

// Try to find the project in the database by name. If no such project exists,
// make a new one.
ProjectManager.prototype.findProject = function(projectName, callback) {};

/***************************************************
 * implementation
 ***************************************************/


ProjectManager.prototype.hasProject = function() {
    return this.project !== null;
};

ProjectManager.prototype.getProject = function(projectId, callback) {

	$.ajax({
		type : "get",
		url : "/projects",
        data: {
            "id": projectId
        },
		success : function(data) {
            if (data.success) {
                console.log("success! Found a project.");
                this.project = new ClientProject(data.project);
                $("#projectControls").css("display", "block");
                $("#projectSelect").css("display", "none");
            } else {
                console.log("Dang, didn't find a project.");
            }
            if (callback) {
                callback();
            }
        }.bind(this)
    });
};

ProjectManager.prototype.newProject = function(projectName, callback) {

	$.ajax({
		type : "put",
		url : "/projects",
		data : {
            "name" : projectName
        },
		success : function(data) {
            this.project = new ClientProject(data.project);
            console.log("Successfully created project.");
            $("#projectControls").css("display", "block");
            $("#projectSelect").css("display", "none");
            if (callback) {
                callback();
            }
        }.bind(this)
    });

};

ProjectManager.prototype.updateProject = function(callback) {

    assert(this.hasProject());

    $.ajax({
		url : "/projects",
        type: "post",
		data : {
            "project" : JSON.stringify(this.project)
        },
		success : function() {
            if (callback) {
                callback();
            }
        }
    });

};

ProjectManager.prototype.deleteProject = function(callback) {

    assert(this.hasProject());

	$.ajax({
		type : "delete",
		url : "/projects/" + this.project.id,
		success : function(){
            throw "server not implemented";
            this.project = null;
            if (callback) {
                callback();
            }
        }
    });
};


ProjectManager.prototype.findProject = function(projectName, callback) {

	$.ajax({
		type : "get",
		url : "/find",
        data: {
            "name": projectName
        },
		success : function(data) {
            if (data.success) {
                console.log("Found a project by the name of " + projectName);
                this.project = new ClientProject(data.project);
                $("#projectControls").css("display", "block");
                $("#projectSelect").css("display", "none");
                if (callback) {
                    callback();
                }
            } else {
                console.log("Didn't find a project by name of " + projectName);
                console.log("So I'll make a new one.");
                this.newProject(projectName, callback);
            }
        }.bind(this)
    });

};
