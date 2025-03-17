export type App = {
  id: string;
  name: string;
  icon: string;
  platform: "ANDROID" | "IOS";
};

export type AccountNetwork = {
  accountId: string;
  timeZone: string;
};

export type GlobalAnalytics = {
  currencyCode: string;
  app: {
    id: string;
    totalEarnings: number;
    totalImpressions: number;
    totalAdRequest: number;
  }[];
};

export type AppAnalytics = {
  currencyCode: string;
  analytics: {
    country: string;
    date: Date;
    totalAdRequest: number;
    totalEarnings: number;
    totalImpressions: number;
    adId: string;
  }[];
};

export interface IAdNetworkRepository {
  getAnalyticsApp(dto: {
    accountId: string;
    appId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<AppAnalytics>;
  getListApp(accountId: string): Promise<App[]>;
  getListAccounts(): Promise<AccountNetwork[]>;
  getAnalytics(dto: {
    startDate: Date;
    endDate: Date;
    accountId: string;
  }): Promise<GlobalAnalytics>;
}
