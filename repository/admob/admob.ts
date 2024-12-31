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
    }
  ): Promise<T> {
    const result = await fetch(`${this.URL_ADMOB}${url}`, {
      method: options?.method ?? "GET",
      headers: {
        Authorization: "Bearer " + this.token,
      },
    });

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
        name: string;
        appId: string;
      }[];
    }>(`accounts/${accountId}/apps`);

    return apps.map(({ appId, name }) => ({
      id: appId,
      name: name,
    }));
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
}

export default AdMobRepository;
