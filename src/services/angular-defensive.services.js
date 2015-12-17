import DefensiveConfiguration from './defensive-configuration';

var moduleName = 'ngDefensive.services';

angular.module(moduleName, ['offline'])
  .factory('DefensiveConfiguration', DefensiveConfiguration.factory)
  .factory('CheckPreset', CheckPreset.factory);

export default moduleName;
