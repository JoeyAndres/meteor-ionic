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

/**
 * This is from angular source code. Only meant to be used for Scope.
 * @param array1
 * @param array2
 * @param index
 * @returns {string|Array.<T>}
 */
function concat(array1, array2, index) {
    return array1.concat(Array.prototype.slice.call(array2, index));
}

function $destroy () {
    if (!this.$$destroyed) {
        // Destroy parent so that we won't traverse upward anymore.
        Object.setPrototypeOf(this, null);
        this.$parent = null;
        this.$emit('$destroy');
        this.$$destroyed = true;
    }
}

class Scope {
    constructor() {
        this.$root = this;
        this.$$destroyed = false;
        this.$$listeners = {};
        this.$$listenerCount = {};

        this.$on = $on;
        this.$emit = $emit;
        this.$destroy = $destroy;
    }

    /**
     * @ngdoc method
     * @name $rootScope.Scope#$new
     * @kind function
     *
     * @description
     * Creates a new child {@link ng.$rootScope.Scope scope}.
     *
     * The parent scope will propagate the {@link ng.$rootScope.Scope#$digest $digest()} event.
     * The scope can be removed from the scope hierarchy using {@link ng.$rootScope.Scope#$destroy $destroy()}.
     *
     * {@link ng.$rootScope.Scope#$destroy $destroy()} must be called on a scope when it is
     * desired for the scope and its child scopes to be permanently detached from the parent and
     * thus stop participating in model change detection and listener notification by invoking.
     *
     * @param {boolean} isolate If true, then the scope does not prototypically inherit from the
     *         parent scope. The scope is isolated, as it can not see parent scope properties.
     *         When creating widgets, it is useful for the widget to not accidentally read parent
     *         state.
     *
     * @param {Scope} [parent=this] The {@link ng.$rootScope.Scope `Scope`} that will be the `$parent`
     *                              of the newly created scope. Defaults to `this` scope if not provided.
     *                              This is used when creating a transclude scope to correctly place it
     *                              in the scope hierarchy while maintaining the correct prototypical
     *                              inheritance.
     *
     * @returns {Object} The newly created child scope.
     *
     */
    $new (isolate, parent) {
        var child;

        parent = parent || this;

        if (isolate) {
            child = new Scope();
            child.$root = this.$root;
        } else {
            child = new Scope();
            Object.setPrototypeOf(child, parent);
        }
        child.$parent = parent;

        return child;
    }
};

_.extend(meteoric.Utils, {
    $rootScope: new Scope()
});