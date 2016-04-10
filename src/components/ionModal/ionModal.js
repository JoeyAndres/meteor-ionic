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
 * **Notes:**
 * - A modal will broadcast 'modal.shown', 'modal.hidden', and 'modal.removed' events from its originating
 * scope, passing in itself as an event argument. Both the modal.removed and modal.hidden events are
 * called when the modal is removed.
 *
 * - This example assumes your modal is in your main index file or another template file. If it is in its own
 * template file, remove the script tags and call it by file name.
 *
 * @usage
 * ```html
 * <script id="my-modal.html" type="text/ng-template">
 *   <ion-modal-view>
 *     <ion-header-bar>
 *       <h1 class="title">My Modal title</h1>
 *     </ion-header-bar>
 *     <ion-content>
 *       Hello!
 *     </ion-content>
 *   </ion-modal-view>
 * </script>
 * ```
 * ```js
 * angular.module('testApp', ['ionic'])
 * .controller('MyController', function($scope, $ionicModal) {
 *   $ionicModal.fromTemplateUrl('my-modal.html', {
 *     scope: $scope,
 *     animation: 'slide-in-up'
 *   }).then(function(modal) {
 *     $scope.modal = modal;
 *   });
 *   $scope.openModal = function() {
 *     $scope.modal.show();
 *   };
 *   $scope.closeModal = function() {
 *     $scope.modal.hide();
 *   };
 *   //Cleanup the modal when we're done with it!
 *   $scope.$on('$destroy', function() {
 *     $scope.modal.remove();
 *   });
 *   // Execute action on hide modal
 *   $scope.$on('modal.hidden', function() {
 *     // Execute action
 *   });
 *   // Execute action on remove modal
 *   $scope.$on('modal.removed', function() {
 *     // Execute action
 *   });
 * });
 * ```
 */

IonModal = {
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

      var view = Blaze.renderWithData(this.template, data, $('.ionic-body').get(0));
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

$(document).delegate('.modal', IonModal.transitionEndEvent, function(e) {
  var $modal = $(e.currentTarget);
  if ($modal.hasClass(IonModal.enterClasses.join(' ')) || $modal.hasClass(IonModal.enterActiveClasse)) {
    $modal.removeClass(IonModal.enterClasses.join(' ')).removeClass(IonModal.enterActiveClass);
    $('body').addClass('modal-open');
  } else if ($modal.hasClass(IonModal.leaveClasses.join(' ')) || $modal.hasClass(IonModal.leaveActiveClasse)) {
    var firstChild = $modal.children().first();
    var templateName = getElementModalTemplateName(firstChild);
    IonModal.views = _.without(IonModal.views, templateName);
    var view = IonModal.view[templateName].pop();
    var $modalBackdrop = $(view.firstNode());
    $modalBackdrop.removeClass('active');
    $modal.removeClass(IonModal.leaveClasses.join(' ')).removeClass(IonModal.leaveActiveClass).off(IonModal.transitionEndEvent);
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
      IonModal.close();
    }
  });
};

Template.ionModal.destroyed = function () {
  if (!IonModal.views.length) {
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

    if (Platform.isAndroid()) {
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
      IonModal.close();
    }
  },
  'click [data-dismiss=modal]': function (event, template) {
    var tplName = getElementModalTemplateName(event.currentTarget);
    IonModal.close(tplName);
  }
});

var getElementModalTemplateName = function(element) {
  var modal = $(element).parents('.modal').get(0);
  var modalView = Blaze.getView(modal);
  var tplView = Meteor._get(modalView, 'parentView', 'parentView'); // Twice because the parent view is a #with block
  var tplName = tplView.name.slice('Template.'.length, tplView.name.length);
  return tplName;
};
