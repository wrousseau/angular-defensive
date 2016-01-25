const HTTP = new WeakMap();
const Q = new WeakMap();
const TEMPLATE_CACHE = new WeakMap();

class DefensiveConfiguration {

  /*@ngInject*/
  constructor($http, $q, $templateCache) {
    HTTP.set(this, $http);
    Q.set(this, $q);
    TEMPLATE_CACHE.set(this, $templateCache);
    this.configurations = {};
  }

  static get Configuration() {
    return class Configuration {
      constructor() {
        this.cases = [];
      }

      addCase(confCase) {
        this.cases.push(confCase);
        return this;
      }
    };
  }

  get Configuration() {
    return DefensiveConfiguration.Configuration;
  }

  registerConfiguration(configurationName) {
    let configuration = new this.Configuration();
    this.configurations[configurationName] = configuration;
    return configuration;
  }

  getTemplate(confCase) {
    let self = this;
    return new Promise(function(resolve) {
      if (confCase.hasOwnProperty('template')) {
        resolve(confCase.template);
      } else if (confCase.hasOwnProperty('templateUrl')) {
        HTTP.get(self)
        .get(confCase.templateUrl, {
          cache: TEMPLATE_CACHE.get(self),
          headers: {Accept: 'text/html'}
        })
        .then(function(response) {
          resolve(response.data);
        });
      }
    });
  }

  promiseWrap(check) {
    let deferred = Q.get(this).defer();
    Q.get(this).when(check())
    .then(function(result) {
      if (result === false) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
    })
    .catch(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  getDefensiveCase(configurationName) {
    let self = this;
    return new Promise(function(resolve, reject) {
      if (!self.configurations.hasOwnProperty(configurationName)) {
        return reject(`Configuration ${configurationName} does not exist`);
      }
      let cases = self.configurations[configurationName].cases.slice();
      while (cases.length) {
        let confCase = cases.shift();
        self.promiseWrap(confCase.check)
        .then(function() {
          return self.getTemplate(confCase);
        })
        .then(function(template) {
          confCase.template = template;
          return resolve(confCase);
        });
      }
    });
  }

}

DefensiveConfiguration.$inject = ['$http', '$q', '$templateCache'];

export default DefensiveConfiguration;
