import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let ionMenuClose = new TemplateAttributeDirectiveType('ionMenuClose', {
    $postLink($scope, $element, $attr) {
        let self = this;

        let clickHandler = function() { 
            $element = jqLite(this);
            var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
            if (sideMenuCtrl) {
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: true,
                    expire: 300
                });
                // if no transition in 300ms, reset nextViewOptions
                // the expire should take care of it, but will be cancelled in some
                // cases. This directive is an exception to the rules of history.js
                $timeout(function () {
                    $ionicHistory.nextViewOptions({
                        historyRoot: false,
                        disableAnimate: false
                    });
                }, 300);
                sideMenuCtrl.close();
            }
        };

        $('body').on('click', this.$elementSelector(), clickHandler);
        $scope.$on('$destroy', function() { $('body').off('click', self.$elementSelector(), clickHandler); });
    }
});

export { ionMenuClose };