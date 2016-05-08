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
 *
 * @param {string=} name A view name. The name should be unique amongst the other views in the
 * same state. You can have views of the same name that live in different states.
 */

import { updatePrototypeProperty } from '../../lib/utility';

Template.ionNavView.onCreated(function () {
    this.data = this.data || {};

    // Allow overriding the transition
    if (this.data && this.data.transition) {
        this.transition = this.data.transition;
    }

    $(this).on('$scopeCreated', () => {
        this.$scope.childRerendered = false;
    });
});

Template.ionNavView.onRendered(function () {
    var latestLocals;
    let $element = jqLite(this.firstNode),
        tElement = $element,
        $scope = this.$scope,
        $attrs = {

        };

    updatePrototypeProperty($scope, 'childRerendered', true);

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

        // initial load, ready go
        updateView(true);

        function updateView(firstTime) {
            // Meteoric note: Suppose we have a url /l1/l2/l3, and suppose we have view1 { view2 { view3 } }.
            // view1 { view2 } means view2 is nested inside view1. If only l2 in /l1/l2/l3,
            // updateView should only be called for view2 { view 3 }.
            //
            // Since we can't really do a {{#ionNavView route='/l1/l2'}} like in ionic, the following mechanism is devised:
            // * If nested ionTab calls $stateChangeSuccess, don't call navViewCtrl.register so we don't remove the
            //   nested ionTab.

            // register, update and transition to the new view
            if (!$scope.childRerendered) {
                navViewCtrl.register(undefined);
            }
            $scope.childRerendered = false;
        }
    });

    var container = this.firstNode;
    container._uihooks = {
        // Override onDestroyed so that's children won't remove themselves immediately.
        removeElement: function(node) { }  // viewSwitcher will remove it hopefully.
    };
});
