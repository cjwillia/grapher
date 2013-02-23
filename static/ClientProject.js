/* A project fron the client's view. This includes basic information, as well
 * as several function to edit the graph: addNode, addConnector, etc.
 */


/***************************************************
 * interface
 ***************************************************/

function ClientProject(obj) {

    console.log(obj);
    assert(typeof(obj) === "object");

    // string id, like "d0Bp9"
    this.id = obj.id;

    // name, like "project foo"
    this.name = obj.name;

    // maps ClientNode ids to ClientNode objects
    this.nodes = obj.nodes;

    // id of the next node to be created
    this.idCount = obj.idCount;

}

/* all functions are implemented further below. */

// Add a node to the graph.
ClientProject.prototype.addNode = function(name, x, y) {};

// Connect two existing nodes.
ClientProject.prototype.addConnector = function(startNodeId, endNodeId) {};

// Remove the connection between any two nodes.
ClientProject.prototype.removeConnector = function(startNodeId, endNodeId) {};

// Change that node to have a new description.
ClientProject.prototype.editDescription = function(nodeId, newDesc) {};

// Move a node to a new location.
ClientProject.prototype.moveNode = function(nodeId, newX, newY) {};


/***************************************************
 * implementation
 ***************************************************/


ClientProject.prototype.addNode = function(name, x, y) {
    assert(x >= 0 && y >= 0);

    var id = this.idCount;
    this.idCount++;
    var node = new ClientNode(id, name, x, y);
    this.nodes[id] = node;

};

ClientProject.prototype.addConnector = function(startNodeId, endNodeId) {
    assert(this.nodes[startNodeId] !== undefined);
    assert(this.nodes[endNodeId] !== undefined);

    this.nodes[startNodeId].connectors.push(endNodeId);
};

ClientProject.prototype.removeConnector = function(startNodeId, endNodeId) {
    assert(this.nodes[startNodeId] !== undefined);
    assert(this.nodes[endNodeId] !== undefined);

    var i = this.nodes[startNodeId].indexOf(endNodeId);
    assert(i != -1);
    this.nodes[startNodeIndex].splice(i, 1);
};

ClientProject.prototype.editDescription = function(nodeId, newDesc) {
    this.nodes[nodeId].desc = newDesc;
};

ClientProject.prototype.moveNode = function(nodeId, newX, newY) {
    this.nodes[nodeId].x = newX;
    this.nodes[nodeId].y = newY;
};
