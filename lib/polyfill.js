/**
 * Older browsers, specifically, Android 4.0 - 4.3 needs this.
 * @see http://caniuse.com/#search=requestAnimationFrame
 */
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Angular polyfills.

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
$state = meteoric.currentRouterAdapter;

class location {
    constructor(router) {
        this.router = router;
    }

    protocol() {
        return Iron.Location.get().protocol;
    }

    hostname() {
        return Iron.Location.get().hostname;
    }

    port() {
        return Iron.Location.get().port;
    }

    path(path) {
        if (isDefined(path)) {
            this.router.go(path);
            return;
        }
        return Iron.Location.get().pathname;
    }

    search() {
        return Iron.Location.get().search;
    }

    hash() {
        return Iron.Location.get().hash;
    }

    host() {
        return Iron.Location.get().host;
    }

    url(path) {
        if (isDefined(path)) {
            this.router.go(path);
            return;
        }
        return Iron.Location.get().name;
    }

    absUrl(path) {
        if (isDefined(path)) {
            this.router.go(path);
            return;
        }
        return Iron.Location.get().href;
    }
}
$location = new location(meteoric.currentRouterAdapter);