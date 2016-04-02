import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let ionMenuToggle = new TemplateAttributeDirectiveType('ionMenuToggle', {
    $postLink($scope, $element, $attr) {
        $scope.$on('$ionicView.beforeEnter', function(ev, viewData) {
            if (viewData.enableBack) {
                var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
                if (!sideMenuCtrl.enableMenuWithBackViews()) {
                    $element.addClass('hide');
                }
            } else {
                $element.removeClass('hide');
            }
        });

        $element.bind('click', function() {
            var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
            sideMenuCtrl && sideMenuCtrl.toggle($attr.ionMenuToggle);
        });
    }
});

export { ionMenuToggle };