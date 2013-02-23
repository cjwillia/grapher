/* Node object, to be stored on the server. Since the client makes nodes, it
 * gets passed in a client node, rather than its fields. */

/***************************************************
 * interface
 ***************************************************/

function ServerNode(obj) {

    // number id, like 872
    this.id = obj.id;

    // name, like "write report"
    this.name = obj.name;

    // description, like "Write the report previously emailed. Double-spaced."
    this.desc = obj.desc;

    // x, y locaion location
    this.x = obj.x;
    this.y = obj.y;

    // list of ids of nodes you're connected to
    this.connectors = obj.connectors;

}
