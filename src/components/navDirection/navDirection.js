/**
 * @ngdoc directive
 * @name ionNavDirection
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
 * <a ion-nav-direction="forward" href="#/home">Home</a>
 * ```
 */

import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let navDirection = new TemplateAttributeDirectiveType('navDirection', {
    $postLink($scope, $element, $attr) {
        $element.bind('click', function() {
            $ionicViewSwitcher.nextDirection($attr.navDirection);
        });
    }
});

export { navDirection };