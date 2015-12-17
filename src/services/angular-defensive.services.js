import CheckPreset from './check-preset';
import DefensiveConfiguration from './defensive-configuration';

var moduleName = 'ngDefensive.services';

angular.module(moduleName, ['offline'])
  .factory('CheckPreset', CheckPreset.factory)
  .factory('DefensiveConfiguration', DefensiveConfiguration.factory);

export default moduleName;
