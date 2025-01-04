import { IAdNetwork } from "@/repository/IAdNetwork";

export type App = {
  id: string;
  name: string;
};

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

  public async getListAccounts(): Promise<
    {
      accountId: string;
      timeZone: string;
    }[]
  > {
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

  public async getAnalytics(accountId: string) {
    const data = await this.fetch<{}>(
      `accounts/${accountId}/networkReport:generate`,
      {
        method: "POST",
        body: {
          reportSpec: {
            dateRange: {
              startDate: {
                year: 2025,
                month: 1,
                day: 1,
              },
              endDate: {
                year: 2025,
                month: 1,
                day: 1,
              },
            },
            dimensions: ["DATE", "APP" /*, "PLATFORM", "COUNTRY"*/], //Filtar solo por lo que se necesita, si es plataforma, si es country, por fecha etc
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

    console.log(JSON.stringify(data));
  }
}

export default AdMobRepository;
