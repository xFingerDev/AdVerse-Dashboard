import { IAdNetworkRepository } from "../IAdNetworkRepository";
import { IApp, INetwork } from "../INetwork";
import { Alert } from "react-native";
import { INetworkAnalytic } from "../INetworkAnalytic";

export class AdsenseNetwork implements INetwork {
  name: string;
  id: string;
  enabled: boolean;

  constructor() {
    this.name = "Adsense (Coming Soon)";
    this.id = "adsense";
    this.enabled = false;
  }

  async newNetwork(): Promise<INetworkAnalytic> {
    throw Alert.alert("AdVerse", "Coming Soon");
  }
  removeNetwork(network: INetworkAnalytic): void {}
  loadNetworks(): { networks: INetworkAnalytic[]; apps: IApp[] } {
    return { networks: [], apps: [] };
  }
}

export const adsenseNetworkInstance = new AdsenseNetwork();
