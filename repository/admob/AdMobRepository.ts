import {
  AccountNetwork,
  App,
  GlobalAnalytics,
  IAdNetworkRepository,
} from "@/repository/IAdNetworkRepository";
import { storage } from "@/storage/storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { Image } from "react-native";

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

class AdMobRepository implements IAdNetworkRepository {
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

    if (result.status === 401) {
      await GoogleSignin.signInSilently();
      const { accessToken, idToken } = await GoogleSignin.getTokens();

      //TODO: FOR ADD MULTIPLE NETWORKS IT'S REQUIERED USE BACKEND FOR MULTIPLE MANAGMENT REFRESH TOKEN, IN THIS 1rst VERSION i will use a native refresh
      /*
        CHANGE: TO BETTER DINAMIC HANDLER NO FUKING THIS 
      */
      this.token = accessToken;

      storage.set(
        "STORAGE::ADMOB",
        JSON.stringify([
          {
            id: GoogleSignin.getCurrentUser()?.user.id ?? "",
            token: accessToken,
          },
        ])
      );
      return this.fetch(url, options);
    }
    /*
      TODO: On Token Expired refresh Token
    */
    const jsonResult = await result.json();
    return jsonResult;
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
    console;
    return await Promise.all(
      apps.map(
        async ({
          platform,
          appId,
          linkedAppInfo,
          manualAppInfo: { displayName },
        }) => ({
          id: appId,
          name: linkedAppInfo?.displayName ?? displayName,
          icon: linkedAppInfo?.appStoreId
            ? await this.getIconById(linkedAppInfo.appStoreId, platform)
            : "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
          platform: platform,
        })
      )
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

  public async getAnalytics({
    startDate,
    endDate,
    accountId,
  }: {
    startDate: Date;
    endDate: Date;
    accountId: string;
  }): Promise<GlobalAnalytics> {
    const data = await this.fetch<MoneAnaylytics[]>(
      `accounts/${accountId}/networkReport:generate`,
      {
        method: "POST",
        body: {
          reportSpec: {
            dateRange: {
              startDate: {
                year: startDate.getFullYear(),
                month: startDate.getMonth() + 1,
                day: startDate.getDate(),
              },
              endDate: {
                year: endDate.getFullYear(),
                month: endDate.getMonth() + 1,
                day: endDate.getDate(),
              },
            },
            dimensions: ["APP" /*", DATE", "PLATFORM", "COUNTRY"*/], //Filtar solo por lo que se necesita, si es plataforma, si es country, por fecha etc
            metrics: [
              "ESTIMATED_EARNINGS",
              "AD_REQUESTS",
              // "MATCHED_REQUESTS",
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
      currencyCode: header.localizationSettings.currencyCode,
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

      analytics.app.push({
        id,
        totalAdRequest,
        totalEarnings,
        totalImpressions,
      });
    });

    return analytics;
  }

  public async getIconById(id: string, platform: string): Promise<string> {
    if (platform !== "ANDROID") {
      return "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png";
    }
    const response = await fetch(
      `https://play.google.com/store/apps/details?id=${id}`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
      }
    );
    const html = await response.text();
    const iconMetaMatch = html.match(
      /<meta property="og:image" content="([^"]+)"/
    );
    const iconMeta = iconMetaMatch ? iconMetaMatch[1] : "";

    return iconMeta;
  }
}

export default AdMobRepository;
