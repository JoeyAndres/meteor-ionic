/**
 * @ngdoc directive
 * @name navTransition
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
 * <a nav-transition="none" href="#/home">Home</a>
 * ```
 */

import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let ionNavTransition = new TemplateAttributeDirectiveType('ionNavTransition', {
    $postLink($scope, $element, $attr) {
        $element.bind('click', function() {
            // Note: ionnavtransition instead of ionNavTransition due
            //       to Node.attributes lowercasing.
            $ionicViewSwitcher.nextTransition($attr.ionNavTransition);
        });
    }
});

export { ionNavTransition };