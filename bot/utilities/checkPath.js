'use strict';

// src: http://stackoverflow.com/a/37601059
var checkForPathInObject = function(object,path,value) {
    var pathParts   = path.split('.'),
        result      = false;
    // Check if required parameters are set; if not, return false
    if(!object || typeof object === 'undefined' || !path || typeof path !== 'string') {
      return false;
    }
    /* Loop through object keys to find a way to the path or check for value
     * If the property does not exist, set result to false
     * If the property is an object, update @object
     * Otherwise, update result */
    for(var i=0;i<pathParts.length;i++){
        var currentPathPart = pathParts[i];
        if(!object.hasOwnProperty( currentPathPart )) {
            result = false;
        } else if (object[ currentPathPart ] && path === pathParts[i]) {
            result = pathParts[i];
            break;
        } else if(typeof object[ currentPathPart ] === 'object') {
            object = object[ currentPathPart ];
        } else {
            result = object[ currentPathPart ];
        }
    }
    /* */
    if(typeof value !== 'undefined' && value === result) {
      return true;
    }
    return result;
};

module.exports = checkForPathInObject;