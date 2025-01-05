export type App = {
  id: string;
  name: string;
};

export type AccountNetwork = {
  accountId: string;
  timeZone: string;
};

export type GlobalAnalytics = {
  totalEarnings: number;
  totalImpressions: number;
  totalAdRequest: number;
  app: {
    id: string;
    totalEarnings: number;
    totalImpressions: number;
    totalAdRequest: number;
  }[];
};

export interface IAdNetwork {
  getListApp(accountId: string): Promise<App[]>;
  getListAccounts(): Promise<AccountNetwork[]>;
  getAnalytics(accountId: string): Promise<GlobalAnalytics>;
}
