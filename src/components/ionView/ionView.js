/**
 * @ngdoc directive
 * @name ionView
 * @module meteoric
 * @restrict E
 * @parent ionNavView
 *
 * @description
 * A container for view content and any navigational and header bar information. When a view
 * enters and exits its parent {@link meteoric.directive:ionNavView}, the view also emits view
 * information, such as its title, whether the back button should be displayed or not, whether the
 * corresponding {@link meteoric.directive:ionNavBar} should be displayed or not, which transition the view
 * should use to animate, and which direction to animate.
 *
 * @usage
 * Below is an example where our page will load with a {@link meteoric.directive:ionNavBar} containing
 * "My Page" as the title.
 *
 * ```handlebars
     <template name="ExamplePage">
         {{#ionView title="My Page"}}
             {{#ionContent}}
                 <div class="padding">
                     <a href="{{pathFor 'index'}}" class="button button-stable" data-nav-direction="back"><i class="icon ionic-ios-arrow-back"></i> Back</a>
                     <a href="{{pathFor 'navigation.one'}}" class="button button-stable"><i class="icon ionic-ios-arrow-forward"></i> Forward</a>
                 </div>
             {{/ionContent}}
         {{/ionView}}
     </template>
 * ```
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
 * @param {string=} viewTitle A text-only title to display on the parent {@link meteoric.directive:ionNavBar}.
 * For an HTML title, such as an image, see {@link meteoric.directive:ionNavTitle} instead.
 * @param {boolean=} canSwipeBack If this view should be allowed to use the swipe to go back gesture or not.
 * This does not enable the swipe to go back feature if it is not available for the platform it's running
 * from, or there isn't a previous view. Default `true`
 * @param {boolean=} hideBackButton Whether to hide the back button on the parent
 * {@link meteoric.directive:ionNavBar} by default.
 * @param {boolean=} hideNavBar Whether to hide the parent
 * {@link meteoric.directive:ionNavBar} by default.
 */

import { afterFlushPromise } from './../../lib/utility';

ionViewDefault = {
    viewTitle: undefined,
    canSwipeBack: true,
    hideBackButton: false,
    hideNavBar: false
};

Template.ionView.onCreated(function() {
    this.new_scope = true;

    this.title = new ReactiveVar(ionViewDefault.viewTitle);
    this.viewTitle = new ReactiveVar(ionViewDefault.viewTitle);
    this.canSwipeBack = new ReactiveVar(ionViewDefault.canSwipeBack);
    this.hideBackButton = new ReactiveVar(ionViewDefault.hideBackButton);
    this.hideNavBar = new ReactiveVar(ionViewDefault.hideNavBar);

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;

        this.title.set(isDefined(td.title) ? td.title : ionViewDefault.viewTitle);
        this.viewTitle.set(isDefined(td.viewTitle) ? td.viewTitle : ionViewDefault.viewTitle);
        this.canSwipeBack.set(isDefined(td.canSwipeBack) ? td.canSwipeBack : ionViewDefault.canSwipeBack);
        this.hideBackButton.set(isDefined(td.hideBackButton) ? td.hideBackButton : ionViewDefault.hideBackButton);
        this.hideNavBar.set(isDefined(td.hideNavBar) ? td.hideNavBar : ionViewDefault.hideNavBar);
    });
});

Template.ionView.onRendered(function () {
    let $scope = this.$scope;
    let $element = jqLite(this.firstNode);
    let $attrs = {
        title: this.title,
        viewTitle: this.viewTitle,
        canSwipeBack: this.canSwipeBack,
        hideBackButton: this.hideBackButton,
        hideNavBar: this.hideNavBar
    };

    let viewCtrl;
    $(this).on('$preLink', () => {
        viewCtrl = new $ionicView($scope, $element, $attrs);
        $element.data('$ionViewController', viewCtrl);
    });

    $(this).on('$postLink', () => {
        viewCtrl.init();
    });

    afterFlushPromise(() => {
        this.$scope.$emit('$stateChangeSuccess');
    });
});