class NgDefensive {

  constructor($compile, DefensiveConfiguration) {
    this.restrict = 'A';
    this.scope = {
      callbacks: '=ngDefensiveCallbacks'
    };
    this.link = function(scope, element, attrs) {
      let activeCase = null;
      DefensiveConfiguration.getDefensiveCase(attrs.ngDefensive)
      .then(function(confCase) {
        element.replaceWith($compile(confCase.template)(scope));
        activeCase = confCase;
      });
      scope.action = function() {
        scope.callbacks[activeCase.caseName]();
      };
    };
  }

  static factory($compile, DefensiveConfiguration) {
    return new NgDefensive($compile, DefensiveConfiguration);
  }

}

export default NgDefensive;
