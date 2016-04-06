/**
 * @ngdoc directive
 * @name navDirection
 * @module meteoric
 * @restrict A
 *
 * @description
 * The direction which the nav view transition should animate. Available options
 * are: `forward`, `back`, `enter`, `exit`, `swap`.
 *
 * @usage
 *
 * ```html
 * <a nav-direction="forward" href="#/home">Home</a>
 * ```
 */

import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let ionNavDirection = new TemplateAttributeDirectiveType('ionNavDirection', {
    $postLink($scope, $element, $attr) {
        $element.bind('click', function() {
            // Note: ionnavdirection instead of ionNavDirection due
            //       to Node.attributes lowercasing.
            $ionicViewSwitcher.nextDirection($attr.ionNavDirection);
        });
    }
});

export { ionNavDirection };