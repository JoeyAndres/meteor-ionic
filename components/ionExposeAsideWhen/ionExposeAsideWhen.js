import { TemplateAttributeDirectiveType } from 'meteor/jandres:template-attribute-directive';

let ionExposeAsideWhen = new TemplateAttributeDirectiveType('ionExposeAsideWhen', {
    $postLink($scope, $element, $attr) {
        let sideMenuCtrl = $scope.$sideMenuCtrl;

        // Setup a match media query listener that triggers a ui change only when a change
        // in media matching status occurs
        var mq = $attr.ionexposeasidewhen == 'large' ? '(min-width:768px)' : $attr.ionexposeasidewhen;
        var mql = $window[0].matchMedia(mq);
        mql.addListener(function() {
            onResize();
        });

        function checkAsideExpose() {
            var mq = $attr.ionexposeasidewhen == 'large' ? '(min-width:768px)' : $attr.ionexposeasidewhen;
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

export { ionExposeAsideWhen };