import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let ionNavTransition = new TemplateAttributeDirectiveType('ionNavTransition', {
    $postLink($scope, $element, $attr) {
        $element.bind('click', function() {
            // Note: ionnavtransition instead of ionNavTransition due
            //       to Node.attributes lowercasing.
            $ionicViewSwitcher.nextTransition($attr.ionnavtransition);
        });
    }
});

export { ionNavTransition };