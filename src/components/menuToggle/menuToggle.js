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
 * ```handlebars
 {{#ionNavBar class="bar-assertive"}}
     {{#ionNavButtons side="left"}}
         <button class="button button-clear pull-left" menu-toggle="left">
             <i class="icon ion-navicon"></i>
         </button>
     {{/ionNavButtons}}
     {{#ionNavButtons side="right"}}
         <button class="button button-clear pull-right" menu-toggle="right">
             <i class="icon ion-navicon"></i>
         </button>
     {{/ionNavButtons}}
 {{/ionNavBar}}
 * ```
 *
 * ### Button Hidden On Child Views
 * By default, the menu toggle button will only appear on a root
 * level side-menu page. Navigating in to child views will hide the menu-
 * toggle button. They can be made visible on child pages by setting the
 * enable-menu-with-back-views attribute of the {@link meteoric.directive:ionSideMenus}
 * directive to true.
 *
 * ```handlebars
 * {{#ionSideMenus enableMenuWithBackViews=true}}
 * ```
 */

import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let menuToggle = new TemplateAttributeDirectiveType('menuToggle', {
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
            sideMenuCtrl && sideMenuCtrl.toggle(self.$attrs().menuToggle);
        };

        $('body').on('click', this.$elementSelector(), clickHandler);
        $scope.$on('$destroy', function() { $('body').off('click', self.$elementSelector(), clickHandler); });
    }
});

export { menuToggle };