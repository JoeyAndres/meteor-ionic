/**
 * @private
 */
function $LocationDecorator($location, $timeout) {

  $location.__hash = $location.hash;
  //Fix: when window.location.hash is set, the scrollable area
  //found nearest to body's scrollTop is set to scroll to an element
  //with that ID.
  $location.hash = function(value) {
    if (isDefined(value) && value.length > 0) {
      $timeout(function() {
        var scroll = document.querySelector('.scroll-content');
        if (scroll) {
          scroll.scrollTop = 0;
        }
      }, 0, false);
    }
    return $location.__hash(value);
  };

  return $location;
}

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
$location = $LocationDecorator($location, $timeout);
