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
                let $hasHeader = isShown && !isSubheader;
                let $hasSubheader = isShown && isSubheader;
                meteoric.lib.reactiveSetScope($scope.$parent, '$hasHeader', $hasHeader);
                meteoric.lib.reactiveSetScope($scope.$parent, '$hasSubheader', $hasSubheader);
                $scope.$emit('$ionicSubheader', $hasSubheader);
            });
            $scope.$on('$destroy', function () {
                $scope.$parent.$hasHeader.set(false);
                $scope.$parent.$hasSubheader.set(false);
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
                let $hasFooter = isShown && !isSubfooter;
                let $hasSubfooter = isShown && isSubfooter;
                meteoric.lib.reactiveSetScope($scope.$parent, '$hasFooter', $hasFooter);
                meteoric.lib.reactiveSetScope($scope.$parent, '$hasSubfooter', $hasSubfooter);
            });
            $scope.$on('$destroy', function () {
                $scope.$parent.$hasFooter.set(false);
                $scope.$parent.$hasSubfooter.set(false);
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