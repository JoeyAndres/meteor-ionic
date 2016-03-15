// Globals exposed in original ionic.
extend = meteoric.angular.extend;
forEach = meteoric.angular.forEach;
isNumber = meteoric.angular.isNumber;
isString = meteoric.angular.isString;
$timeout = function(fn, delay) {
    let id;
    let p = new Promise(function(resolve, reject) {
        id = Meteor.setTimeout(() => {
            fn();
            resolve();
        }, delay)
    });
    return id;
};
$timeout.cancel = function(id) {
    Meteor.clearTimeout(id);
};
function to$element(elem) {
    return _.extend($(elem), elem);
}
jqLite = to$element;