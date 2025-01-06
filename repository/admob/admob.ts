import {
  AccountNetwork,
  App,
  GlobalAnalytics,
  IAdNetwork,
} from "@/repository/IAdNetwork";

type MoneAnaylyticsRow = {
  row: {
    dimensionValues: {
      DATE?: {
        value: string; // "20250101"
      };
      APP: {
        value: string; // "ca-app-pub"
        displayLabel: string;
      };
    };
    metricValues: {
      ESTIMATED_EARNINGS: {
        microsValue: string;
      };
      AD_REQUESTS: {
        integerValue: string;
      };
      MATCHED_REQUESTS: {
        integerValue: string;
      };
      IMPRESSIONS: {
        integerValue: string;
      };
    };
  };
};
type MoneAnaylyticsFooter = {
  footer: {
    matchingRowCount: string;
  };
};
type MoneAnaylyticsHeader = {
  header: {
    dateRange: {
      startDate: {
        year: number;
        month: number;
        day: number;
      };
      endDate: {
        year: number;
        month: number;
        day: number;
      };
    };
    localizationSettings: {
      currencyCode: string; // "EUR"
    };
  };
};
type MoneAnaylytics =
  | MoneAnaylyticsHeader
  | MoneAnaylyticsRow
  | MoneAnaylyticsFooter;

class AdMobRepository implements IAdNetwork {
  constructor(private token: string) {}
  private readonly URL_ADMOB = "https://admob.googleapis.com/v1/";

  async fetch<T>(
    url: string,
    options?: {
      method?: string;
      body?: any;
    }
  ): Promise<T> {
    const result = await fetch(`${this.URL_ADMOB}${url}`, {
      method: options?.method ?? "GET",
      headers: {
        Authorization: "Bearer " + this.token,
      },
      body: options?.body ? JSON.stringify(options?.body) : undefined,
    });
    /*
      TODO: On Token Expired refresh Token
    */

    return await result.json();
  }

  public async getListApp(accountId: string): Promise<App[]> {
    const { apps } = await this.fetch<{
      apps: {
        platform: "ANDROID" | "IOS";
        manualAppInfo: {
          displayName: string;
        };
        appApprovalState: "ACTION_REQUIRED" | "APPROVED";
        linkedAppInfo: {
          appStoreId: string;
          displayName: string;
        };
        name: string;
        appId: string;
      }[];
    }>(`accounts/${accountId}/apps`);

    return apps.map(
      ({ appId, linkedAppInfo, manualAppInfo: { displayName } }) => ({
        id: appId,
        name: linkedAppInfo?.displayName ?? displayName,
      })
    );
  }

  public async getListAccounts(): Promise<AccountNetwork[]> {
    const { account } = await this.fetch<{
      account: {
        currencyCode: string;
        name: string;
        publisherId: string;
        reportingTimeZone: string;
      }[];
    }>(`accounts`);

    return account.map((account) => ({
      accountId: account.publisherId,
      timeZone: account.reportingTimeZone,
    }));
  }

  public async getAnalytics(accountId: string): Promise<GlobalAnalytics> {
    const today = new Date();
    const data = await this.fetch<MoneAnaylytics[]>(
      `accounts/${accountId}/networkReport:generate`,
      {
        method: "POST",
        body: {
          reportSpec: {
            dateRange: {
              startDate: {
                year: today.getFullYear(),
                month: today.getMonth() + 1,
                day: today.getDate(),
              },
              endDate: {
                year: today.getFullYear(),
                month: today.getMonth() + 1,
                day: today.getDate(),
              },
            },
            dimensions: ["APP" /*", DATE", "PLATFORM", "COUNTRY"*/], //Filtar solo por lo que se necesita, si es plataforma, si es country, por fecha etc
            metrics: [
              "ESTIMATED_EARNINGS",
              "AD_REQUESTS",
              "MATCHED_REQUESTS",
              "IMPRESSIONS",
            ],
            /* dimensionFilters: [
          {
          dimension: "APP",
          matchesAny: {
            values: ["ca-app-pub-4713105116292090~6827044441"],
          },
          },
        ],*/
          },
        },
      }
    );

    const { header } = data.find(
      (item): item is MoneAnaylyticsHeader => "header" in item
    )!;
    const rowData = data.filter(
      (item): item is MoneAnaylyticsRow => "row" in item
    );

    const analytics: GlobalAnalytics = {
      totalAdRequest: 0,
      currencyCode: header.localizationSettings.currencyCode,
      totalImpressions: 0,
      totalEarnings: 0,
      app: [],
    };

    rowData.forEach(({ row }) => {
      let id = row.dimensionValues.APP.value;
      const totalAdRequest = Number(row.metricValues.AD_REQUESTS.integerValue);
      const totalEarnings =
        Number(row.metricValues.ESTIMATED_EARNINGS.microsValue) / 10000;
      const totalImpressions = Number(
        row.metricValues.IMPRESSIONS.integerValue
      );
      analytics.totalAdRequest += totalAdRequest;
      analytics.totalEarnings += totalEarnings;
      analytics.totalImpressions += totalImpressions;
      analytics.app.push({
        id,
        totalAdRequest,
        totalEarnings,
        totalImpressions,
      });
    });

    return analytics;
  }
}

export default AdMobRepository;
