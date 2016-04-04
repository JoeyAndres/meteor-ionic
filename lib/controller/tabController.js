$ionicTab =
function($scope, $attrs) {
  this.$scope = $scope;

  //All of these exposed for testing
  this.hrefMatchesState = function () {
    return $attrs.href && $location.path().indexOf(
            $attrs.href.get().replace(/^#/, '').replace(/\/$/, '')
        ) === 0;
  };
  /*
   this.srefMatchesState = function () {
   return false && $attrs.uiSref && $state.includes($attrs.uiSref.split('(')[0]);
   };
   this.navNameMatchesState = function () {
   return this.navViewName && $ionicHistory.isCurrentStateNavView(this.navViewName);
   };*/

  this.tabMatchesState = function () {
    return this.hrefMatchesState();
    //this.srefMatchesState() ||
    //this.navNameMatchesState();
  };
};
