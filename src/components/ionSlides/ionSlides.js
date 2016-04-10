
/**
 * @ngdoc directive
 * @name ionSlides
 * @module meteoric
 * @delegate ionic.service:$ionicSlideBoxDelegate
 * @restrict E
 * @description
 * The Slides component is a powerful multi-page container where each page can be swiped or dragged between.
 *
 * Note: this is a new version of the Ionic Slide Box based on the [Swiper](http://www.idangero.us/swiper/#.Vmc1J-ODFBc) widget from
 * [idangerous](http://www.idangero.us/).
 *
 * ![SlideBox](http://ionicframework.com.s3.amazonaws.com/docs/controllers/slideBox.gif)
 *
 * @usage
 * ```html
 * <ion-slides on-slide-changed="slideHasChanged($index)">
 *   <ion-slide-page>
 *     <div class="box blue"><h1>BLUE</h1></div>
 *   </ion-slide-page>
 *   <ion-slide-page>
 *     <div class="box yellow"><h1>YELLOW</h1></div>
 *   </ion-slide-page>
 *   <ion-slide-page>
 *     <div class="box pink"><h1>PINK</h1></div>
 *   </ion-slide-page>
 * </ion-slides>
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify this slideBox
 * with {@link meteoric.service:$ionicSlideBoxDelegate}.
 * @param {object=} options to pass to the widget. See the full ist here: [http://www.idangero.us/swiper/api/](http://www.idangero.us/swiper/api/)
 */

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