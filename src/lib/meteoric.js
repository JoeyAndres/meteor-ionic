// Create global ionic obj and its namespaces
// build processes may have already created an ionic obj
window.ionic = window.ionic || {};
window.ionic.views = {};
//window.ionic.version = '<%= pkg.version %>';  // todo: implement a templating here.
window.ionic.version = '1.2.4';

window.meteoric = window.ionic;

/**
 * A place to put non-element ionic directives that can't really be represent
 * by a blaze template.
 */
window.meteoric._directives = {};

window.meteoric.lib = {};
window.meteoric.controller = {};
window.meteoric.service = {};
window.meteoric.config = {};

// Globals for this package only.
// Globals exposed in original ionic.
isDefined = x => !_.isUndefined(x);
noop = () => undefined;
extend = _.extend;
forEach = _.each;
isNumber = _.isNumber;
isString = _.isString;

$timeout = function(fn, delay) {
    let id;
    let p = new Promise(function(resolve, reject) {
        id = Meteor.setTimeout(() => {
            fn();
            resolve();
        }, delay);
    });
    p.id = id;
    return p;
};
$timeout.cancel = function(p) {
    Meteor.clearTimeout(p ? p.id : undefined);
};
$.fn.extend({
    inheritedData(name, value) {
        // Meteor create a new instance of these DOM elements. Thus always
        // find a new living instance.
        let element = jqLite(this)[0];

        return jqLiteInheritedData(element, name, value);
    }
});
function _jqLite(elem) {
    let uid = $(elem).attr('uid');
    if (uid) {
        // Due to Blaze not able to keep same instance of DOM,
        // we jandres:template-scope package attaches a uid on
        // root DOM elements (if there is only one), so we
        // can find the instance in case Blaze did something
        // stupid.
        elem = $(`[uid=${uid}]`)[0];
    } else {
        // There are cases in which we want to render the
        // UI.contentBlock of a template in a different
        // template.
        //
        // uid is attached by jandres:template-scope if root
        // DOM of a template. But what if "elem" is not
        // the root DOM?
        //
        // In such cases, we want to be able
        // to manipulate that element still. The solution
        // is to attach a "random id" or rid attribute.
        //
        // This will only attach it once.
        let rid = $(elem).attr('rid');
        if (rid && $.contains(document.body, elem)) {
            elem = $(`[rid=${rid}]`)[0];
        } else {
            $(elem).attr('rid', _.uniqueId('meteoric_rid_'));
        }
    }

    let $elem = $(elem);
    return $elem;
}
jqLite = _jqLite;
$window = jqLite(window);
$document = jqLite(document);

// TODO: DEPRECATE. We prefer meteoric.
METEORIC = {
    UTILITY: {}
};

var NODE_TYPE_ELEMENT = 1;
var NODE_TYPE_ATTRIBUTE = 2;
var NODE_TYPE_TEXT = 3;
var NODE_TYPE_COMMENT = 8;
var NODE_TYPE_DOCUMENT = 9;
var NODE_TYPE_DOCUMENT_FRAGMENT = 11;
function jqLiteInheritedData(element, name, value) {
    // if element is the document object work with the html element instead
    // this makes $(document).scope() possible
    if (element.nodeType == NODE_TYPE_DOCUMENT) {
        element = element.documentElement;
    }

    var names = _.isArray(name) ? name : [name];

    while (element) {
        for (var i = 0, ii = names.length; i < ii; i++) {
            if (isDefined(value = jqLite(element).$data(names[i]))) return value;
        }

        // If dealing with a document fragment node with a host element, and no parent, use the host
        // element as the parent. This enables directives within a Shadow DOM or polyfilled Shadow DOM
        // to lookup parent controllers.
        element = element.parentNode || (element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host);
    }
}

function reactiveSetScope($scope, $reactiveProp, val) {
    if (isDefined($scope[$reactiveProp])) {
        $scope[$reactiveProp].set(val);
    } else {
        $scope[$reactiveProp] = new ReactiveVar(val);
    }
}
meteoric.lib.reactiveSetScope = reactiveSetScope;
function reactiveGetOrSetDefaultScope($scope, $reactiveProp, defaultVal) {
    if (isDefined($scope[$reactiveProp])) {
        return $scope[$reactiveProp].get();
    } else {
        $scope[$reactiveProp] = new ReactiveVar(defaultVal);
        return $scope[$reactiveProp].get();  // We could return defaultVal, but then this won't be reactive.
    }
}
meteoric.lib.reactiveGetOrSetDefaultScope = reactiveGetOrSetDefaultScope;