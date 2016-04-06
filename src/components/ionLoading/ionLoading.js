/**
 * @ngdoc service
 * @name $ionicLoading
 * @module meteoric
 * @description
 * An overlay that can be used to indicate activity while blocking user
 * interaction.
 *
 * @usage
 * ```js
 * angular.module('LoadingApp', ['ionic'])
 * .controller('LoadingCtrl', function($scope, $ionicLoading) {
 *   $scope.show = function() {
 *     $ionicLoading.show({
 *       template: 'Loading...'
 *     });
 *   };
 *   $scope.hide = function(){
 *     $ionicLoading.hide();
 *   };
 * });
 * ```
 */
/**
 * @ngdoc object
 * @name $ionicLoadingConfig
 * @module meteoric
 * @description
 * Set the default options to be passed to the {@link ionic.service:$ionicLoading} service.
 *
 * @usage
 * ```js
 * var app = angular.module('myApp', ['ionic'])
 * app.constant('$ionicLoadingConfig', {
 *   template: 'Default Loading Template...'
 * });
 * app.controller('AppCtrl', function($scope, $ionicLoading) {
 *   $scope.showLoading = function() {
 *     $ionicLoading.show(); //options default to values in $ionicLoadingConfig
 *   };
 * });
 * ```
 */
IonLoading = {
  show: function (userOptions) {
    var userOptions = userOptions || {};
    var options = _.extend({
      delay: 0,
      duration: null,
      customTemplate: null,
      backdrop: false
    }, userOptions);

    if (options.backdrop) {
      IonBackdrop.retain();
      $('.backdrop').addClass('backdrop-loading');
    }

    Meteor.setTimeout(function () {
      this.template = Template['ionLoading'];
      this.view = Blaze.renderWithData(this.template, {template: options.customTemplate}, $('.ionic-body').get(0));

      var $loadingEl = $(this.view.firstNode());
      $loadingEl.addClass('visible');

      Meteor.setTimeout(function () {
        $loadingEl.addClass('active');
      }, 10);
    }.bind(this), options.delay);

    if (options.duration) {
      Meteor.setTimeout(function () {
        this.hide();
      }.bind(this), options.duration);
    }
  },

  hide: function () {
    if (this.view) {
      var $loadingEl = $(this.view.firstNode());
      $loadingEl.removeClass('active');

      Meteor.setTimeout(function () {
        IonBackdrop.release();
        $loadingEl.removeClass('visible');
        Blaze.remove(this.view);
        this.view = null;
      }.bind(this), 0);
    }
    Meteor.setTimeout(function() {
      $('.loading-container').remove();
    }, 0)
  }
};
