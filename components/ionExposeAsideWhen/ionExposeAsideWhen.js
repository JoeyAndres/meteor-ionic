/**
 * @ngdoc directive
 * @name exposeAsideWhen
 * @module meteoric
 * @restrict A
 * @parent ionic.directive:ionSideMenus
 * @description
 * It is common for a tablet application to hide a menu when in portrait mode, but to show the
 * same menu on the left side when the tablet is in landscape mode. The `exposeAsideWhen` attribute
 * directive can be used to accomplish a similar interface.
 *
 * By default, side menus are hidden underneath its side menu content, and can be opened by either
 * swiping the content left or right, or toggling a button to show the side menu. However, by adding the
 * `exposeAsideWhen` attribute directive to an {@link ionic.directive:ionSideMenu} element directive,
 * a side menu can be given instructions on "when" the menu should be exposed (always viewable). For
 * example, the `expose-aside-when="large"` attribute will keep the side menu hidden when the viewport's
 * width is less than `768px`, but when the viewport's width is `768px` or greater, the menu will then
 * always be shown and can no longer be opened or closed like it could when it was hidden for smaller
 * viewports.
 *
 * Using `large` as the attribute's value is a shortcut value to `(min-width:768px)` since it is
 * the most common use-case. However, for added flexibility, any valid media query could be added
 * as the value, such as `(min-width:600px)` or even multiple queries such as
 * `(min-width:750px) and (max-width:1200px)`.
 *
 * ```html
 * <ion-side-menus>
 *   <!-- Center content -->
 *   <ion-side-menu-content>
 *   </ion-side-menu-content>
 *
 *   <!-- Left menu -->
 *   <ion-side-menu expose-aside-when="large">
 *   </ion-side-menu>
 * </ion-side-menus>
 * ```
 * For a complete side menu example, see the
 * {@link ionic.directive:ionSideMenus} documentation.
 */

import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let ionExposeAsideWhen = new TemplateAttributeDirectiveType('ionExposeAsideWhen', {
    $postLink($scope, $element, $attr) {
        let sideMenuCtrl = $scope.$sideMenuCtrl;

        // Setup a match media query listener that triggers a ui change only when a change
        // in media matching status occurs
        var mq = $attr.ionExposeAsideWhen == 'large' ? '(min-width:768px)' : $attr.ionExposeAsideWhen;
        var mql = $window[0].matchMedia(mq);
        mql.addListener(function() {
            onResize();
        });

        function checkAsideExpose() {
            var mq = $attr.ionExposeAsideWhen == 'large' ? '(min-width:768px)' : $attr.ionExposeAsideWhen;
            sideMenuCtrl.exposeAside($window[0].matchMedia(mq).matches);
            sideMenuCtrl.activeAsideResizing(false);
        }

        function onResize() {
            sideMenuCtrl.activeAsideResizing(true);
            debouncedCheck();
        }

        var debouncedCheck = ionic.debounce(function() {
            checkAsideExpose.apply($scope);
        }, 300, false);

        $timeout(checkAsideExpose);
    }
});

export { ionExposeAsideWhen };