/**
 * @ngdoc service
 * @name $ionicModal
 * @module meteoric
 * @description
 *
 * Related: {@link meteoric.controller:ionicModal ionicModal controller}.
 *
 * The Modal is a content pane that can go over the user's main view
 * temporarily.  Usually used for making a choice or editing an item.
 *
 * Put the content of the modal inside of an `<ion-modal-view>` element.
 *
 * @usage
 *
 * In your modal template, you place the contents of your modal dialogue:
 *
 * ```handlebars
 <template name="_myModal">
   {{#ionModal title="My Modal"}}
     <div class="padding">
       Modal Content Goes Here
     </div>
   {{/ionModal}}
 </template>
 * ```
 *
 * In your button, `data-ion-modal` set it to `_myModal`, the name of your `ionModal`.
 *
 * ```handlebars
   {{#ionContent}}
     <div class="padding">
       <button class="button button-large button-stable" data-ion-modal="_myModal">Open Modal</button>
     </div>
   {{/ionContent}}
 * ```
 */

$ionModal = {
  transitionEndEvent: 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
  animationEndEvent: 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd',
  enterClasses: ['ng-enter', 'slide-in-up'],
  enterActiveClass: 'ng-enter-active',
  leaveClasses: ['ng-leave', 'slide-in-up'],
  leaveActiveClass: 'ng-leave-active',
  view: {},
  views: [],
  open: function (templateName, data) {

    Meteor.setTimeout(function () {

      this.template = Template[templateName];
      this.views.push(templateName);
      if (!this.view[templateName]) this.view[templateName] = [];

      var view = Blaze.renderWithData(this.template, data, $('body').get(0));
      this.view[templateName].push(view);

      var $modalBackdrop = $(view.firstNode());
      var $modal = $('.modal', $modalBackdrop);

      if (this.views.length === 1) {
        $modalBackdrop.addClass('active');
      }

      $modal.addClass(this.enterClasses.join(' '));
      Meteor.setTimeout(function () {
        $modal.addClass(this.enterActiveClass);
      }.bind(this), 50);

    }.bind(this), 0);

  },
  close: function (templateName) {

    this.templateClosed = templateName;
    Meteor.setTimeout(function () {

      var templateName = this.templateClosed || this.views.slice(-1)[0];
      delete this.templateClosed;

      var view = (this.view[templateName] || []).slice(-1)[0];
      if (!view) return;

      var $modalBackdrop = $(view.firstNode());
      var $modal = $('.modal', $modalBackdrop);

      $modal.addClass(this.leaveClasses.join(' '));
      Meteor.setTimeout(function () {
        $modal.addClass(this.leaveActiveClass);
      }.bind(this), 50);

      $modalBackdrop.fadeOut(500, function() {
        $('body').removeClass('modal-open');
      });

    }.bind(this), 0);

  }
};

$(document).delegate('.modal', $ionModal.transitionEndEvent, function(e) {
  var $modal = $(e.currentTarget);
  if ($modal.hasClass($ionModal.enterClasses.join(' ')) || $modal.hasClass($ionModal.enterActiveClasse)) {
    $modal.removeClass($ionModal.enterClasses.join(' ')).removeClass($ionModal.enterActiveClass);
    $('body').addClass('modal-open');
  } else if ($modal.hasClass($ionModal.leaveClasses.join(' ')) || $modal.hasClass($ionModal.leaveActiveClasse)) {
    var firstChild = $modal.children().first();
    var templateName = getElementModalTemplateName(firstChild);
    $ionModal.views = _.without($ionModal.views, templateName);
    var view = $ionModal.view[templateName].pop();
    var $modalBackdrop = $(view.firstNode());
    $modalBackdrop.removeClass('active');
    $modal.removeClass($ionModal.leaveClasses.join(' ')).removeClass($ionModal.leaveActiveClass).off($ionModal.transitionEndEvent);
    $('body').removeClass('modal-open');
    $(e.target).parents('.modal-backdrop').remove();
    Blaze.remove(view);
  }
});

Template.ionModal.created = function () {
  this.data = this.data || {};
  this.customTemplate = this.data.customTemplate || false;
  this.title = this.data.title;
  this.title = this.data.closeText;
  this.focusFirstInput = _.isUndefined(this.data.focusFirstInput) ? true : this.data.focusFirstInput;
  this.animation = this.data.animation || 'slide-in-up';
};

Template.ionModal.rendered = function () {
  if (this.focusFirstInput) {
    Meteor.setTimeout(function () {
      if (!this._domrange) return;
      this.$('input:first').focus();
    }.bind(this), 600);
  }
  $(window).on('keyup.ionModal', function(event) {
    event.stopImmediatePropagation();
    if (event.which == 27) {
      $ionModal.close();
    }
  });
};

Template.ionModal.destroyed = function () {
  if (!$ionModal.views.length) {
    $(window).off('keyup.ionModal');
  }
};

Template.ionModal.helpers({
  barClass: function () {
    var defaultClasses = ['bar', 'bar-header', 'bar-stable'].join(' ');
    var customClasses = _.isString(this.barClass) ? this.barClass : '';
    return [defaultClasses, customClasses].join(' ');
  },

  titleClass: function () {
    var classes = ['title'];

    if (ionic.Platform.isAndroid()) {
      classes.push('title-left');
    }

    return classes.join(' ');
  },

  title: function () {
    return this.title;
  },

  closeText: function () {
    return this.closeText;
  },

  animation: function () {
    return this.animation || 'slide-in-up';
  },

  customTemplate: function () {
    return this.customTemplate;
  },

  classes: function () {
    var classes = ['modal'];

    if (this.class) {
      classes.push(this.class);
    }

    return classes.join(' ');
  }

});

Template.ionModal.events({
  // Handle clicking the backdrop
  'click': function (event, template) {
    if ($(event.target).hasClass('modal-backdrop')) {
      $ionModal.close();
    }
  },
  'click [data-dismiss=modal]': function (event, template) {
    var tplName = getElementModalTemplateName(event.currentTarget);
    $ionModal.close(tplName);
  }
});

var getElementModalTemplateName = function(element) {
  var modal = $(element).parents('.modal').get(0);
  var modalView = Blaze.getView(modal);
  var tplView = Meteor._get(modalView, 'parentView', 'parentView'); // Twice because the parent view is a #with block
  var tplName = tplView.name.slice('Template.'.length, tplView.name.length);
  return tplName;
};

// todo: Try to use the attribute-directive library.
$('body').on('click', '[data-ion-modal]', function(e) {
  let modal_template = $(e.target).data('ion-modal');
  $ionModal.open(modal_template, $(e.target).data());
});