/**
 * @ngdoc directive
 * @name exposeAsideWhen
 * @module meteoric
 * @restrict A
 * @parent meteoric.directive:ionSideMenus
 * @description
 * It is common for a tablet application to hide a menu when in portrait mode, but to show the
 * same menu on the left side when the tablet is in landscape mode. The `exposeAsideWhen` attribute
 * directive can be used to accomplish a similar interface.
 *
 * By default, side menus are hidden underneath its side menu content, and can be opened by either
 * swiping the content left or right, or toggling a button to show the side menu. However, by adding the
 * `exposeAsideWhen` attribute directive to an {@link meteoric.directive:ionSideMenu} element directive,
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
 * Note:
 * - There is a [bug](https://github.com/driftyco/ionic/issues/2328) when side-menu is shown, in that
 *   it will partially hide the ionSideMenuContent, which is unacceptable. The link given is the bug
 *   report for this in the original ionic.
 *
 * @usage
 *
 * ```handlebars
 <div class="bar bar-header bar-dark" expose-aside-when="large">
   <h1 class="title">Right Menu</h1>
 </div>
 * ```
 * For a complete side menu example, see the
 * {@link meteoric.directive:ionSideMenus} documentation.
 */

import { TemplateAttributeDirectiveType } from 'meteor/meteoric124:template-attribute-directive';

let exposeAsideWhen = new TemplateAttributeDirectiveType('exposeAsideWhen', {
    $postLink($scope, $element, $attr) {
        let sideMenuCtrl = $scope.$sideMenuCtrl;

        // Setup a match media query listener that triggers a ui change only when a change
        // in media matching status occurs
        var mq = $attr.exposeAsideWhen == 'large' ? '(min-width:768px)' : $attr.exposeAsideWhen;
        var mql = $window[0].matchMedia(mq);
        mql.addListener(function() {
            onResize();
        });

        function checkAsideExpose() {
            var mq = $attr.exposeAsideWhen == 'large' ? '(min-width:768px)' : $attr.exposeAsideWhen;
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

export { exposeAsideWhen };