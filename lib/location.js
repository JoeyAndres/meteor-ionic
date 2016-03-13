class location {
    constructor() {
        this.parser = document.createElement('a');
    }

    _parse() {
        this.parser.href = window.location;
        return this.parser;
    }

    protocol() {
        return this._parse().protocol;
    }

    hostname() {
        return this._parse().hostname;
    }

    port() {
        return this._parse().port;
    }

    path(path) {
        if (isDefined(path)) {
            window.location = this.host() + path;
            return;
        }
        return this._parse().pathname;
    }

    search() {
        return this._parse().search;
    }

    hash() {
        return this._parse().hash;
    }

    host() {
        return this._parse().host;
    }

    url(path) {
        if (isDefined(path)) {
            window.location = this.host() + path;
            return;
        }
        return this.path() + this.search() + this.hash();
    }

    absUrl(path) {
        if (isDefined(path)) {
            window.location = path;
            return;
        }
        return window.location;
    }
}
meteoric.location = new location();