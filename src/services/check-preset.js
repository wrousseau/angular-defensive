class CheckPreset {

  constructor(connectionStatus) {
    this.connectionStatus = connectionStatus;
  }

  noNetwork() {
    return !this.connectionStatus.isOnline();
  }

}

export default CheckPreset;
