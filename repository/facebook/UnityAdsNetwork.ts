import { IAdNetworkRepository } from "../IAdNetworkRepository";
import { IApp, INetwork } from "../INetwork";
import { Alert } from "react-native";
import { INetworkAnalytic } from "../INetworkAnalytic";

export class FacebookAdsNetwork implements INetwork {
  name: string;
  id: string;
  enabled: boolean;

  constructor() {
    this.name = "Meta Audience Network (Coming Soon)";
    this.id = "facebook";
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

export const facebookAdsNetworkInstance = new FacebookAdsNetwork();
