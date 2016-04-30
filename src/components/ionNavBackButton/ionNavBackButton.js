/**
 * @ngdoc directive
 * @name  ionNavBackButton
 * @module meteoric
 * @restrict E
 * @parent ionNavBar
 * @description
 * Creates a back button inside an {@link meteoric.directive:ionNavBar}.
 *
 * The back button will appear when the user is able to go back in the current navigation stack. By
 * default, the markup of the back button is automatically built using platform-appropriate defaults
 * (iOS back button icon on iOS and Android icon on Android).
 *
 * Additionally, the button is automatically set to `$ionicGoBack()` on click/tap. By default, the
 * app will navigate back one view when the back button is clicked.  More advanced behavior is also
 * possible, as outlined below.
 *
 * @usage
 *
 * For an example, see: {@link meteoric.directive:ionNavBar}.
 */

Template.ionNavBackButton.onCreated(function () {
  this.data = this.data || {};
  this.onClick = _.isFunction(this.data.onClick) ?
      this.data.onClick :
      function () { $rootScope.$ionicGoBack(); };
});

Template.ionNavBackButton.onRendered(function () {
  let tElement = jqLite(this.firstNode);
  let $attr = {
  };
  let tAttrs = {
    onClick: this.onClick,
    $attr
  };
  
  // clone the back button, but as a <div>
  var buttonEle = $document[0].createElement('button');
  for (var n in tAttrs.$attr) {
    buttonEle.setAttribute(tAttrs.$attr[n], tAttrs[n]);
  }

  // Setup click listener in ion-nav-bar.
  $('ion-nav-bar').on(
      'click',
      '.back-button',
      _.isFunction(tAttrs.onClick) ? tAttrs.onClick : noop);

  buttonEle.className = 'button back-button hide buttons ' + (tElement.attr('class') || '');
  buttonEle.innerHTML = tElement.html() || '';

  var childNode;
  var hasIcon = hasIconClass(tElement[0]);
  var hasInnerText;
  var hasButtonText;
  var hasPreviousTitle;

  for (var x = 0; x < tElement[0].childNodes.length; x++) {
    childNode = tElement[0].childNodes[x];
    if (childNode.nodeType === 1) {
      if (hasIconClass(childNode)) {
        hasIcon = true;
      } else if (childNode.classList.contains('default-title')) {
        hasButtonText = true;
      } else if (childNode.classList.contains('previous-title')) {
        hasPreviousTitle = true;
      }
    } else if (!hasInnerText && childNode.nodeType === 3) {
      hasInnerText = !!childNode.nodeValue.trim();
    }
  }

  function hasIconClass(ele) {
    return /ion-|icon/.test(ele.className);
  }

  var defaultIcon = $ionicConfig.backButton.icon();
  if (!hasIcon && defaultIcon && defaultIcon !== 'none') {
    buttonEle.innerHTML = '<i class="icon ' + defaultIcon + '"></i> ' + buttonEle.innerHTML;
    buttonEle.className += ' button-clear';
  }

  if (!hasInnerText) {
    var buttonTextEle = $document[0].createElement('span');
    buttonTextEle.className = 'back-text';

    if (!hasButtonText && $ionicConfig.backButton.text()) {
      buttonTextEle.innerHTML += '<span class="default-title">' + $ionicConfig.backButton.text() + '</span>';
    }
    if (!hasPreviousTitle && $ionicConfig.backButton.previousTitleText()) {
      buttonTextEle.innerHTML += '<span class="previous-title"></span>';
    }
    buttonEle.appendChild(buttonTextEle);

  }

  tElement.attr('class', 'hide');
  tElement.empty();

  let $scope = this.$scope;
  $(this).on('$preLink', () => {
    let navBarCtrl = $scope.$ionicNavBar;

    // only register the plain HTML, the navBarCtrl takes care of scope
    navBarCtrl.navElement('backButton', buttonEle.outerHTML);
    buttonEle = null;
  });
});

Template.ionNavBackButton.onDestroyed(function() {
  $('ion-nav-bar').off(
      'click',
      '.back-button',
      _.isFunction(this.onClick) ? this.onClick : noop);
});