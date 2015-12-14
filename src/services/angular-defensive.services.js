import DefensiveConfiguration from './defensive-configuration';

var moduleName = 'ngDefensive.services';

angular.module(moduleName, [])
  .provider('DefensiveConfiguration', DefensiveConfiguration.factory);

export default moduleName;
