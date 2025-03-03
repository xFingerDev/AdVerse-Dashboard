import { IAdNetworkRepository } from "../IAdNetworkRepository";
import { IApp, INetwork } from "../INetwork";
import { Alert } from "react-native";
import { INetworkAnalytic } from "../INetworkAnalytic";

export class UnityAdsNetwork implements INetwork {
  name: string;
  id: string;
  enabled: boolean;

  constructor() {
    this.name = "Unity Ads (Coming Soon)";
    this.id = "unity";
    this.enabled = false;
  }

  async newNetwork(): Promise<INetworkAnalytic> {
    throw Alert.alert("AdVerse", "Coming Soon");
  }

  removeNetwork(network: INetworkAnalytic): void {}

  loadNetworks(): { networks: INetworkAnalytic[] } {
    return { networks: [] };
  }
}

export const unityAdsNetworkInstance = new UnityAdsNetwork();
