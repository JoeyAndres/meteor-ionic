$ionicTab =
function($scope, $attrs) {
  this.$scope = $scope;

  //All of these exposed for testing
  this.hrefMatchesState = function () {
    return $attrs.href.get() && $location.path().indexOf(
            $attrs.href.get().replace(/^#/, '').replace(/\/$/, '')
        ) === 0;
  };

  this.tabMatchesState = function () {
    return this.hrefMatchesState();
  };
};
