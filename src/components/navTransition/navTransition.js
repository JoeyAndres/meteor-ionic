/**
 * @ngdoc directive
 * @name ionNavTransition
 * @module meteoric
 * @restrict A
 *
 * @description
 * The transition type which the nav view transition should use when it animates.
 * Current, options are `ios`, `android`, and `none`. More options coming soon.
 *
 * @usage
 *
 * ```html
 * <a ion-nav-transition="none" href="#/home">Home</a>
 * ```
 */

import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let navTransition = new TemplateAttributeDirectiveType('navTransition', {
    $postLink($scope, $element, $attr) {
        $element.bind('click', function() {
            $ionicViewSwitcher.nextTransition($attr.navTransition);
        });
    }
});

export { navTransition };