import {Template} from 'meteor/templating';

Template.ionInfiniteScroll.onCreated(function() {
    this.new_scope = true;

    this.$attrs = {};
    this.$attrs.onInfinite = noop;
    this.$attrs.distance = "1%";
    this.$attrs.immediateCheck = true;

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;  // Don't do a thing if data context don't exist.
        this.$attrs.onInfinite = isDefined(td.onInfinite) ? td.onInfinite : noop;
        this.$attrs.distance = td.distance;
        this.$attrs.immediateCheck = !!td.immediateCheck;
    });
});

Template.ionInfiniteScroll.onRendered(function() {
    // meteoric:
    let parentTemplate = this.parent(1, true);
    let ionScrollTemplate = parentTemplate.children().filter(t => t.view.name = 'Template.ionScroll')[0];
    let ionScrollTemplate$scope = ionScrollTemplate.$scope;

    let $scope = this.$scope,
        $attrs = this.$attrs,
        $element = jqLite(this.firstNode);
    
    $(this).on('$postLink', () => {
        var infiniteScrollCtrl = new $ionInfiniteScroll($scope, $attrs, $element);
        var scrollCtrl = infiniteScrollCtrl.scrollCtrl = ionScrollTemplate$scope.scrollCtrl;
        var jsScrolling = infiniteScrollCtrl.jsScrolling = !scrollCtrl.isNative();

        // if this view is not beneath a scrollCtrl, it can't be injected, proceed w/ native scrolling
        if (jsScrolling) {
            infiniteScrollCtrl.scrollView = scrollCtrl.scrollView;
            $scope.scrollingType = 'js-scrolling';
            //bind to JS scroll events
            scrollCtrl.$element.on('scroll', infiniteScrollCtrl.checkBounds);
        } else {
            // grabbing the scrollable element, to determine dimensions, and current scroll pos
            var scrollEl = ionic.DomUtil.getParentOrSelfWithClass($element[0].parentNode, 'overflow-scroll');
            infiniteScrollCtrl.scrollEl = scrollEl;
            // if there's no scroll controller, and no overflow scroll div, infinite scroll wont work
            if (!scrollEl) {
                throw 'Infinite scroll must be used inside a scrollable div';
            }
            //bind to native scroll events
            infiniteScrollCtrl.scrollEl.addEventListener('scroll', infiniteScrollCtrl.checkBounds);
        }

        // Optionally check bounds on start after scrollView is fully rendered
        var doImmediateCheck = isDefined($attrs.immediateCheck) ? $attrs.immediateCheck : true;
        if (doImmediateCheck) {
            $timeout(function() { infiniteScrollCtrl.checkBounds(); });
        }
    });
});