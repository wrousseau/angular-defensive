var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.angularDefensive = factory();
})(this, function () {
	'use strict';

	var HTTP = new WeakMap();
	var TEMPLATE_CACHE = new WeakMap();

	var DefensiveConfiguration = (function () {
		function DefensiveConfiguration($http, $templateCache) {
			_classCallCheck(this, DefensiveConfiguration);

			HTTP.set(this, $http);
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
				return new Promise(function (resolve) {
					if (confCase.hasOwnProperty('template')) {
						resolve(confCase.template);
					} else if (confCase.hasOwnProperty('templateUrl')) {
						HTTP.get(this).get(confCase.templateUrl, {
							cache: TEMPLATE_CACHE.get(this),
							headers: { Accept: 'text/html' }
						}).then(function (response) {
							resolve(response.data);
						});
					}
				});
			}
		}, {
			key: 'getDefensiveCase',
			value: function getDefensiveCase(configurationName) {
				var self = this;
				return new Promise(function (resolve, reject) {
					if (!self.configurations.hasOwnProperty(configurationName)) {
						return reject('Configuration ' + configurationName + ' does not exist');
					}
					var configuration = self.configurations[configurationName];

					var _loop = function () {
						var confCase = configuration.cases.shift();
						if (confCase.check()) {
							return {
								v: self.getTemplate(confCase).then(function (template) {
									confCase.template = template;
									return resolve(confCase);
								})
							};
						}
					};

					while (configuration.cases.length) {
						var _ret = _loop();

						if (typeof _ret === 'object') return _ret.v;
					}
				});
			}
		}, {
			key: 'Configuration',
			get: function get() {
				return DefensiveConfiguration.Configuration;
			}
		}], [{
			key: 'factory',
			value: function factory($http, $templateCache) {
				return new DefensiveConfiguration($http, $templateCache);
			}
		}, {
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

	var moduleName$2 = 'ngDefensive.services';

	angular.module(moduleName$2, []).factory('DefensiveConfiguration', DefensiveConfiguration.factory);

	var NgDefensive = (function () {
		function NgDefensive($compile, DefensiveConfiguration) {
			_classCallCheck(this, NgDefensive);

			this.restrict = 'A';
			this.scope = {
				callbacks: '=ngDefensiveCallbacks'
			};
			this.link = function (scope, element, attrs) {
				var activeCase = null;
				DefensiveConfiguration.getDefensiveCase(attrs.ngDefensive).then(function (confCase) {
					element.replaceWith($compile(confCase.template)(scope));
					activeCase = confCase;
				});
				scope.action = function () {
					scope.callbacks[activeCase.caseName]();
				};
			};
		}

		_createClass(NgDefensive, null, [{
			key: 'factory',
			value: function factory($compile, DefensiveConfiguration) {
				return new NgDefensive($compile, DefensiveConfiguration);
			}
		}]);

		return NgDefensive;
	})();

	var moduleName$1 = 'ngDefensive.directives';

	angular.module(moduleName$1, []).directive('ngDefensive', NgDefensive.factory);

	var moduleName = 'ngDefensive';

	var app = angular.module(moduleName, [moduleName$1, moduleName$2]);

	return moduleName;
});
//# sourceMappingURL=angular-defensive.js.map
