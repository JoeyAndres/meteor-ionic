import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let ionNavDirection = new TemplateAttributeDirectiveType('ionNavDirection', {
    $postLink($scope, $element, $attr) {
        $element.bind('click', function() {
            // Note: ionnavdirection instead of ionNavDirection due
            //       to Node.attributes lowercasing.
            $ionicViewSwitcher.nextDirection($attr.ionnavdirection);
        });
    }
});

export { ionNavDirection };