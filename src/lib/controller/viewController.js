$ionicView =
function($scope, $element, $attrs) {
  var self = this;
  var navElementHtml = {};
  var navViewCtrl;
  var navBarDelegateHandle;
  var hasViewHeaderBar;
  var deregisters = [];
  var viewTitle;

  var deregIonNavBarInit = $scope.$parent.$on('ionNavBar.init', function(ev, delegateHandle) {
    // this view has its own ion-nav-bar, remember the navBarDelegateHandle for this view
    ev.stopPropagation();
    navBarDelegateHandle = delegateHandle;
  });


  self.init = function() {
    deregIonNavBarInit();

    var modalCtrl = $element.inheritedData('$ionModalController');
    navViewCtrl = $element.inheritedData('$ionNavViewController');

    // don't bother if inside a modal or there's no parent navView
    if (!navViewCtrl || modalCtrl) return;

    // add listeners for when this view changes
    $scope.$on('$ionicView.beforeEnter', self.beforeEnter);
    $scope.$on('$ionicView.afterEnter', afterEnter);
    $scope.$on('$ionicView.beforeLeave', deregisterFns);
  };

  self.beforeEnter = function(ev, transData) {
    // this event was emitted, starting at intial ion-view, then bubbles up
    // only the first ion-view should do something with it, parent ion-views should ignore
    if (transData && !transData.viewNotified) {
      transData.viewNotified = true;
      viewTitle = isDefined($attrs.viewTitle.get()) ? $attrs.viewTitle.get() : $attrs.title.get();

      var navBarItems = {};
      for (var n in navElementHtml) {
        navBarItems[n] = generateNavBarItem(navElementHtml[n]);
      }

      navViewCtrl.beforeEnter(extend(transData, {
        title: viewTitle,
        showBack: !attrTrue('hideBackButton'),
        navBarItems: navBarItems,
        navBarDelegate: navBarDelegateHandle || null,
        showNavBar: !attrTrue('hideNavBar'),
        hasHeaderBar: !!hasViewHeaderBar
      }));

      // make sure any existing observers are cleaned up
      deregisterFns();
    }
  };

  function afterEnter() {
    // only listen for title updates after it has entered
    // but also deregister the observe before it leaves
    var viewTitleAttr = isDefined($attrs.viewTitle.get()) && 'viewTitle' || isDefined($attrs.title.get()) && 'title';
    if (viewTitleAttr) {
      titleUpdate($attrs[viewTitleAttr].get());
      //deregisters.push($attrs.$observe(viewTitleAttr, titleUpdate));
    }

    if (isDefined($attrs.hideBackButton.get())) {
      /*deregisters.push($scope.$watch($attrs.hideBackButton, function(val) {
        navViewCtrl.showBackButton(!val);
      }));*/
    }

    if (isDefined($attrs.hideNavBar.get())) {
      /*deregisters.push($scope.$watch($attrs.hideNavBar, function(val) {
        navViewCtrl.showBar(!val);
      }));*/
    }
  }


  function titleUpdate(newTitle) {
    if (isDefined(newTitle) && newTitle !== viewTitle) {
      viewTitle = newTitle;
      navViewCtrl.title(viewTitle);
    }
  }


  function deregisterFns() {
    // remove all existing $attrs.$observe's
    for (var x = 0; x < deregisters.length; x++) {
      deregisters[x]();
    }
    deregisters = [];
  }


  function generateNavBarItem(html) {
    if (html) {
      // every time a view enters we need to recreate its view buttons if they exist

      // meteoric: This is impossible with Blaze.render without destroying navBarController.
      //           ionNavButtons attach an id to uniquely identify this element and therefore
      //           be able to respond to events.
      return jqLite(html);
    }
  }


  function attrTrue(key) {
    return !!$attrs[key].get();
  }


  self.navElement = function(type, html) {
    navElementHtml[type] = html;
  };

};
