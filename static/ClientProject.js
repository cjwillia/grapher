/* A project fron the client's view. This includes basic information, as well
 * as several function to edit the graph: addNode, addConnector, etc.
 */


/***************************************************
 * interface
 ***************************************************/

function ClientProject(obj) {

    assert(typeof(obj) === "object");

    // string id, like "d0Bp9"
    this.id = obj.id;

    // name, like "project foo"
    this.name = obj.name;

    // maps ClientNode ids to ClientNode objects
    this.nodes = obj.nodes;

    // id of the next node to be created
    this.idCount = obj.idCount;
    this.timeScale=obj.timeScale;
    this.startDate=obj.startDate;

}

/* all functions are implemented further below. */

// Add a node to the graph.
ClientProject.prototype.addNode = function(name, x, y) {};

// Connect two existing nodes.
ClientProject.prototype.addConnector = function(startNodeId, endNodeId) {};

// Remove the connection between any two nodes.
ClientProject.prototype.removeConnector = function(startNodeId, endNodeId) {};

// Remove all connections starting on a node
ClientProject.prototype.removeAllConnectors = function(nodeId) {};

// Change that node to have a new description.
ClientProject.prototype.editDescription = function(nodeId, newDesc) {};

// Move a node to a new location.
ClientProject.prototype.moveNode = function(nodeId, newX, newY) {};

//Find a node by its (x, y) position.
ClientProject.prototype.findNodeByPosition = function(x, y) {};

// Delete a node, including any connections to or from it.
ClientProject.prototype.deleteNode = function(x, y) {};


// Make a simple object version of this.
ClientProject.prototype.safeClone = function() {};

/***************************************************
 * implementation
 ***************************************************/


ClientProject.prototype.addNode = function(name, x, y) {

    assert(x >= 0 && y >= 0);

    var isWithinReasonableBounds = function (){
        if(x < NODE_RADIUS || x > canvas.width - NODE_RADIUS ||
           y < NODE_RADIUS || y > canvas.height - NODE_RADIUS){
            return false;
        }
        return true;
    }
    if(isWithinReasonableBounds()){
        var id = this.idCount;
        this.idCount++;
        var node = new ClientNode(id, name, x, y);
        this.nodes[id] = node;
        return node;
    }
};

ClientProject.prototype.addConnector = function(startNodeId, endNodeId) {
    assert(this.nodes[startNodeId] !== undefined);
    assert(this.nodes[endNodeId] !== undefined);

    var connectorList = this.nodes[startNodeId].connectors;

    var isEqualToEndNodeId = function(a){
        if(a.toString() == endNodeId.toString()){
            return true;
        }
        return false;
    }

    if(!connectorList.some(isEqualToEndNodeId)){
        this.nodes[startNodeId].connectors.push(endNodeId);
        return true;
    }
    else if(startNodeId.toString() == endNodeId.toString()){
        return false;
    }
    else{
        return false;
    }

};

ClientProject.prototype.removeConnector = function(startNodeId, endNodeId) {
    assert(this.nodes[startNodeId] !== undefined);
    assert(this.nodes[endNodeId] !== undefined);

    var i = this.nodes[startNodeId].indexOf(endNodeId);
    assert(i != -1);
    this.nodes[startNodeIndex].splice(i, 1);
};

ClientProject.prototype.removeAllConnectors = function(nodeId) {
    this.nodes[nodeId].connectors = [];
}

ClientProject.prototype.editDescription = function(nodeId, newDesc) {
    this.nodes[nodeId].desc = newDesc;
};

ClientProject.prototype.moveNode = function(nodeId, newX, newY) {
    this.nodes[nodeId].x = newX;
    var node=this.nodes[nodeId];
    console.log("move node?");
    this.nodes[nodeId].y = newY;
};


ClientProject.prototype.findNodeByPosition = function(x, y) {
    var nodes = this.nodes;
    var nodeFound = false;
    var nodeId;
    Object.keys(nodes).forEach(function(key){
        var node = nodes[key];
        var minX = node.x - 25;
        var maxX = node.x + 25;
        var minY = node.y - 25;
        var maxY = node.y + 25;

        if(x >= minX && x <= maxX && y >= minY && y <= maxY){
            nodeId = node.id;
            nodeFound = true;
        }
    });
    if(nodeFound){
        return nodeId;
    }
    return false;
};

function deleteAllInList(a, x) {
    1
}


ClientProject.prototype.deleteNode = function(x, y) {
    this.deleting = true;

    var toDelete = this.findNodeByPosition(x, y);
    if(toDelete !== false){
        for (var neighborId in this.nodes) {
            // now remove all instances of toDelete from neighbors
            var i = this.nodes[neighborId].connectors.indexOf(toDelete);
            while (i >= 0) {
                this.nodes[neighborId].connectors.splice(i, 1);
                i = this.nodes[neighborId].connectors.indexOf(toDelete);
            }
        }
        delete(this.nodes[toDelete]);
    }
    this.deleting = false;
};

ClientProject.prototype.safeClone = function() {
    var obj = {};
    obj.id = this.id;
    obj.name = this.name;
    obj.nodes = {};
    for (nodeId in this.nodes) {
        obj.nodes[nodeId] = this.nodes[nodeId].safeClone();
    }
    assert(typeof obj.nodes === "object");
    obj.idCount = this.idCount;
    return obj;
};
