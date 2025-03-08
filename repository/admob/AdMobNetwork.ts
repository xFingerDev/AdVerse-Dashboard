import { storage } from "@/storage/storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import { INetwork } from "../INetwork";
import { INetworkAnalytic } from "../INetworkAnalytic";
import { AdMobNetworkAnalytic } from "./AdMobNetworkAnalytic";
import AdMobRepository from "./AdMobRepository";

type StorageAdmobValue = {
  id: string;
  token: string;
};

export class AdMobNetwork implements INetwork {
  name: string;
  id: string;
  enabled: boolean;
  storageKey: string = "STORAGE::ADMOB::ACCOUNTS";

  constructor() {
    this.name = "Admob";
    this.id = "admob";
    this.enabled = true;
  }

  async newNetwork(): Promise<INetworkAnalytic> {
    try {
      const signIn = await GoogleSignin.signIn({});

      const { accessToken, idToken } = await GoogleSignin.getTokens();

      //TODO: FOR ADD MULTIPLE NETWORKS IT'S REQUIERED USE BACKEND FOR MULTIPLE MANAGMENT REFRESH TOKEN, IN THIS 1rst VERSION i will use a native refresh
      const userId = signIn.data?.user.id ?? "";

      if (!userId) {
        throw Alert.alert("AdVerse", "Coming Soon Multiple Accounts");
      }

      //   const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      //const user = auth().currentUser;
      //await GoogleSignin.signOut(); //TODO:HANDLE BACKEND FOR MULTI CLIENT
      const storageValue = storage.getString(this.storageKey);
      const repoStore: StorageAdmobValue[] = storageValue
        ? JSON.parse(storageValue)
        : [];

      if (repoStore.find((store) => store.id === userId)) {
        throw Alert.alert("AdVerse", "Coming Soon Multiple Accounts");
      }

      //if (!repoStore.find((store) => store.id === userId)) {
      storage.set(
        this.storageKey,
        JSON.stringify([
          // ...repoStore,
          {
            id: userId,
            token: accessToken,
          },
        ])
      );
      //}

      const admobRepo = new AdMobNetworkAnalytic(
        new AdMobRepository(accessToken),
        this
      );

      return admobRepo;
    } catch (error: any) {
      throw error;
    }
  }

  loadNetworks(): { networks: INetworkAnalytic[] } {
    const value = storage.getString(this.storageKey);
    const repoStore: StorageAdmobValue[] = value ? JSON.parse(value) : [];

    const networks = repoStore.map(({ token }) => {
      const repository = new AdMobRepository(token);
      return new AdMobNetworkAnalytic(repository, this);
    });

    return { networks };
  }

  removeNetwork(network: INetworkAnalytic) {
    storage.set(this.storageKey, JSON.stringify([]));
    GoogleSignin.signOut();
  }
}

export const adMobNetworkInstance = new AdMobNetwork();
