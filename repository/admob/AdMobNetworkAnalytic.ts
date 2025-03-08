import { storage } from "@/storage/storage";
import {
  AccountNetwork,
  GlobalAnalytics,
  IAdNetworkRepository,
} from "../IAdNetworkRepository";
import { IApp, INetwork } from "../INetwork";
import { AplicationAnalytic, INetworkAnalytic } from "../INetworkAnalytic";

export class AdMobNetworkAnalytic implements INetworkAnalytic {
  storageAPPSKey: string = "STORAGE::ADMOB::APPS";
  apps: IApp[] /*| null*/ = [];
  accounts: AccountNetwork[] = [];
  id: string;
  constructor(
    private repository: IAdNetworkRepository,
    public network: INetwork
  ) {
    this.id = Math.random().toString(36).substring(7);
  }
  getApps(): IApp[] {
    return this.apps ?? [];
  }

  async refresh(force: boolean = false) {
    if (!force && this.accounts.length) return;

    if (!force) {
      const appsSaved = await storage.getString(this.storageAPPSKey);
      if (appsSaved) {
        const { apps, accounts } = JSON.parse(appsSaved);
        this.apps = apps;
        this.accounts = accounts;
        return;
      }
    }

    this.accounts = await this.repository.getListAccounts();
    let promises: Promise<any>[] = [];

    this.apps = [];

    this.accounts.forEach((account) => {
      if (!this.apps.length)
        promises.push(
          this.repository
            .getListApp(account.accountId)
            .then((data) => (this.apps = data))
        );
    });

    await Promise.all(promises);

    storage.set(
      this.storageAPPSKey,
      JSON.stringify({ apps: this.apps, accounts: this.accounts })
    );
  }

  async getListAnalytics({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }): Promise<AplicationAnalytic[]> {
    if (!this.accounts.length) {
      await this.refresh();
    }

    let promises: Promise<any>[] = [];

    let analytics: GlobalAnalytics[] = [];
    this.accounts.forEach((account) => {
      promises.push(
        this.repository
          .getAnalytics({ accountId: account.accountId, startDate, endDate })
          .then((data) => analytics.push(data))
      );
    });

    try {
      await Promise.all(promises);
    } catch (err) {}

    return analytics
      .map((analitic) =>
        analitic.app.map((app) => {
          const iApp = this.getApps().find((a) => a.id === app.id);
          return {
            icon: iApp?.icon ?? "",
            id: app.id,
            platform: iApp?.platform ?? "UNKNOWN",
            name: iApp?.name ?? app.id,
            currencyCode: analitic.currencyCode,
            totalAdRequest: app.totalAdRequest,
            totalEarnings: app.totalEarnings,
            totalImpressions: app.totalImpressions,
          };
        })
      )
      .flat();
  }
}
