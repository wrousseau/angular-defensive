import NgDefensive from './ng-defensive';

var moduleName = 'ngDefensive.directives';

angular.module(moduleName, [])
  .directive('ngDefensive', NgDefensive.factory);

export default moduleName;
