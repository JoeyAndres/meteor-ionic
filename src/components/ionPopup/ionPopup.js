/**
 * @ngdoc service
 * @name $ionicPopup
 * @module meteoric
 * @restrict E
 * @codepen zkmhJ
 * @description
 *
 * The Ionic Popup service allows programmatically creating and showing popup
 * windows that require the user to respond in order to continue.
 *
 * The popup system has support for more flexible versions of the built in `alert()`, `prompt()`,
 * and `confirm()` functions that users are used to, in addition to allowing popups with completely
 * custom content and look.
 *
 * An input can be given an `autofocus` attribute so it automatically receives focus when
 * the popup first shows. However, depending on certain use-cases this can cause issues with
 * the tap/click system, which is why Ionic prefers using the `autofocus` attribute as
 * an opt-in feature and not the default.
 *
 * @usage
 * A few basic examples, see below for details about all of the options available.
 *
 * ```js
 *angular.module('mySuperApp', ['ionic'])
 *.controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {
 *
 * // Triggered on a button click, or some other target
 * $scope.showPopup = function() {
 *   $scope.data = {};
 *
 *   // An elaborate, custom popup
 *   var myPopup = $ionicPopup.show({
 *     template: '<input type="password" ng-model="data.wifi">',
 *     title: 'Enter Wi-Fi Password',
 *     subTitle: 'Please use normal things',
 *     scope: $scope,
 *     buttons: [
 *       { text: 'Cancel' },
 *       {
 *         text: '<b>Save</b>',
 *         type: 'button-positive',
 *         onTap: function(e) {
 *           if (!$scope.data.wifi) {
 *             //don't allow the user to close unless he enters wifi password
 *             e.preventDefault();
 *           } else {
 *             return $scope.data.wifi;
 *           }
 *         }
 *       }
 *     ]
 *   });
 *
 *   myPopup.then(function(res) {
 *     console.log('Tapped!', res);
 *   });
 *
 *   $timeout(function() {
 *      myPopup.close(); //close the popup after 3 seconds for some reason
 *   }, 3000);
 *  };
 *
 *  // A confirm dialog
 *  $scope.showConfirm = function() {
 *    var confirmPopup = $ionicPopup.confirm({
 *      title: 'Consume Ice Cream',
 *      template: 'Are you sure you want to eat this ice cream?'
 *    });
 *
 *    confirmPopup.then(function(res) {
 *      if(res) {
 *        console.log('You are sure');
 *      } else {
 *        console.log('You are not sure');
 *      }
 *    });
 *  };
 *
 *  // An alert dialog
 *  $scope.showAlert = function() {
 *    var alertPopup = $ionicPopup.alert({
 *      title: 'Don\'t eat that!',
 *      template: 'It might taste good'
 *    });
 *
 *    alertPopup.then(function(res) {
 *      console.log('Thank you for not eating my delicious ice cream cone');
 *    });
 *  };
 *});
 *```
 */

IonPopup = {
  show: function (options) {
    this.template = Template.ionPopup;
    this.buttons = [];

    for (var i = 0; i < options.buttons.length; i++) {
      var button = options.buttons[i];
      this.buttons.push({
        text: button.text,
        type: button.type,
        index: i,
        onTap: button.onTap
      });
    }

    // Figure out if a template or just a html string was passed
    var innerTemplate = '';
    if (options.templateName) {
      innerTemplate = Template[options.templateName].renderFunction().value;
    } else if (options.template) {
      innerTemplate = '<span>' + options.template + '</span>';
    }

    var data = {
      title: options.title,
      subTitle: options.subTitle,
      buttons: this.buttons,
      template: innerTemplate
    };

    this.view = Blaze.renderWithData(this.template, data, $('.ionic-body').get(0));
    $('body').addClass('popup-open');

    var $backdrop = $(this.view.firstNode());
    $backdrop.addClass('visible active');
    var $popup = $backdrop.find('.popup-container');
    $popup.addClass('popup-showing active');
  },

  alert: function (options) {
    IonPopup.show({
      title: options.title,
      subTitle: options.subTitle,
      template: options.template,
      templateName: options.templateName,
      buttons: [
        {
          text: options.okText ? options.okText : 'Ok',
          type: options.okType ? options.okType : 'button-positive',
          onTap: function(event, template) {
            if (options.onOk) options.onOk(event, template);
            return true;
          }
        }
      ]
    });
  },

  confirm: function (options) {
    IonPopup.show({
      title: options.title,
      subTitle: options.subTitle,
      template: options.template,
      templateName: options.templateName,
      buttons: [
        {
          text: options.cancelText ? options.cancelText : 'Cancel',
          type: options.cancelType ? options.cancelType : 'button-default',
          onTap: function (event, template) {
            if (options.onCancel) options.onCancel(event, template);
            return true;
          }
        },
        {
          text: options.okText ? options.okText : 'Ok',
          type: options.okType ? options.okType : 'button-positive',
          onTap: function (event, template) {
            if (options.onOk) options.onOk(event, template);
            return true;
          }
        }
      ]
    });
  },

  prompt: function (options) {

    var template = '';
    if (options.templateName) {
      template = Template[options.templateName].renderFunction().value;
    } else if (options.template) {
      template = '<span class="popup-prompt-text">' + options.template + '</span>';
    }

    options.inputType = options.inputType || 'text';
    options.inputPlaceholder = options.inputPlaceholder || '';
    template += '<input type="' + options.inputType + '" placeholder="' +
      options.inputPlaceholder + '" name="prompt" >';

    IonPopup.show({
      title: options.title,
      subTitle: options.subTitle,
      template: template,
      buttons: [
        {
          text: options.cancelText ? options.cancelText : 'Cancel',
          type: options.cancelType ? options.cancelType : 'button-default',
          onTap: function (event, template) {
            if (options.onCancel) options.onCancel(event, template);
            return true;
          }
        },
        {
          text: options.okText ? options.okText : 'Ok',
          type: options.okType ? options.okType : 'button-positive',
          onTap: function (event, template) {
            var inputVal = $(template.firstNode).find('[name=prompt]').val();
            if (options.onOk) options.onOk(event, inputVal);
            return true;
          }
        }
      ]
    });
  },

  close: function () {
    var $popup = this._domrange ? $(this.view.firstNode()).find('.popup-container') : $('.popup-container');
    $popup.addClass('popup-hidden').removeClass('active');

    setTimeout(function () {
      $('body').removeClass('popup-open');
      $('.backdrop').remove();
      Blaze.remove(this.view);
    }.bind(this), 100);
  },

  buttonClicked: function (index, event, template) {
    var callback = this.buttons[index].onTap;
    if(callback){
      if (callback(event, template) === true) {
        IonPopup.close();
      }
    }
  }
};

Template.ionPopup.onRendered(function() {
  $(window).on('keyup.ionPopup', function(event) {
    if (event.which == KeyboardEvent.code["Escape"]) {
      IonPopup.close();
    }
  });
});

Template.ionPopup.onDestroyed(function() {
  $(window).off('keyup.ionPopup');
});

Template.ionPopup.events({
  // Handle clicking the backdrop
  'click': function (event, template) {
    if ($(event.target).hasClass('popup-container')) {
      IonPopup.close();
    }
  },

  'click [data-index]': function (event, template) {
    var index = $(event.target).data('index');
    IonPopup.buttonClicked(index, event, template);
  }

});

Template.ionPopup.helpers({
  hasHead: function() {
    return this.title || this.subTitle;
  }
});
