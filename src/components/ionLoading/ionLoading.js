/**
 * @ngdoc service
 * @name $ionicLoading
 * @module meteoric
 * @demo /loading
 * @description
 * An overlay that can be used to indicate activity while blocking user
 * interaction.

 * @usage
 *
 * In your templates:
 *
 * ```html
   {{#ionView title="Loading"}}
     {{#ionContent}}
       <div class="padding">
         <button class="button button-large button-stable button-block" data-action="showLoading">
           Show Loading (3s)
         </button>

         <button class="button button-large button-stable button-block" data-action="showLoadingWithBackdrop">
           Show Loading With Backdrop (3s)
         </button>

         <button class="button button-large button-stable button-block" data-action="showLoadingCustomTemplate">
           Show Loading With Template (3s)
         </button>
       </div>
     {{/ionContent}}
   {{/ionView}}
 * ```
 *
 * In your javascript file:
 *
 * ```javascript
 Template.loading.events({
  'click [data-action=showLoading]': function (event, template) {
    $ionicLoading.show({
      duration: 3000
    });
  },

  'click [data-action=showLoadingWithBackdrop]': function (event, template) {
    $ionicLoading.show({
      duration: 3000,
      backdrop: true
    });
  },

  'click [data-action=showLoadingCustomTemplate]': function (event, template) {
    $ionicLoading.show({
      customTemplate: '<h3>Loading…</h3><p>Please wait while we upload your image.</p>',
      duration: 3000
    });
  }
});
 * ```
 */

/**
 * @ngdoc object
 * @name $ionicLoadingConfig
 * @module meteoric
 * @description
 * Set the default options to be passed to the {@link meteoric.service:$ionicLoading} service.
 *
 * (Work in progress)
 */

$ionicLoading = {
  show: function (userOptions) {
    var userOptions = userOptions || {};
    var options = _.extend({
      delay: 0,
      duration: null,
      customTemplate: null,
      backdrop: false
    }, userOptions);

    if (options.backdrop) {
      $ionicBackdrop.retain();
      $('.backdrop').addClass('backdrop-loading');
    }

    Meteor.setTimeout(function () {
      this.template = Template['ionLoading'];
      this.view = Blaze.renderWithData(this.template, {template: options.customTemplate}, $('body').get(0));

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
        $ionicBackdrop.release();
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
