import { adMobNetworkInstance } from "@/repository/admob/AdMobNetwork";
import { adsenseNetworkInstance } from "@/repository/adsense/AdsenseNetwork";
import { facebookAdsNetworkInstance } from "@/repository/facebook/UnityAdsNetwork";
import { IApp, INetwork } from "@/repository/INetwork";
import {
  AnalyticType,
  AnalyticTypeEnum,
  AplicationAnalytic,
  INetworkAnalytic,
  isAnalyticTypeDate,
} from "@/repository/INetworkAnalytic";
import { unityAdsNetworkInstance } from "@/repository/unityAds/UnityAdsNetwork";

/*
 Add Layer for dynamic implementation betwen repositorys and 3th party networks
 and refactor this code for more eficient and less chaos
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
    type: AnalyticType
  ): Promise<AplicationAnalytic[]> {
    try {
      const { startDate, endDate } = this.calculateDateRange(type);

      const analytics = await Promise.all(
        this.repositories.map((repo) =>
          repo.getListAnalytics({ startDate, endDate }).catch((error) => {
            console.error(
              `Failed to fetch analytics for repository: ${repo.id}`,
              error
            );
            return [];
          })
        )
      );

      this.needRefresh = false;
      return analytics.flat();
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return [];
    }
  }

  private calculateDateRange(type: AnalyticType): {
    startDate: Date;
    endDate: Date;
  } {
    const endDate = new Date();
    const startDate = new Date();

    if (isAnalyticTypeDate(type)) {
      return { startDate: type.start, endDate: type.end };
    }

    switch (type) {
      case AnalyticTypeEnum.yesterday:
        startDate.setDate(endDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);
        break;
      case AnalyticTypeEnum.sevenDays:
        startDate.setDate(endDate.getDate() - 7);
        break;
      case AnalyticTypeEnum.fourteenDays:
        startDate.setDate(endDate.getDate() - 14);
        break;
      case AnalyticTypeEnum.oneMonth:
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case AnalyticTypeEnum.oneYear:
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    return { startDate, endDate };
  }

  public loadedNetworks(): INetworkAnalytic[] {
    return this.repositories;
  }

  public getAplicationDataById(id: string): IApp | null {
    //TODO: handle multiple repositories
    return this.repositories[0].getApps().find((app) => app.id === id) ?? null;
  }
  public async getAplicationAnalyticsById(type: AnalyticType, id: string) {
    const { startDate, endDate } = this.calculateDateRange(type);

    //TODO: handle multiple repositories
    return await this.repositories[0].getAnalyticsApp({
      startDate,
      endDate,
      appId: id,
    });
  }
}
