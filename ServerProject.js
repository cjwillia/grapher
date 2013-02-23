/* Stores all the information you need for a project, to be stored on the
 * server. Note that because the server has to be JSON-able, it can't have any
 * methods. */

/***************************************************
 * interface
 ***************************************************/

function ServerProject(id, name) {

    // string id, like "d0Bp9"
    this.id = id;

    // name, like "project foo"
    this.name = name;

    // maps ServerNode ids to ServerNode objects
    this.nodes = {};

    // id of the next node to be created
    this.idCount = 0;

}
