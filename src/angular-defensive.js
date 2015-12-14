import { default as directivesModuleName } from './directives/angular-defensive.directives';
import { default as servicesModuleName } from './services/angular-defensive.services';

var moduleName = 'ngDefensive';

var app = angular.module(moduleName, [
	directivesModuleName,
	servicesModuleName
]);

export default moduleName;
