import { IAdNetwork } from "./IAdNetwork";

export default class AdNetworkManager {
  private static networks: IAdNetwork[] = [];
  constructor() {}

  public static addNetwork(network: IAdNetwork) {
    this.networks.push(network);
  }
}
