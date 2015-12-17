const CONNECTION_STATUS = new WeakMap();

class CheckPreset {

  constructor(connectionStatus) {
    CONNECTION_STATUS.set(this, connectionStatus);
  }

  noNetwork() {
    return !connectionStatus.isOnline();
  }

  static factory(connectionStatus) {
    return new CheckPreset(connectionStatus);
  }

}

export default CheckPreset;
