/**
 * meteoric specific polyfill (not from ionic).
 */

let jqLite = $;
var NODE_TYPE_ELEMENT = 1;
var NODE_TYPE_ATTRIBUTE = 2;
var NODE_TYPE_TEXT = 3;
var NODE_TYPE_COMMENT = 8;
var NODE_TYPE_DOCUMENT = 9;
var NODE_TYPE_DOCUMENT_FRAGMENT = 11;
function jqLiteController(element, name) {
    return jqLiteInheritedData(element, '$' + (name || 'ngController') + 'Controller');
}

function jqLiteInheritedData(element, name, value) {
    // if element is the document object work with the html element instead
    // this makes $(document).scope() possible
    if (element.nodeType == NODE_TYPE_DOCUMENT) {
        element = element.documentElement;
    }
    var names = _.isArray(name) ? name : [name];

    while (element) {
        for (var i = 0, ii = names.length; i < ii; i++) {
            if (isDefined(value = jqLite.data(element, names[i]))) return value;
        }

        // If dealing with a document fragment node with a host element, and no parent, use the host
        // element as the parent. This enables directives within a Shadow DOM or polyfilled Shadow DOM
        // to lookup parent controllers.
        element = element.parentNode || (element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host);
    }
}

$.controller = jqLiteController;
$.inheritedData = jqLiteInheritedData;