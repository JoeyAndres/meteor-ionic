/**
 * @ngdoc directive
 * @name ionInfiniteScroll
 * @module meteoric
 * @parent meteoric.directive:ionContent, meteoric.directive:ionScroll
 * @demo /lists/ionInfiniteScroll
 * @restrict E
 *
 * @description
 * The ionInfiniteScroll directive allows you to call a function whenever
 * the user gets to the bottom of the page or near the bottom of the page.
 *
 * The expression you pass in for `on-infinite` is called when the user scrolls
 * greater than `distance` away from the bottom of the content.  Once `on-infinite`
 * is done loading new data, it should broadcast the `scroll.infiniteScrollComplete`
 * event from your controller (see below example).
 *
 * @param {function} on-infinite What to call when the scroller reaches the
 * bottom.
 * @param {string=} distance The distance from the bottom that the scroll must
 * reach to trigger the on-infinite expression. Default: 1%.
 * @param {string=} spinner The {@link meteoric.directive:ionSpinner} to show while loading. The SVG
 * {@link meteoric.directive:ionSpinner} is now the default, replacing rotating font icons.
 * @param {string=} icon The icon to show while loading. Default: 'ion-load-d'.  This is depreicated
 * in favor of the SVG {@link meteoric.directive:ionSpinner}.
 * @param {boolean=} immediate-check Whether to check the infinite scroll bounds immediately on load.
 *
 * @usage
 *
 * In your template:
 *
 * ```handlebars
 {{#ionList}}
     {{#each items}}
         {{#ionItem class="item-avatar-left"}}
             <img src="https://randomuser.me/api/portraits/thumb/men/27.jpg">
             <h2>John Smith {{this}}</h2>
             <p>(555) 555-1212</p>
         {{/ionItem}}
     {{/each}}
 {{/ionList}}
 {{> ionInfiniteScroll onInfinite=onInfinite distance="10%" spinner="android" immediateCheck=true enable=hasMore}}
 * ```
 *
 * In you javascript:
 *
 * ```js
 // ...
 Template.demoListsionInfiniteScroll.helpers({
    onInfinite: function() {
        let templateInstance = Template.instance();
        return () => {
            // Stuff to do, e.g. add/load more items.

            // Trigger the following event when done.
            $(window).trigger('scroll.infiniteScrollComplete');
        };
    }
 });
 * ```
 */

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