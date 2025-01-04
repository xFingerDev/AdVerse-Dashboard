import { useNavigation } from "expo-router";
import { Text, View, Button } from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AdMobRepository from "@/repository/admob/admob";
import AdNetworkManager from "@/repository/AdNetworkManager";

export default function SettingsScreen() {
  const navigation = useNavigation();

  const handleRemoveAds = async () => {
    try {
      const ddd = await GoogleSignin.hasPlayServices();
      //console.log(ddd);
      //await GoogleSignin.signOut();
      //await GoogleSignin.revokeAccess();
      console.log("0");
      console.log({
        data: GoogleSignin.hasPreviousSignIn(),
      });
      //if (!GoogleSignin.()) {
      console.log("1");

      await GoogleSignin.signIn();
      // const user = await GoogleSignin.getCurrentUser();
      // }
      console.log();
      //  console.log({ user });
      //const userInfo = await GoogleSignin.signInSilently();
      //const userInfo = await GoogleSignin.signIn();
      //console.log(userInfo);
      // userInfo.data?.idToken;

      //GAY:https://developers.google.com/oauthplayground/
      //const user = await GoogleSignin.getCurrentUser();
      // console.log({ user });
      const token = await GoogleSignin.getTokens();

      /*
      Hanndle token and save it to Secure AsyncStorage
      */
      //await GoogleSignin.signOut(); //TODO: ON SAVE TOKEN SIGNOUT FOR ADD FUTURE LOGINS

      // GoogleSignin.getTokens;
      //console.log(token.accessToken);
      //console.log({ token });

      const sss = new AdMobRepository(token.accessToken);
      AdNetworkManager.addNetwork(sss);
      const accounts = await sss.getListAccounts();

      await sss.getAnalytics(accounts[0].accountId);

      // const sss = new AdMobRepository(token.accessToken);
      //console.log("1");
      //console.log({ accounts });
      //const apps = await sss.getListApp(accounts[0].accountId);
      //console.log({ apps });
    } catch (error: any) {
      console.log({
        statusCodes,
      });
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
    // Logic to remove ads
  };

  // Logic to manage services

  const handleOpenGitHub = () => {
    // Logic to open GitHub
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-lg font-bold mb-4">Settings</Text>

      <Button title="Remove Ads" onPress={handleRemoveAds} />

      {/*  <Button
        title="Manage Services"
        onPress={handleManageServices}
        className="mb-4"
      />

      <View className="flex-1 justify-end">
        <Button title="GitHub" onPress={handleOpenGitHub} />
      </View>
      <Button
        title="Remove Ads"
        onPress={handleRemoveAds}
        style={{ marginBottom: 16 }}
      />

      <Button
        title="Manage Services"
        onPress={handleManageServices}
        style={{ marginBottom: 16 }}
      />*/}
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Button title="GitHub" onPress={handleOpenGitHub} />
      </View>
    </View>
  );
}
