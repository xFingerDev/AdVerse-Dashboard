import { INetworkAnalytic } from "./INetworkAnalytic";

export interface IApp {
  name: string;
  icon: string;
  id: string;
  platform: string;
}

export interface INetwork {
  name: string;
  id: string;
  enabled: boolean;
  newNetwork(): Promise<INetworkAnalytic>;
  removeNetwork(network: INetworkAnalytic): void;
  loadNetworks(): { networks: INetworkAnalytic[] };
}
