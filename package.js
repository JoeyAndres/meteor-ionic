Package.describe({
  name: "jandres:ionic",
  summary: "Ionic components for Meteor. No Angular!",
  version: "1.24.0-alpha.6",
  git: "https://github.com/JoeyAndres/meteor-ionic.git"
});



Cordova.depends({
  'ionic-plugin-keyboard': '1.0.8'
});

Package.onUse(function(api) {
  api.versionsFrom("1.0");

  api.use([
    "jandres:template-extension@4.0.4",
    "jandres:template-scope@0.1.0-alpha4",
    "ecmascript@0.1.6",
    "templating",
    "underscore",
    "reactive-var",
    "fastclick",
    "iron:router@1.0.0",
    "tracker",
    "session",
    "jquery",
    "jandres:snapjs@2.0.9",
    "fourseven:scss@3.3.3",

    "jandres:meteoric-sass@1.2.4"
  ], "client");

  api.addFiles([
    "vendor/slick.js",
    "vendor/slick.css",
    "vendor/slip.js"
  ], "client");

  api.addFiles([
    "styles/main.scss"
  ], "client");

  api.addFiles([
    "lib/meteoric.js",
    "lib/delegate.js",
    "lib/utility.js",
    "lib/polyfill.js",
    "lib/platform.js",

    // Utils
    'lib/utils/delegateService.js',
    'lib/utils/dom.js',
    'lib/utils/events.js',
    'lib/utils/gestures.js',
    'lib/utils/platform.js',
    'lib/utils/poly.js',
    'lib/utils/tap.js',
    'lib/utils/activator.js',
    'lib/utils/utils.js',
    'lib/utils/keyboard.js',
    'lib/utils/viewport.js',

    // Views
    'lib/views/view.js',
    'lib/views/scrollView.js',
    'lib/views/scrollViewNative.js',
    'lib/views/listView.js',
    'lib/views/modalView.js',
    'lib/views/sideMenuView.js',
    'lib/views/sliderView.js',
    'lib/views/slidesView.js',
    'lib/views/toggleView.js',

    // Controller.
    'lib/controller/navViewController.js',
    'lib/controller/headerBarController.js',
    'lib/controller/spinnerController.js',
    'lib/controller/scrollController.js',

    // Service.
    'lib/service/body.js',
    'lib/service/clickBlock.js',
    'lib/service/gesture.js',
    'lib/service/ionicConfig.js',
    'lib/service/platform.js',
    'lib/service/viewSwitcher.js',
    'lib/service/history.js',
    'lib/service/navBarDelegate.js',
    'lib/service/navViewDelegate.js',
    'lib/service/scrollDelegate.js',
    'lib/service/sideMenuDelegate.js',
    'lib/service/tabsDelegate.js',

    'lib/meteoric-config.js',

    "components/ionActionSheet/ionActionSheet.html",
    "components/ionActionSheet/ionActionSheet.js",

    "components/ionBackdrop/ionBackdrop.html",
    "components/ionBackdrop/ionBackdrop.js",

    "components/ionBody/ionBody.html",
    "components/ionBody/ionBody.js",

    "components/ionContent/ionContent.html",
    "components/ionContent/ionContent.js",

    "components/ionDeleteButton/ionDeleteButton.html",
    "components/ionDeleteButton/ionDeleteButton.js",

    "components/ionHeaderFooterBar/ionHeaderFooterBar.js",

    "components/ionFooterBar/ionFooterBar.html",
    "components/ionFooterBar/ionFooterBar.js",

    "components/ionHeaderBar/ionHeaderBar.html",
    "components/ionHeaderBar/ionHeaderBar.js",

    "components/ionInfiniteScroll/ionInfiniteScroll.html",
    "components/ionInfiniteScroll/ionInfiniteScroll.js",

    "components/ionItem/ionItem.html",
    "components/ionItem/ionItem.js",

    "components/ionItemOptions/ionItemOptions.html",
    "components/ionItemOptions/ionItemOptions.js",

    "components/ionItemContent/ionItemContent.html",
    "components/ionItemContent/ionItemContent.js",

    "components/ionKeyboard/ionKeyboard.js",
    "components/ionKeyboard/ionInputFocus.js",

    "components/ionList/ionList.html",
    "components/ionList/ionList.js",

    "components/ionListButton/ionListButton.html",
    "components/ionListButton/ionListButton.js",

    "components/ionLoading/ionLoading.html",
    "components/ionLoading/ionLoading.js",

    "components/ionModal/ionModal.html",
    "components/ionModal/ionModal.js",

    "components/ionNavBar/ionNavBar.html",
    "components/ionNavBar/ionNavBar.js",

    "components/ionOptionButton/ionOptionButton.html",
    "components/ionOptionButton/ionOptionButton.js",

    "components/ionNavBackButton/ionNavBackButton.html",
    "components/ionNavBackButton/ionNavBackButton.js",

    "components/ionNavView/ionNavView.html",
    "components/ionNavView/ionNavView.js",

    "components/ionPane/ionPane.html",
    "components/ionPane/ionPane.js",

    "components/ionPopover/ionPopover.html",
    "components/ionPopover/ionPopover.js",

    "components/ionPopup/ionPopup.html",
    "components/ionPopup/ionPopup.js",

    "components/ionRadio/ionRadio.html",
    "components/ionRadio/ionRadio.js",

    "components/ionReorderButton/ionReorderButton.html",
    "components/ionReorderButton/ionReorderButton.js",

    "components/ionScroll/ionScroll.html",
    "components/ionScroll/ionScroll.js",

    "components/ionSideMenu/ionSideMenu.html",
    "components/ionSideMenu/ionSideMenu.js",

    "components/ionSideMenuContainer/ionSideMenuContainer.html",
    "components/ionSideMenuContainer/ionSideMenuContainer.js",

    "components/ionSideMenuContent/ionSideMenuContent.html",
    "components/ionSideMenuContent/ionSideMenuContent.js",

    "components/ionSideMenus/ionSideMenus.html",
    "components/ionSideMenus/ionSideMenus.js",

    "components/ionSlideBox/ionSlideBox.html",
    "components/ionSlideBox/ionSlideBox.js",

    "components/ionSpinner/ionSpinner.html",
    "components/ionSpinner/ionSpinner.js",

    "components/ionSlide/ionSlide.html",
    "components/ionSlide/ionSlide.js",

    "components/ionSubfooterBar/ionSubfooterBar.html",
    "components/ionSubfooterBar/ionSubfooterBar.js",

    "components/ionSubheaderBar/ionSubheaderBar.html",
    "components/ionSubheaderBar/ionSubheaderBar.js",

    "components/ionTabs/ionTabs.html",
    "components/ionTabs/ionTabs.js",

    "components/ionTab/ionTab.html",
    "components/ionTab/ionTab.js",

    "components/ionView/ionView.html",
    "components/ionView/ionView.js"

  ], "client");

  api.export("Platform");

  api.export("IonActionSheet");
  api.export("IonBackdrop");
  api.export("IonHeaderBar");
  api.export("IonKeyboard");
  api.export("IonLoading");
  api.export("IonModal");
  api.export("IonNavigation");
  api.export("IonPopover");
  api.export("IonPopup");
  api.export("IonSideMenu");
});
