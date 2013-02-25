/* Just handy, uncategorized functions */
function clone(obj) {
    var newObj = {};
    for (var attribute in obj) {
        newObj[attribute] = obj[attribute];
    }
    return newObj;
}
