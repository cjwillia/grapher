/* A persistant object that keeps track of everything a client will need to
 * know about their current project, as well as some methods to update the
 * project (e.g. download a new one). If you want to edit something about a
 * project, use ProjectManager.project.addNode(), etc.
 */

/***************************************************
 * interface
 ***************************************************/

function ProjectManager() {

    // ClientProject object. null means no project.
    this.project = null;

}

/* all functions are implemented further below. */

// Do we have a project?
ProjectManager.prototype.hasProject = function() {};

// Fetch a project from the server. If you already have a project,
// updates it.
ProjectManager.prototype.getProject = function(projectId) {};

// Make a new project, given a name. Tell the server.
ProjectManager.prototype.newProject = function(projectName) {};

// Update the server with your latest version.
ProjectManager.prototype.updateProject = function() {};

// Delete this project, and tell the server.
ProjectManager.prototype.deleteProject = function() {};

/***************************************************
 * implementation
 ***************************************************/
