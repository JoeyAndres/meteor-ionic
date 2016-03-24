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
noop = _.noop;
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
        }, delay)
    });
    p.id = id;
    return p;
};
$timeout.cancel = function(p) {
    Meteor.clearTimeout(p.id);
};
function to$element(elem) {
    return _.extend($(elem), elem);
}
jqLite = to$element;
$window = jqLite(window);
$document = jqLite(document);

// TODO: DEPRECATE. We prefer meteoric.
METEORIC = {
    UTILITY: {}
};