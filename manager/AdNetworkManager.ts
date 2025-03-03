import AdMobRepository from "@/repository/admob/AdMobRepository";
import { IApp, INetwork } from "@/repository/INetwork";
import { IAdNetworkRepository } from "@/repository/IAdNetworkRepository";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { adMobNetworkInstance } from "@/repository/admob/AdMobNetwork";
import { unityAdsNetworkInstance } from "@/repository/unityAds/UnityAdsNetwork";
import { facebookAdsNetworkInstance } from "@/repository/facebook/UnityAdsNetwork";
import {
  AnalyticType,
  AplicationAnalytic,
  INetworkAnalytic,
} from "@/repository/INetworkAnalytic";
import { adsenseNetworkInstance } from "@/repository/adsense/AdsenseNetwork";

/*
 Add Layer for dynamic implementation betwen repositorys and 3th party networks
*/
export default class AdNetworkManager {
  public repositories: INetworkAnalytic[] = [];
  public needRefresh: boolean = false;
  public networkAvailable: INetwork[] = [
    adMobNetworkInstance,
    adsenseNetworkInstance,
    unityAdsNetworkInstance,
    facebookAdsNetworkInstance,
  ];
  constructor() {
    this.init();
  }

  public init() {
    this.networkAvailable.map((network) => {
      const { networks } = network.loadNetworks();
      this.repositories.push(...networks);
    });
  }

  public availableNetworks(): INetwork[] {
    return this.networkAvailable;
  }

  public addNetwork(network: INetworkAnalytic) {
    this.repositories.push(network);
    this.needRefresh = true;
  }

  public removeNetwork(network: INetworkAnalytic) {
    this.repositories = this.repositories.filter(
      (repo) => repo.id !== network.id
    );

    network.network.removeNetwork(network);
    this.needRefresh = true;
  }

  public async refreshNetwork(network: INetworkAnalytic) {
    await network.refresh(true);
    this.needRefresh = true;
  }

  public async getAnalyticList(
    type: AnalyticType,
    customDate?: { startDate: Date; endDate: Date }
  ): Promise<AplicationAnalytic[]> {
    let startDate = customDate?.startDate ?? new Date();
    let endDate = customDate?.endDate ?? new Date();
    switch (type) {
      case AnalyticType.yesterday:
        startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);
        break;
      case AnalyticType.sevenDays:
        startDate.setDate(startDate.getDate() - 7);
        break;
      case AnalyticType.fourteenDays:
        startDate.setDate(startDate.getDate() - 14);
        break;
      case AnalyticType.oneMonth:
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case AnalyticType.oneYear:
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const result = await Promise.all(
      this.repositories.map((repo) =>
        repo.getListAnalytics({ startDate, endDate })
      )
    ).then((data) => data.flat());
    this.needRefresh = false;

    return result;
  }

  public loadedNetworks(): INetworkAnalytic[] {
    return this.repositories;
  }

  public getAplicationDataById(id: string): IApp | null {
    return this.repositories[0].getApps().find((app) => app.id === id) ?? null;
  }
}
