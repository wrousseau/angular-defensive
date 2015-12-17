const HTTP = new WeakMap();
const TEMPLATE_CACHE = new WeakMap();

class DefensiveConfiguration {

  constructor($http, $templateCache) {
    HTTP.set(this, $http);
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

  getDefensiveCase(configurationName) {
    let self = this;
    return new Promise(function(resolve, reject) {
      if (!self.configurations.hasOwnProperty(configurationName)) {
        return reject(`Configuration ${configurationName} does not exist`);
      }
      let configuration = self.configurations[configurationName];
      while (configuration.cases.length) {
        let confCase = configuration.cases.shift();
        if (confCase.check()) {
          return self.getTemplate(confCase)
          .then(function(template) {
            confCase.template = template;
            return resolve(confCase);
          });
        }
      }
    });
  }

  static factory($http, $templateCache) {
    return new DefensiveConfiguration($http, $templateCache);
  }

}

export default DefensiveConfiguration;
