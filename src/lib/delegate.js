class Delegate {
    constructor() {
        this._instances = [];
    }

    addInstance(aggregate) {
        this._instances.push(aggregate);
    }

    removeInstance(aggregate) {
        let index = this._instances.indexOf(aggregate);
        console.log(index, this._instances[0] == aggregate);
        if (index !== -1) {
            this._instances.splice(index, 1);
        }
    }

    callMethod() {
        var args = Array.prototype.slice.call(arguments);
        let method = args.shift();
        this._instances.forEach(d => d[method].apply(d, arguments));
    }

    addMethods(methods) {
        let self = this;
        methods.forEach(method => {
            this[method] = function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(method);
                self.callMethod.apply(self, args)
            }
        }, this);
    }
};

meteoric.lib.Delegate = Delegate;

// todo: commit this fix separately.