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
meteoric.location = new location(meteoric.currentRouterAdapter);