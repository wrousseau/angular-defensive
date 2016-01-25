const COMPILE = new WeakMap();
const DEFENSIVE_CONFIGURATION = new WeakMap();

class NgDefensive {

  /*@ngInject*/
  constructor($compile, DefensiveConfiguration) {
    this.restrict = 'A';
    COMPILE.set(this, $compile);
    DEFENSIVE_CONFIGURATION.set(this, DefensiveConfiguration);
  }

  link(scope, element, attrs) {
    let activeCase = null;
    let DefensiveConfiguration = DEFENSIVE_CONFIGURATION.get(NgDefensive.instance);
    DefensiveConfiguration.getDefensiveCase(attrs.ngDefensive)
    .then(function(confCase) {
      let $compile = COMPILE.get(NgDefensive.instance);
      element.replaceWith($compile(confCase.template)(scope));
      activeCase = confCase;
    });
    scope.action = function() {
      scope.$eval(attrs.ngDefensiveCallbacks)[activeCase.caseName]();
    };
  }

  static factory($compile, DefensiveConfiguration) {
    NgDefensive.instance = new NgDefensive($compile, DefensiveConfiguration);
    return NgDefensive.instance;
  }

}

NgDefensive.factory.$inject = [
  '$compile',
  'DefensiveConfiguration'
];

export default NgDefensive;
