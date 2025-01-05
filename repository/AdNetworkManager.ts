import { IAdNetwork } from "./IAdNetwork";

export default class AdNetworkManager {
  public networks: IAdNetwork[] = [];
  constructor() {
    console.log("Constructor");
  }

  public addNetwork(network: IAdNetwork) {
    this.networks.push(network);
  }
}
