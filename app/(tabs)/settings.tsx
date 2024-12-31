import { useNavigation } from "expo-router";
import { Text, View, Button } from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

export default function SettingsScreen() {
  const navigation = useNavigation();

  const handleRemoveAds = async () => {
    try {
      const ddd = await GoogleSignin.hasPlayServices();
      console.log(ddd);
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      userInfo.data?.idToken;

      //GAY:https://developers.google.com/oauthplayground/
      //const user = await GoogleSignin.getCurrentUser();
      // console.log({ user });
      const token = await GoogleSignin.getTokens();
      console.log(token.accessToken);
      const accounts = await fetch("https://admob.googleapis.com/v1/accounts", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      });

      const publishers: {
        account: {
          currencyCode: string;
          name: string;
          publisherId: string;
          reportingTimeZone: string;
        }[];
      } = await accounts.json();

      const accounts2 = await fetch(
        `https://admob.googleapis.com/v1/${publishers.account[0].name}/apps`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        }
      );

      const adsApps: {
        apps: {
          platform: "ANDROID" | "IOS";
          manualAppInfo: {
            displayName: string;
          };
          appApprovalState: "ACTION_REQUIRED" | "APPROVED";
          name: string;
          appId: string;
        }[];
      } = await accounts2.json();
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
