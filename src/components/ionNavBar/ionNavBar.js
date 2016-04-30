
/**
 * @ngdoc directive
 * @name ionNavBar
 * @module meteoric
 * @delegate meteoric.service:$ionicNavBarDelegate
 * @restrict E
 *
 * @description
 * If we have an {@link meteoric.directive:ionNavView} directive, we can also create an
 * `ionNavBar`, which will create a topbar that updates as the application state changes.
 *
 * We can add a back button by putting an {@link meteoric.directive:ionNavBackButton} inside.
 *
 * We can add buttons depending on the currently visible view using
 * {@link meteoric.directive:ionNavButtons}.
 *
 * Note that the ionNavBar element will only work correctly if your content has an
 * ionView around it.
 *
 * @usage
 *
 * In your layout, see {@link meteoric.directive:ionNavView} for more info:
 *
 * ```handlebars
 {{#ionNavBar class="bar-assertive"}}
     {{#ionNavBackButton}}{{/ionNavBackButton}}
 {{/ionNavBar}}
 {{#ionNavView}}
     {{> yield}}
 {{/ionNavView}}
 * ```
 *
 * @param alignTitle {string=} Where to align the title of the navbar.
 * Available: 'left', 'right', 'center'. Defaults to 'center'.
 * @param {boolean=} noTapScroll By default, the navbar will scroll the content
 * to the top when tapped.  Set noTapScroll to true to disable this behavior.
 */

Template.ionNavBar.onCreated(function() {
    this.new_scope = true;

    // todo: See the point of delegate-handle
    this.alignTitle = this.data ? this.data.alignTitle : null;
    this.noTapScroll = this.data ?  this.data.noTapScroll : false;

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;
    });
});

Template.ionNavBar.onRendered(function() {
    let $scope = this.$scope,
        $element = jqLite(this.firstNode),
        $attrs = {
            alignTitle: this.alignTitle
        };

    let ctrl;
    $(this).on('$preLink', () => {
        ctrl = new $ionicNavBar($scope, $element, $attrs);

        // meteoric: Other templates with same scope need access to this.
        $scope.$ionicNavBar = ctrl;
    });

    $(this).on('$postLink', () => {
        ctrl.init();
    });

    this.firstNode._uihooks = {
        // Override onDestroyed so that's children won't remove themselves immediately.
        removeElement: function(node) { }  // viewSwitcher will remove it hopefully.
    };
});