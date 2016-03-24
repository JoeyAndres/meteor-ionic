headerFooterBarDirective = function(isHeader) {
    let $scope = this.$scope;
    let parentScope = $scope.$parent;
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

    /**
     * Note: parentScope.$hasHeader was not in the original. Apparently:
     *
     * > The application can have multiple scopes, because some directives
     * > create new child scopes (refer to directive documentation to see which directives create new scopes).
     * > When new scopes are created, they are added as children of their parent scope. This creates a tree
     * > structure which parallels the DOM where they're attached.
     */
    $(this).on('$preLink', () => {
        let ctrl = new $ionicHeaderBar($scope, $element, $attrs);
        if (isHeader) {
            this.autorun(() => {
                let value = this.class.get();
                var isShown = !this.hide.get();
                var isSubheader = value.indexOf('bar-subheader') !== -1;
                parentScope.$hasHeader ? parentScope.$hasHeader.set(isShown && !isSubheader) : parentScope.$hasHeader = new ReactiveVar(isShown && !isSubheader);
                parentScope.$hasSubheader ? parentScope.$hasSubheader.set(isShown && isSubheader) : parentScope.$hasSubheader = new ReactiveVar(isShown && isSubheader);
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
                parentScope.$hasFooter ? parentScope.$hasFooter.set(isShown && !isSubfooter) : parentScope.$hasFooter = new ReactiveVar(isShown && !isSubfooter);
                parentScope.$hasSubfooter ? parentScope.$hasSubheader.set(isShown && isSubfooter) : parentScope.$hasSubfooter = new ReactiveVar(isShown && isSubfooter);
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