export let headerFooterBarDirective = function(isHeader) {
    let $scope = this.$scope;
    let $element, tElement;
    $element = tElement = jqLite(this.firstNode);

    tElement.addClass(isHeader ? 'bar bar-header' : 'bar bar-footer');
    // top style tabs? if so, remove bottom border for seamless display
    $timeout(function () {
        if (isHeader && $document[0].getElementsByClassName('tabs-top').length) tElement.addClass('has-tabs-top');
    });

    let $attrs = {
        alignTitle: this.alignTitle,
        noTapScroll: this.noTapScroll
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

                meteoric.lib.reactiveSetScope($scope, '$hasHeader', $hasHeader);
                meteoric.lib.reactiveSetScope($scope, '$hasSubheader', $hasSubheader);
                $scope.$emit('$ionicSubheader', $hasSubheader);
            });
            $scope.$on('$destroy', function () {
                $scope.$hasHeader.set(false);
                $scope.$hasSubheader.set(false);
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
                meteoric.lib.reactiveSetScope($scope, '$hasFooter', $hasFooter);
                meteoric.lib.reactiveSetScope($scope, '$hasSubfooter', $hasSubfooter);
            });
            $scope.$on('$destroy', function () {
                $scope.$hasFooter.set(false);
                $scope.$hasSubfooter.set(false);
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

    $(this).on('$postLink', () => {
        if ($attrs.noTapScroll == 'true') {
            return;
        }
        ionic.on('tap', onTap, $element[0]);
        $scope.$on('$destroy', function() {
            ionic.off('tap', onTap, $element[0]);
        });

        function onTap(e) {
            var depth = 3;
            var current = e.target;
            //Don't scroll to top in certain cases
            while (depth-- && current) {
                if (current.classList.contains('button') ||
                    current.tagName.match(/input|textarea|select/i) ||
                    current.isContentEditable) {
                    return;
                }
                current = current.parentNode;
            }
            var touch = e.gesture && e.gesture.touches[0] || e.detail.touches[0];
            var bounds = $element[0].getBoundingClientRect();
            if (ionic.DomUtil.rectContains(
                    touch.pageX, touch.pageY,
                    bounds.left, bounds.top - 20,
                    bounds.left + bounds.width, bounds.top + bounds.height
                )) {
                $ionicScrollDelegate.scrollTop(true);
            }
        }
    });
};