class DefensiveConfiguration {

  constructor() {
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

  $get($http, $templateCache) {
    let configurations = this.configurations;
    return {
      getTemplate(confCase) {
        return new Promise(function(resolve) {
          if (confCase.hasOwnProperty('template')) {
            resolve(confCase.template);
          } else if (confCase.hasOwnProperty('templateUrl')) {
            $http
              .get(confCase.templateUrl, {
                cache: $templateCache,
                headers: {Accept: 'text/html'}
              })
              .then(function(response) {
                resolve(response.data);
              });
          }
        });
      },
      getDefensiveCase(configurationName) {
        let self = this;
        return new Promise(function(resolve, reject) {
          if (!configurations.hasOwnProperty(configurationName)) {
            return reject(`Configuration ${configurationName} does not exist`);
          }
          let configuration = configurations[configurationName];
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
    };
  }

  static factory() {
    return new DefensiveConfiguration();
  }

}

export default DefensiveConfiguration;
