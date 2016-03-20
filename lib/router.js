class RouterAdapter {
    constructor(router) {
        this.router = router;
    }

    go() {}
    current() {}
    routeName() {}
    params() {}
};

class IronRouterAdapter extends RouterAdapter {
    go() {
        this.router.go.apply(this, arguments);
    }
    current() { return this.router.current(); }
    routeName() { return this.router.current().route.getName(); }
    params() {
        let params_copy = {};
        for (var key in this.current().params) {
            if (this.current().params.hasOwnProperty(key) && this.current().params[key]) {
                params_copy[key] = this.current().params[key];
            }
        }
        delete params_copy.query;

        return params_copy;
    }
};

meteoric.RouterAdapter = RouterAdapter;
meteoric.IronRouterAdapter = IronRouterAdapter;

// todo: Select base on router type.
meteoric.currentRouterAdapter = new meteoric.IronRouterAdapter(Router);