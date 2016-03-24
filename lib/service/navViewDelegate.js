
class ionicNavViewDelegate extends meteoric.lib.Delegate {
  constructor() {
    let methods = [
      'clearCache'
    ];

    super();
    this.addMethods(methods);
  }
}
$ionicNavViewDelegate = new ionicNavViewDelegate();