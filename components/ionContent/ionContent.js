let ionContentDefault = {
    direction: 'y',
    locking: true,
    padding: true,
    scroll: true,
    overflowScroll: false,
    scrollbarX: true,
    scrollbarY: true,
    startX: '0',
    startY: '0',
    onScroll: null,
    onScrollComplete: null,
    hasBouncing: true,
    scrollEventInterval: 10
};

Template.ionContent.onCreated(function() {
    this.direction = new ReactiveVar(ionContentDefault.direction);
    this.locking = new ReactiveVar(ionContentDefault.locking);
    this.padding = new ReactiveVar(ionContentDefault.padding);  // todo: make this platform dependent.
    this.scroll = new ReactiveVar(ionContentDefault.scroll);
    this.overflowScroll = new ReactiveVar(ionContentDefault.overflowScroll);  // todo: Make a Meteoric config for defaults.
    this.scrollbarX = new ReactiveVar(ionContentDefault.scrollbarX);
    this.scrollbarY = new ReactiveVar(ionContentDefault.scrollbarY);
    this.startX = new ReactiveVar(ionContentDefault.startX);
    this.startY = new ReactiveVar(ionContentDefault.startY);
    this.onScroll = new ReactiveVar(ionContentDefault.onScroll);
    this.onScrollComplete = new ReactiveVar(ionContentDefault.onScrollComplete);
    this.hasBouncing = new ReactiveVar(ionContentDefault.hasBouncing);  // tdo: Make platform dependent.
    this.scrollEventInterval = new ReactiveVar(ionContentDefault.scrollEventInterval);

    this.scrollCtrl = new meteoric.controller.ionicScroll();
    this.onScopeCreated = function() {
        this.scope.scrollCtrl = this.scrollCtrl;
    };

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;
        this.direction.set(td.direction || ionContentDefault.direction);
        this.locking.set(!_.isUndefined(td.locking) ? td.locking : ionContentDefault.locking);
        this.padding.set(!_.isUndefined(td.padding) ? td.padding : ionContentDefault.padding);
        this.scroll.set(!_.isUndefined(td.scroll) ? td.scroll : ionContentDefault.scroll);
        this.overflowScroll.set(!_.isUndefined(td.overflowScroll) ? td.overflowScroll : ionContentDefault.overflowScroll);
        this.scrollbarX.set(!_.isUndefined(td.scrollbarX) ? td.scrollbarX : ionContentDefault.scrollbarX);
        this.scrollbarY.set(!_.isUndefined(td.scrollbarY) ? td.scrollbarY : ionContentDefault.scrollbarY);
        this.startX.set(!!td.startX ? td.startX : ionContentDefault.startX);
        this.startY.set(!!td.startX ? td.startY : ionContentDefault.startY);
        this.onScroll.set(td.onScroll);
        this.onScrollComplete.set(td.onScrollComplete);
        this.hasBouncing.set(!_.isUndefined(td.hasBouncing) ? td.hasBouncing : ionContentDefault.hasBouncing);
        this.scrollEventInterval.set(!!td.scrollEventInterval ? td.scrollEventInterval : ionContentDefault.scrollEventInterval);
    });
});

Template.ionContent.onRendered(function() {
    let $element = this.$("ion-content");

    if (this.scroll.get() === "false") {
        //do nothing
    } else {
        var scrollViewOptions = {};

        // determined in compile phase above
        let nativeScrolling = this.overflowScroll.get();
        if (nativeScrolling) {
            // use native scrolling
            $element.addClass('overflow-scroll');

            scrollViewOptions = {
                el: $element[0],
                nativeScrolling: true
            };

            this.scrollCtrl.initialize(this.scope, scrollViewOptions);
        } else {
            // Use JS scrolling
            scrollViewOptions = {
                el: $element[0],
                locking: this.locking.get(),
                bouncing: this.hasBouncing.get(),
                scrollbarX: this.scrollbarX.get(),
                scrollbarY: this.scrollbarY.get(),
                scrollingX: this.direction.get().indexOf('x') !== -1,
                scrollingY: this.direction.get().indexOf('y') !== -1,
                scrollEventInterval: this.scrollEventInterval.get(),
                scrollingComplete: onScrollComplete
            };

            this.scrollCtrl.initialize(this.scope, scrollViewOptions);

            this.autorun(() => {
                if (!this.scrollCtrl) return;
                this.scrollCtrl.scrollView.options.locking = this.locking.get();
                this.scrollCtrl.scrollView.options.scrollbarX = this.scrollbarX.get();
                this.scrollCtrl.scrollView.options.scrollbarY = this.scrollbarY.get();
                this.scrollCtrl.scrollView.options.scrollingX = this.direction.get().indexOf('x') !== -1;
                this.scrollCtrl.scrollView.options.scrollingY = this.direction.get().indexOf('y') !== -1;
                this.scrollCtrl.scrollView.options.scrollEventInterval = this.scrollEventInterval.get();
                this.scrollCtrl.scrollView.options.bouncing = this.hasBouncing.get();
            });
        }

        this.scope.onScroll = _.isFunction(this.onScroll) ?
            meteoric.Utils.throttle(this.onScroll, this.scrollEventInterval.get()) :
            e => {};

        this.autorun(() => {
            this.scrollCtrl.scrollTo(parseInt(this.startX.get(), 10), parseInt(this.startY.get(), 10), true);
        });
    }

    let self = this;
    function onScrollComplete() {
        let _onScrollComplete = _.isFunction(self.onScrollComplete.get()) ? self.onScrollComplete.get() : () => {};
        _onScrollComplete({
            scrollTop: self.scrollCtrl.scrollView.__scrollTop,
            scrollLeft: self.scrollCtrl.scrollView.__scrollLeft
        });
    }
});

Template.ionContent.onDestroyed(function() {
    Object.setPrototypeOf(this.scope, null);
    $(this.scope).trigger('destroy');
});

Template.ionContent.helpers({
    hasHeader: function() { return meteoric.hasHeader.get(); },

    hasFooter: function() { return meteoric.hasFooter.get(); },

    classes: function () {
        var classes = ['content'];

        if (this.class) {
            classes.push(this.class);
        }

        if (this.scroll !== false) {
            //classes.push('overflow-scroll');
            classes.push('scroll');
        }

        if (Session.get('hasSubheader')) {
            classes.push('has-subheader');
        }

        if (Session.get('hasTabs')) {
            classes.push('has-tabs');
        }

        if (Session.get('hasTabsTop')) {
            classes.push('has-tabs-top');
        }

        if (Session.get('hasFooter')) {
            classes.push('has-footer');
        }

        if (Session.get('hasSubfooter')) {
            classes.push('has-subfooter');
        }

        return classes.join(' ');
    },

    scroll: function() { return Template.instance().scroll.get(); }
});