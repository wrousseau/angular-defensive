import CheckPreset from './check-preset';
import DefensiveConfiguration from './defensive-configuration';

var moduleName = 'ngDefensive.services';

angular.module(moduleName, ['offline'])
  .service('CheckPreset', CheckPreset)
  .service('DefensiveConfiguration', DefensiveConfiguration);

export default moduleName;
