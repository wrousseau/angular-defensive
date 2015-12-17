import DefensiveConfiguration from './defensive-configuration';

var moduleName = 'ngDefensive.services';

angular.module(moduleName, [])
  .factory('DefensiveConfiguration', DefensiveConfiguration.factory);

export default moduleName;
