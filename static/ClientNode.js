/* Node object, to be stored by the client. Since the client can edit it, it
 * can have methods.
 */


/***************************************************
 * interface
 ***************************************************/

function ClientNode(id, name, x, y) {

    // number id, like 872
    this.id = id;

    // name, like "write report"
    this.name = name;

    // description, like "Write the report previously emailed. Double-spaced."
    this.desc = "";

    // x, y location location
    this.x = x;
    this.y = y;

    // list of ids of nodes you're connected to
    this.connectors = [];

}

ClientNode.prototype.safeClone = function() {
    var obj = {};
    obj.id = this.id;
    obj.name = this.name;
    obj.desc = this.desc;
    obj.x = this.x;
    obj.y = this.y;
    obj.connectors = [];
    this.connectors.forEach(function(connector) {
        obj.connectors.push(connector);
    });
    return obj;
};
