headerFooterBarDirective = function(isHeader) {
    let $scope = this.$scope;
    let $element, tElement;
    $element = tElement = jqLite(this.firstNode);

    tElement.addClass(isHeader ? 'bar bar-header' : 'bar bar-footer');
    // top style tabs? if so, remove bottom border for seamless display
    $timeout(function () {
        if (isHeader && $document[0].getElementsByClassName('tabs-top').length) tElement.addClass('has-tabs-top');
    });

    let $attrs = {
        alignTitle: this.alignTitle
    };

    $(this).on('$preLink', () => {
        let ctrl = new $ionicHeaderBar($scope, $element, $attrs);
        $element.data('$ionHeaderBarController', ctrl);
        if (isHeader) {
            this.autorun(() => {
                let value = this.class.get();
                var isShown = !this.hide.get();
                var isSubheader = value.indexOf('bar-subheader') !== -1;
                meteoric.lib.reactiveGetOrSetDefaultScope($scope.$parent, '$hasHeader', isShown && !isSubheader);
                meteoric.lib.reactiveGetOrSetDefaultScope($scope.$parent, '$hasSubheader', isShown && isSubheader);
                $scope.$emit('$ionicSubheader', $scope.$hasSubheader.get());
            });
            $scope.$on('$destroy', function () {
                delete $scope.$hasHeader;
                delete $scope.$hasSubheader;
            });
            ctrl.align();
            $scope.$on('$ionicHeader.align', function () {
                ionic.requestAnimationFrame(function () {
                    ctrl.align();
                });
            });

        } else {
            this.autorun(() => {
                let value = this.class.get();
                var isShown = !this.hide.get();
                var isSubfooter = value.indexOf('bar-subfooter') !== -1;
                meteoric.lib.reactiveGetOrSetDefaultScope($scope.$parent, '$hasFooter', isShown && !isSubfooter);
                meteoric.lib.reactiveGetOrSetDefaultScope($scope.$parent, '$hasSubheader', isShown && isSubfooter);
            });
            $scope.$on('$destroy', function () {
                delete $scope.$hasFooter;
                delete $scope.$hasSubfooter;
            });
            this.autorun(() => {
                let val = $scope.$hasTabs && $scope.$hasTabs.get();
                $element.toggleClass('has-tabs', !!val);
            });
            ctrl.align();
            $scope.$on('$ionicFooter.align', function () {
                ionic.requestAnimationFrame(function () {
                    ctrl.align();
                });
            });
        }
    });
}