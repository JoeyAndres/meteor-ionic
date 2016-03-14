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
    params() { return this.router.current().params; }
};

meteoric.RouterAdapter = RouterAdapter;
meteoric.IronRouterAdapter = IronRouterAdapter;

// todo: Select base on router type.
meteoric.currentRouterAdapter = new meteoric.IronRouterAdapter(Router);