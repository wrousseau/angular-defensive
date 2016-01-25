var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.angularDefensive = factory();
})(this, function () {
	'use strict';

	var HTTP = new WeakMap();
	var Q$1 = new WeakMap();
	var TEMPLATE_CACHE = new WeakMap();

	var DefensiveConfiguration = (function () {

		/*@ngInject*/

		function DefensiveConfiguration($http, $q, $templateCache) {
			_classCallCheck(this, DefensiveConfiguration);

			HTTP.set(this, $http);
			Q$1.set(this, $q);
			TEMPLATE_CACHE.set(this, $templateCache);
			this.configurations = {};
		}

		_createClass(DefensiveConfiguration, [{
			key: 'registerConfiguration',
			value: function registerConfiguration(configurationName) {
				var configuration = new this.Configuration();
				this.configurations[configurationName] = configuration;
				return configuration;
			}
		}, {
			key: 'getTemplate',
			value: function getTemplate(confCase) {
				var self = this;
				return new Promise(function (resolve) {
					if (confCase.hasOwnProperty('template')) {
						resolve(confCase.template);
					} else if (confCase.hasOwnProperty('templateUrl')) {
						HTTP.get(self).get(confCase.templateUrl, {
							cache: TEMPLATE_CACHE.get(self),
							headers: { Accept: 'text/html' }
						}).then(function (response) {
							resolve(response.data);
						});
					}
				});
			}
		}, {
			key: 'promiseWrap',
			value: function promiseWrap(check) {
				var deferred = Q$1.get(this).defer();
				Q$1.get(this).when(check()).then(function (result) {
					if (result === false) {
						deferred.reject();
					} else {
						deferred.resolve();
					}
				})['catch'](function () {
					deferred.reject();
				});
				return deferred.promise;
			}
		}, {
			key: 'getDefensiveCase',
			value: function getDefensiveCase(configurationName) {
				var self = this;
				return new Promise(function (resolve, reject) {
					if (!self.configurations.hasOwnProperty(configurationName)) {
						return reject('Configuration ' + configurationName + ' does not exist');
					}
					var cases = self.configurations[configurationName].cases.slice();

					var _loop = function () {
						var confCase = cases.shift();
						self.promiseWrap(confCase.check).then(function () {
							return self.getTemplate(confCase);
						}).then(function (template) {
							confCase.template = template;
							return resolve(confCase);
						});
					};

					while (cases.length) {
						_loop();
					}
				});
			}
		}, {
			key: 'Configuration',
			get: function get() {
				return DefensiveConfiguration.Configuration;
			}
		}], [{
			key: 'Configuration',
			get: function get() {
				return (function () {
					function Configuration() {
						_classCallCheck(this, Configuration);

						this.cases = [];
					}

					_createClass(Configuration, [{
						key: 'addCase',
						value: function addCase(confCase) {
							this.cases.push(confCase);
							return this;
						}
					}]);

					return Configuration;
				})();
			}
		}]);

		return DefensiveConfiguration;
	})();

	DefensiveConfiguration.$inject = ['$http', '$q', '$templateCache'];

	var Q = new WeakMap();
	var CONNECTION_STATUS = new WeakMap();

	var CheckPreset = (function () {

		/*@ngInject*/

		function CheckPreset($q, connectionStatus) {
			_classCallCheck(this, CheckPreset);

			Q.set(this, $q);
			CONNECTION_STATUS.set(this, connectionStatus);
		}

		_createClass(CheckPreset, [{
			key: 'noNetwork',
			value: function noNetwork() {
				return !CONNECTION_STATUS.get(this).isOnline();
			}
		}, {
			key: 'geolocationNotSupported',
			value: function geolocationNotSupported() {
				return !navigator.geolocation;
			}
		}, {
			key: 'geolocationNotAvailable',
			value: function geolocationNotAvailable() {
				var deferred = Q.get(this).defer();
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function () {
						deferred.reject();
					}, function () {
						deferred.resolve();
					});
				} else {
					deferred.resolve();
				}
				return deferred.promise;
			}
		}]);

		return CheckPreset;
	})();

	CheckPreset.$inject = ['$q', 'connectionStatus'];

	var moduleName$2 = 'ngDefensive.services';

	angular.module(moduleName$2, ['offline']).service('CheckPreset', CheckPreset).service('DefensiveConfiguration', DefensiveConfiguration);

	var COMPILE = new WeakMap();
	var DEFENSIVE_CONFIGURATION = new WeakMap();

	var NgDefensive = (function () {

		/*@ngInject*/

		function NgDefensive($compile, DefensiveConfiguration) {
			_classCallCheck(this, NgDefensive);

			this.restrict = 'A';
			COMPILE.set(this, $compile);
			DEFENSIVE_CONFIGURATION.set(this, DefensiveConfiguration);
		}

		_createClass(NgDefensive, [{
			key: 'link',
			value: function link(scope, element, attrs) {
				var activeCase = null;
				var DefensiveConfiguration = DEFENSIVE_CONFIGURATION.get(NgDefensive.instance);
				DefensiveConfiguration.getDefensiveCase(attrs.ngDefensive).then(function (confCase) {
					var $compile = COMPILE.get(NgDefensive.instance);
					element.replaceWith($compile(confCase.template)(scope));
					activeCase = confCase;
				});
				scope.action = function () {
					scope.$eval(attrs.ngDefensiveCallbacks)[activeCase.caseName]();
				};
			}
		}], [{
			key: 'factory',
			value: function factory($compile, DefensiveConfiguration) {
				NgDefensive.instance = new NgDefensive($compile, DefensiveConfiguration);
				return NgDefensive.instance;
			}
		}]);

		return NgDefensive;
	})();

	NgDefensive.factory.$inject = ['$compile', 'DefensiveConfiguration'];

	var moduleName$1 = 'ngDefensive.directives';

	angular.module(moduleName$1, []).directive('ngDefensive', NgDefensive.factory);

	var moduleName = 'ngDefensive';

	var app = angular.module(moduleName, [moduleName$1, moduleName$2]);

	return moduleName;
});
//# sourceMappingURL=angular-defensive.js.map
