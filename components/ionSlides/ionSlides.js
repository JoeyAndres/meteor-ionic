$ionSlidesController = function($scope, $element, meteor) {
    var _this = this;

    this.update = function() {
        $timeout(function() {
            if (!_this.__slider) {
                return;
            }

            _this.__slider.update();
            if (_this._options.loop) {
                _this.__slider.createLoop();
            }

            // Don't allow pager to show with > 10 slides
            if (_this.__slider.slides.length > 10) {
                $scope.showPager = false;
            }
        });
    };

    this.rapidUpdate = ionic.debounce(function() {
        _this.update();
    }, 50);

    this.getSlider = function() {
        return _this.__slider;
    };

    var options = $scope.options || {};

    var newOptions = _.extend({
        pagination: '.swiper-pagination',
        paginationClickable: true,
        lazyLoading: true,
        preloadImages: false
    }, options);

    this._options = newOptions;

    $timeout(function() {
        var slider = new ionic.views.Swiper($element.children()[0], newOptions, $scope, meteor);

        _this.__slider = slider;
        $scope.slider = _this.__slider;

        $scope.$on('$destroy', function() {
            slider.destroy();
        });
    });

};

Template.ionSlides.onCreated(function () {
    this.new_scope = true;

    this.showPager = new ReactiveVar(true);
    this.data = this.data || {};

    // todo: deal with "loop" option.
    this.options = isDefined(this.data.options) ? this.data.options : { };

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;

        this.showPager.set(!_.isUndefined(td.showPager) ? td.showPager : true);
    });
});

Template.ionSlides.onRendered(function () {
    let $scope = this.$scope;
    let $element = jqLite(this.firstNode);
    
    $scope.options = this.options;
    let ionSlidesCtrl = new $ionSlidesController($scope, $element, {
        views: this.children().map(t => t.view)  //todo: reactive
    });

    $(this).on('$postLink', () => {
        ionSlidesCtrl.rapidUpdate();
    });
});

Template.ionSlides.helpers({
    showPager: function() {
        return Template.instance().showPager.get();
    }
});