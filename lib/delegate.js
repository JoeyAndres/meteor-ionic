class Delegate {
    constructor() {
        this._instances = [];
    }

    addInstance(aggregate) {
        this._instances.push(aggregate);
    }

    removeInstance(aggregate) {
        let index = this._instances.indexOf(aggregate);
        if (index !== -1) {
            this._instances.splice(1, index);
        }
    }

    callMethod() {
        let method = arguments.shift();
        this._instances[method].apply(this, arguments);
    }

    addMethods(methods) {
        methods.forEach(method => {
            this[method] = function() {
                arguments.unshift(method);
                this.callMethod.apply(this, arguments)
            }
        }, this);
    }
};

meteoric.lib.Delegate = Delegate;