/**
 * @ngdoc directive
 * @name ionNavView
 * @module meteoric
 * @restrict E
 * @codepen odqCz
 *
 * @description
 * As a user navigates throughout your app, Meteoric is able to keep track of their
 * navigation history. By knowing their history, transitions between views
 * correctly enter and exit using the platform's transition style.
 *
 * ***Notes***
 * - `ionNavView` utilizes `iron:router`.
 * - Plans for integrating `flow:router` is work in progress.
 *
 * @usage
 *
 * In your layout template:
 *
 * ```handlebars
   <template name="layout">
     <body>
       {{#ionNavView}}
         {{> yield}}
       {{/ionNavView}}
     </body>
   </template>
 * ```
 *
 * In your router:
 *
 * ```javascript
  Router.configure({
    layoutTemplate: 'layout'
  });
 * ```
 */

Template.ionNavView.onCreated(function () {
  this.data = this.data || {};

  // Allow overriding the transition
  if (this.data && this.data.transition) {
    this.transition = this.data.transition;
  }
});

Template.ionNavView.onRendered(function () {
  let $element = jqLite(this.firstNode),
      tElement = $element,
      $scope = this.$scope,
      $attrs = {};

  // a nav view element is a container for numerous views
  tElement.addClass('view-container');
  ionic.DomUtil.cachedAttr(tElement, 'nav-view-transition', $ionicConfig.views.transition());

  let navViewCtrl = new $ionicNavView($scope, $element, $attrs);
  $(this).on('$preLink', () => {
    $element.$data('$ionNavViewController', navViewCtrl);
  });

  $(this).on('$postLink', () => {
    var viewData = navViewCtrl.init();

    // listen for $stateChangeSuccess
    $scope.$on('$stateChangeSuccess', function() {
      updateView(false);
    });
    $scope.$on('$viewContentLoading', function() {
      updateView(false);
    });

    // Since ionNavView assumes there is an ion-view below, might aswell use this one.
    // todo: try to utilize the iron router.

    // initial load, ready go
    updateView(true);

    function updateView(firstTime) {
      // get the current local according to the $state
      //var viewLocals = $state.$current && $state.$current.locals[viewData.name];

      // do not update THIS nav-view if its is not the container for the given state
      // if the viewLocals are the same as THIS latestLocals, then nothing to do
      // NOTE: FUCK IT, TRANSITION ALL. I'm not rewriting angular-ui-router and jump off some bridge half way.
      //if (!viewLocals || (!firstTime && viewLocals === latestLocals)) return;

      // update the latestLocals
      //latestLocals = viewLocals;
      //viewData.state = viewLocals.$$state;

      // register, update and transition to the new view
      //navViewCtrl.register(viewLocals);
      navViewCtrl.register(undefined);
    }
  });

  var container = this.firstNode;
  container._uihooks = {
    // Override onDestroyed so that's children won't remove themselves immediately.
    removeElement: function(node) { }  // viewSwitcher will remove it hopefully.
  };
});
