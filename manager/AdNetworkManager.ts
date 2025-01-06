import { IAdNetwork } from "@/repository/IAdNetwork";

/*
 Add Layer for dynamic implementation betwen repositorys and 3th party networks
*/
export default class AdNetworkManager {
  public networks: IAdNetwork[] = [];
  constructor() {
    console.log("Constructor");
  }

  public addNetwork(network: IAdNetwork) {
    this.networks.push(network);
  }
}
