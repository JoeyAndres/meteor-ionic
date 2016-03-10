IonScrollPositions = {};

// TODO: Add Routing-Agnostic scroll-to-top - method

//RouterLayer.onStop(function () {
//  IonScrollPositions[this.route.path(this.params)] = $('.overflow-scroll').scrollTop();
//});

Template.ionNavBackButton.events({
  'click': function (event, template) {
    $('[data-nav-container]').attr('nav-view-direction', 'back');
    $('[data-navbar-container]').attr('nav-bar-direction', 'back');

    if (template.backUrl) {
      RouterLayer.go(template.backUrl);
    } else {
      window.history.back();
    }
  }
});

Template.ionNavBackButton.onCreated(function () {
  this.data = this.data || {};
});

Template.ionNavBackButton.onRendered(function () {
  var self = this;
  this.getBackUrl = function () {
    var backUrl = null;

    self.data = self.data || {};

    if (self.data.href) {
      backUrl = self.data.href;
    }

    if (self.data.path) {
      backRoute = RouterLayer.routes[self.data.path];
      if (!backRoute) {
        console.warn("back to nonexistent route: ", self.data.path);
        return;
      }
      backUrl = backRoute.path(Template.parentData(1));
    }
    return backUrl;
  };
});

Template.ionNavBackButton.helpers({
  classes: function () {
    var classes = ['buttons button button-clear back-button pull-left'];

    if (this.class) {
      classes.push(this.class);
    }

    return classes.join(' ');
  },

  icon: function () {
    if (this.icon) {
      return this.icon;
    }

    if (Platform.isAndroid()) {
      return 'android-arrow-back';
    }

    return 'ios-arrow-back';
  },

  text: function () {
      return this.text;
  }
});
