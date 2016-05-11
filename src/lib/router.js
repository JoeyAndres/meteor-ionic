export class RouteAdapter {
    constructor(route) {
        this.route = route;
    }

    path(data) { }
}

// todo: document. Basically copy it from iron router /flow router. Whoever have doc already.
export class RouterAdapter {
    constructor(router) {
        this.router = router;
    }

    go() {}
    current() {}
    routeName() {}
    params() {}
    routes(path) {}
}

export class IronRouterAdapter extends RouterAdapter {
    go() {
        if (arguments.length === 1) {
            let routeName = arguments[0];
            this.router.go(routeName);
        } else if (arguments.length > 1) {
            let routeName = arguments[0];
            let routeParams = arguments[1] || {};
            this.router.go(routeName, routeParams);
        }
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
    routes(path) {
        return new IronRouterRouteAdapter(this.router.routes[path]);
    }
};

export class IronRouterRouteAdapter extends RouteAdapter {
    path(data) {
        return this.route.path(data);
    }
}

export class FlowRouterAdapter extends RouterAdapter {
    go() {
        if (arguments.length === 1) {
            let routeName = arguments[0];
            this.router.go(routeName);
        } else if (arguments.length > 1) {
            let routeName = arguments[0];
            let routeParams = arguments[1] || {};
            this.router.go(routeName, routeParams);
        }
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
    routes(pathOrName) {
        pathOrName = pathOrName.trim();
        let route = this.router._routes.find(function(route) {
            if (route.path == pathOrName || route.name == pathOrName) {
                return true;
            }
            return false;
        });

        return new FlowRouterRouteAdapter(route);
    }
}

export class FlowRouterRouteAdapter extends RouteAdapter {
    path(data = {}) {
        return Package['kadira:flow-router'].FlowRouter.path(this.route.path, data, data);
    }
}

meteoric.RouterAdapter = RouterAdapter;

// todo: Select base on router type.
export let RouterInstance = null;
if (Package['iron:router']) {
    RouterInstance = new IronRouterAdapter(Router);
} else if (Package['kadira:flow-router']) {
    RouterInstance = new FlowRouterAdapter(Package['kadira:flow-router'].FlowRouter);
}

meteoric.Router = RouterInstance;
$state = {
    go: RouterInstance.go.bind(meteoric.Router),

    get current() {
        let current =  meteoric.Router.current();
        current.name = $state.routeName;
        return current;
    },
    get routeName() { return meteoric.Router.routeName(); },
    get params() { return meteoric.Router.params(); }
};