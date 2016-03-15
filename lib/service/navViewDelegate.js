
class ionicNavViewDelegate extends meteoric.lib.Delegate {
  constructor() {
    let methods = [
      'clearCache'
    ];

    super();
    this.addMethods(methods);
  }
}
meteoric.service.ionicNavViewDelegate = new ionicNavViewDelegate();

