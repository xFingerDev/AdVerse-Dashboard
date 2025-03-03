import { IApp, INetwork } from "./INetwork";

export type AplicationAnalytic = {
  icon: string;
  platform: string;
  name: string;
  currencyCode: string;
  id: string;
  totalEarnings: number;
  totalImpressions: number;
  totalAdRequest: number;
};

export enum AnalyticType {
  today = "today",
  yesterday = "yesterday",
  sevenDays = "sevenDays",
  fourteenDays = "fourteenDays",
  oneMonth = "oneMonth",
  oneYear = "oneYear",

  // custom = "custom",
}
/*  | "today"
  | "yesterday"
  | "7days"
  | "14days"
  | "1month"
  | "1year";*/
//| "custom";

export interface INetworkAnalytic {
  id: string;
  network: INetwork;
  getApps(): IApp[];
  refresh(force?: boolean): Promise<void>;
  getListAnalytics(dto: {
    startDate: Date;
    endDate: Date;
  }): Promise<AplicationAnalytic[]>;
}
