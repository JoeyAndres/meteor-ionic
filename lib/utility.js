_.extend(window.meteoric, {
    hasHeader: new ReactiveVar(false),
    hasFooter: new ReactiveVar(false),

    /**
     * In a worst case scenario, such that "transitionend" event is not called,
     * for any reason. This will be the maximum alloted duration. This will
     * prevent memory leaks during transition out events, in which some views
     * are still in the DOM tree, even though they should've been removed.
     */
    maximum_transition_duration: 1400
});

function to$element(elem) {
    return _.extend($(elem), elem);
}

function $on(name, listener) {
    var namedListeners = this.$$listeners[name];
    if (!namedListeners) {
        this.$$listeners[name] = namedListeners = [];
    }
    namedListeners.push(listener);

    var current = this;
    do {
        if (!current.$$listenerCount[name]) {
            current.$$listenerCount[name] = 0;
        }
        current.$$listenerCount[name]++;

    } while ((current = current.$parent) && isDefined(current.$$listenerCount));

    var self = this;
    return function() {
        var indexOfListener = namedListeners.indexOf(listener);
        if (indexOfListener !== -1) {
            namedListeners[indexOfListener] = null;
            decrementListenerCount(self, 1, name);
        }
    };
}

function $emit(name, args) {
    var empty = [],
        namedListeners,
        scope = this,
        stopPropagation = false,
        event = {
            name: name,
            targetScope: scope,
            stopPropagation: function() {stopPropagation = true;},
            preventDefault: function() {
                event.defaultPrevented = true;
            },
            defaultPrevented: false
        },
        listenerArgs = concat([event], arguments, 1),
        i, length;

    do {
        namedListeners = scope.$$listeners[name] || empty;
        event.currentScope = scope;
        for (i = 0, length = namedListeners.length; i < length; i++) {

            // if listeners were deregistered, defragment the array
            if (!namedListeners[i]) {
                namedListeners.splice(i, 1);
                i--;
                length--;
                continue;
            }
            try {
                //allow all listeners attached to the current scope to run
                namedListeners[i].apply(null, listenerArgs);
            } catch (e) {
                throw e;
            }
        }
        //if any listener on the current scope stops propagation, prevent bubbling
        if (stopPropagation) {
            event.currentScope = null;
            return event;
        }
        //traverse upwards
        scope = scope.$parent;
    } while (scope && isDefined(scope.$$listeners));

    event.currentScope = null;

    return event;
}

function decrementListenerCount(current, count, name) {
    do {
        current.$$listenerCount[name] -= count;

        if (current.$$listenerCount[name] === 0) {
            delete current.$$listenerCount[name];
        }
    } while ((current = current.$parent));
}

function concat(array1, array2, index) {
    return array1.concat(Array.prototype.slice.call(array2, index));
}

function createScope(scope, $parent) {
    scope.$$listeners = {};
    scope.$$listenerCount = {};
    scope.$destroy = () => scope.$emit('$destroy');
    scope.$on = $on;
    scope.$emit = $emit;

    Object.setPrototypeOf(scope, $parent);
    scope.$parent = $parent;
    
    return scope;
}

_.extend(meteoric.Utils, {
    $rootScope: createScope({}, new Object),

    transitionend_events: [
        'transitionend',
        'webkitTransitionEnd',
        'oTransitionEnd'  // oTransitionEnd in very old Opera
    ],

    /**
     * Throttle the given fun, only allowing it to be
     * called at most every `wait` ms.
     */
    throttle(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options || (options = {});
        var later = function() {
            previous = options.leading === false ? 0 : Date.now();
            timeout = null;
            result = func.apply(context, args);
        };
        return function() {
            var now = Date.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    },

    to$element,
    createScope
});