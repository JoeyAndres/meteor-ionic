import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let ionMenuToggle = new TemplateAttributeDirectiveType('ionMenuToggle', {
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
            sideMenuCtrl && sideMenuCtrl.toggle(self.$attrs().ionMenuToggle);
        };

        $('body').on('click', this.$elementSelector(), clickHandler);
        $scope.$on('$destroy', function() { $('body').off('click', self.$elementSelector(), clickHandler); });
    }
});

export { ionMenuToggle };