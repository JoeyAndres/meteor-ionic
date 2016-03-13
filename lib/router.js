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
    go() { this.router.apply(arguments); }
    current() { return this.router.current(); }
    routeName() { return this.router.current().route.getName(); }
    params() { return this.router.current().params; }
};

meteoric.RouterAdapter = RouterAdapter;
meteoric.IronRouterAdapter = IronRouterAdapter;