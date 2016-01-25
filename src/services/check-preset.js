const Q = new WeakMap();
const CONNECTION_STATUS = new WeakMap();

class CheckPreset {

  /*@ngInject*/
  constructor($q, connectionStatus) {
    Q.set(this, $q);
    CONNECTION_STATUS.set(this, connectionStatus);
  }

  noNetwork() {
    return !CONNECTION_STATUS.get(this).isOnline();
  }

  geolocationNotSupported() {
    return !navigator.geolocation;
  }

  geolocationNotAvailable() {
    let deferred = Q.get(this).defer();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function() {
        deferred.reject();
      }, function() {
        deferred.resolve();
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }

}

CheckPreset.$inject = ['$q', 'connectionStatus'];

export default CheckPreset;
