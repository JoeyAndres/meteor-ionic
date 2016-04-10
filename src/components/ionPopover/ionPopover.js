POPOVER_BODY_PADDING = 6;

/**
 * @ngdoc service
 * @name $ionicPopover
 * @module meteoric
 * @description
 *
 * Related: {@link meteoric.controller:ionicPopover ionicPopover controller}.
 *
 * The Popover is a view that floats above an app’s content. Popovers provide an
 * easy way to present or gather information from the user and are
 * commonly used in the following situations:
 *
 * - Show more info about the current view
 * - Select a commonly used tool or configuration
 * - Present a list of actions to perform inside one of your views
 *
 * Put the content of the popover inside of an `<ion-popover-view>` element.
 *
 * @usage
 * ```html
 * <p>
 *   <button ng-click="openPopover($event)">Open Popover</button>
 * </p>
 *
 * <script id="my-popover.html" type="text/ng-template">
 *   <ion-popover-view>
 *     <ion-header-bar>
 *       <h1 class="title">My Popover Title</h1>
 *     </ion-header-bar>
 *     <ion-content>
 *       Hello!
 *     </ion-content>
 *   </ion-popover-view>
 * </script>
 * ```
 * ```js
 * angular.module('testApp', ['ionic'])
 * .controller('MyController', function($scope, $ionicPopover) {
 *
 *   // .fromTemplate() method
 *   var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';
 *
 *   $scope.popover = $ionicPopover.fromTemplate(template, {
 *     scope: $scope
 *   });
 *
 *   // .fromTemplateUrl() method
 *   $ionicPopover.fromTemplateUrl('my-popover.html', {
 *     scope: $scope
 *   }).then(function(popover) {
 *     $scope.popover = popover;
 *   });
 *
 *
 *   $scope.openPopover = function($event) {
 *     $scope.popover.show($event);
 *   };
 *   $scope.closePopover = function() {
 *     $scope.popover.hide();
 *   };
 *   //Cleanup the popover when we're done with it!
 *   $scope.$on('$destroy', function() {
 *     $scope.popover.remove();
 *   });
 *   // Execute action on hide popover
 *   $scope.$on('popover.hidden', function() {
 *     // Execute action
 *   });
 *   // Execute action on remove popover
 *   $scope.$on('popover.removed', function() {
 *     // Execute action
 *   });
 * });
 * ```
 */

IonPopover = {
  show: function (templateName, data, button) {
    this.template = Template[templateName];
    this.view = Blaze.renderWithData(this.template, data, $('.ionic-body').get(0));

    var $backdrop = $(this.view.firstNode());
    var $popover = $backdrop.find('.popover');
    var $button = $(button);
    var $arrow = $backdrop.find('.popover-arrow');

    var bodyWidth = $('body').width();
    var bodyHeight = $(window).innerHeight();
    var buttonPosition = $button.offset();
    var buttonWidth = $button.outerWidth();
    var buttonHeight = $button.outerHeight();
    var popoverWidth = $popover.outerWidth();
    var popoverHeight = $popover.outerHeight();

    var popoverCSS = {
      marginLeft: '0',
      opacity: 1,
      left: buttonPosition.left + buttonWidth / 2 - popoverWidth / 2
    };

    if (popoverCSS.left < POPOVER_BODY_PADDING) {
      popoverCSS.left = POPOVER_BODY_PADDING;
    } else if(popoverCSS.left + popoverWidth + POPOVER_BODY_PADDING > bodyWidth) {
      popoverCSS.left = bodyWidth - popoverWidth - POPOVER_BODY_PADDING;
    }

    if (buttonPosition.top + buttonHeight + popoverHeight > bodyHeight) {
      popoverCSS.top = buttonPosition.top - popoverHeight;
      $popover.addClass('popover-bottom');
    } else {
      popoverCSS.top = buttonPosition.top + buttonHeight;
      $popover.removeClass('popover-bottom');
    }

    $backdrop.addClass('active');
    $arrow.css({
      left: buttonPosition.left + buttonWidth / 2 - $arrow.outerWidth() / 2 - popoverCSS.left + 'px'
    });
    $popover.css(popoverCSS);
  },

  hide: function () {
    if (typeof this.view !== 'undefined') {
      var $backdrop = $(this.view.firstNode());
      $backdrop.removeClass('active');
  
      var $popover = $backdrop.find('.popover');
      $popover.css({opacity: 0});
  
      Blaze.remove(this.view);
    }
  }
};

Template.ionPopover.rendered = function () {
  $(window).on('keyup.ionPopover', function(event) {
    if (event.which == 27) {
      IonPopover.hide();
    }
  });
};

Template.ionPopover.destroyed = function () {
  $(window).off('keyup.ionPopover');
};

Template.ionPopover.events({
  // Handle clicking the backdrop
  'click': function (event, template) {
    if ($(event.target).hasClass('popover-backdrop')) {
      IonPopover.hide();
    }
  }
});
