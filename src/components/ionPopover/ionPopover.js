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
 * Put the content of the popover inside of an `ionPopover` template.
 *
 * @usage
 *
 * In your popover template, you place the contents of your popover dialogue:
 *
 * ```handlebars
 <template name="_myPopover">
   {{#ionPopover}}
     <div class="content">
       <div class="list">
         <a class="item item-icon-right" href="http://www.meteor.com/" target="_blank">
           Meteor
           <i class="icon ionic-ios-arrow-right"></i>
         </a>
         <a class="item item-icon-right" href="http://ionicframework.com/" target="_blank">
           Ionic
           <i class="icon ionic-ios-arrow-right"></i>
         </a>
         <a class="item item-icon-right" href="http://meteoric.github.io/" target="_blank">
           Meteoric
           <i class="icon ionic-ios-arrow-right"></i>
         </a>
       </div>
     </div>
   {{/ionPopover}}
 </template>
 * ```
 *
 * In your button, `data-ion-popover` set it to `_myPopover`, the name of your `ionPopover`.
 *
 * ```handlebars
 <button class="button button-clear" data-ion-popover="_myPopover">
   Show Popover
 </button>
 * ```
 */

$ionicPopover = {
  show: function (templateName, data, button) {
    this.template = Template[templateName];
    this.view = Blaze.renderWithData(this.template, data, $('body').get(0));

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
      $ionicPopover.hide();
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
      $ionicPopover.hide();
    }
  }
});

// todo: Try to use the popover.
$('body').on('click', '[data-ion-popover]', function(e) {
  let popover_template = $(e.target).data('ion-popover');
  $ionicPopover.show(popover_template, $(e.target).data(), e.target);
});