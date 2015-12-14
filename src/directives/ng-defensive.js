class NgDefensive {

  constructor($compile, DefensiveConfiguration) {
    this.restrict = 'A';
    this.link = function(scope, element, attrs) {
      DefensiveConfiguration.getDefensiveTemplate(attrs.ngDefensive)
      .then(function(template) {
        element.replaceWith($compile(template)(scope));
      });
    };
  }

  static factory($compile, DefensiveConfiguration) {
    return new NgDefensive($compile, DefensiveConfiguration);
  }

}

export default NgDefensive;
