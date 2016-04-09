/**
 * @ngdoc directive
 * @name menuToggle
 * @module meteoric
 * @restrict AC
 *
 * @description
 * Toggle a side menu on the given side.
 *
 * @usage
 * Below is an example of a link within a nav bar. Tapping this button
 * would open the given side menu, and tapping it again would close it.
 *
 * ```html
 * <ion-nav-bar>
 *   <ion-nav-buttons side="left">
 *    <!-- Toggle left side menu -->
 *    <button menu-toggle="left" class="button button-icon icon ion-navicon"></button>
 *   </ion-nav-buttons>
 *   <ion-nav-buttons side="right">
 *    <!-- Toggle right side menu -->
 *    <button menu-toggle="right" class="button button-icon icon ion-navicon"></button>
 *   </ion-nav-buttons>
 * </ion-nav-bar>
 * ```
 *
 * ### Button Hidden On Child Views
 * By default, the menu toggle button will only appear on a root
 * level side-menu page. Navigating in to child views will hide the menu-
 * toggle button. They can be made visible on child pages by setting the
 * enable-menu-with-back-views attribute of the {@link meteoric.directive:ionSideMenus}
 * directive to true.
 *
 * ```html
 * <ion-side-menus enable-menu-with-back-views="true">
 * ```
 */

import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let ionMenuToggle = new TemplateAttributeDirectiveType('ionMenuToggle', {
    $postLink($scope, $element, $attr) {
        let self = this;

        $scope.$on('$ionicView.beforeEnter', function(ev, viewData) {
            if (viewData.enableBack &&
                self.$element()[0]) {  // This demo code place this in ionNavButtons which relocates and fuck things up.
                var sideMenuCtrl = self.$element().inheritedData('$ionSideMenusController');
                if (!sideMenuCtrl.enableMenuWithBackViews()) {
                    self.$element().addClass('hide');
                }
            } else {
                self.$element().removeClass('hide');
            }
        });

        let clickHandler = function() {
            var sideMenuCtrl = jqLite(this).inheritedData('$ionSideMenusController');
            sideMenuCtrl && sideMenuCtrl.toggle(self.$attrs().ionMenuToggle);
        };

        $('body').on('click', this.$elementSelector(), clickHandler);
        $scope.$on('$destroy', function() { $('body').off('click', self.$elementSelector(), clickHandler); });
    }
});

export { ionMenuToggle };