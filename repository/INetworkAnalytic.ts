import { AppAnalytics } from "./IAdNetworkRepository";
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

export enum AnalyticTypeEnum {
  today = "today",
  yesterday = "yesterday",
  sevenDays = "sevenDays",
  fourteenDays = "fourteenDays",
  oneMonth = "oneMonth",
  oneYear = "oneYear",
}

export function isAnalyticTypeDate(
  type: AnalyticType
): type is AnalyticTypeDate {
  return (type as AnalyticTypeDate).start !== undefined;
}

export function isAnalyticTypeEnum(
  type: AnalyticType
): type is AnalyticTypeEnum {
  return Object.values(AnalyticTypeEnum).includes(type as AnalyticTypeEnum);
}

export const parseAnalyticType = (analyticsTypeStr?: string): AnalyticType => {
  try {
    const parsedAnalyticType = JSON.parse(analyticsTypeStr ?? "{}");

    if (isAnalyticTypeEnum(parsedAnalyticType)) {
      return parsedAnalyticType;
    }

    return {
      start: new Date(parsedAnalyticType.start),
      end: new Date(parsedAnalyticType.end),
    };
  } catch (error) {
    return AnalyticTypeEnum.today;
  }
};

export type AnalyticTypeDate = { start: Date; end: Date };
export type AnalyticType = AnalyticTypeEnum | AnalyticTypeDate;

export interface INetworkAnalytic {
  id: string;
  network: INetwork;
  getApps(): IApp[];
  refresh(force?: boolean): Promise<void>;
  getListAnalytics(dto: {
    startDate: Date;
    endDate: Date;
  }): Promise<AplicationAnalytic[]>;
  getAnalyticsApp(dto: {
    appId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<AppAnalytics | null>;
}
