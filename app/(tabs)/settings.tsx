import Constants from "expo-constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, SafeAreaView, ScrollView } from "react-native";
import { Card, Colors as ColorsRUI, Text, View } from "react-native-ui-lib";

import BottonSheet from "@/components/settings/BottonSheet";
import CustomCardButton from "@/components/settings/CustomCardButton";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [visibleDonation, setVisibleDonation] = useState(false);

  const handleOpenUrl = (content: string) => {
    Linking.openURL(content);
  };

  const AboutModal = () => {
    return (
      <Card
        marginT-16
        style={{
          elevation: 4,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 4,
        }}
      >
        <Card.Section
          content={[
            { text: t("settings.about.title"), text60: true, grey10: true },
          ]}
          padding-20
        />
        <View paddingH-16 paddingB-16>
          <CustomCardButton
            label={t("settings.buttons.donation")}
            iconName={"gift-outline"}
            iconColor={ColorsRUI.grey20}
            disabled={visibleDonation}
            onPress={() => setVisibleDonation(true)}
          />

          <CustomCardButton
            label={"GitHub"}
            iconName={"logo-github"}
            textColor="white"
            iconColor="white"
            cardStyle={{ backgroundColor: "#333" }}
            onPress={() =>
              handleOpenUrl("https://github.com/xFingerDev/AdVerse-Dashboard")
            }
          />

          <CustomCardButton
            label={"Discord"}
            iconName={"logo-discord"}
            textColor="white"
            iconColor="white"
            cardStyle={{ backgroundColor: "#7289da" }}
            onPress={() => handleOpenUrl("https://discord.gg/88UqrH2QU9")}
          />
        </View>
      </Card>
    );
  };

  const GeneralModal = () => {
    return (
      <Card
        style={{
          elevation: 4,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 4,
        }}
      >
        <Card.Section
          padding-20
          content={[
            {
              text: t("settings.global.title"),
              text60: true,
              grey10: true,
            },
          ]}
        />
        <View paddingH-16 paddingB-16>
          <CustomCardButton
            label={t("settings.buttons.language")}
            iconName={"language-outline"}
            iconColor={ColorsRUI.grey20}
            onPress={() => {
              Alert.alert("Language", "Coming soon!");
            }}
          />

          <CustomCardButton
            label={t("settings.buttons.manageNetworks")}
            iconName={"globe-outline"}
            iconColor={ColorsRUI.grey20}
            onPress={
              () => {
                router.push("/(modals)/analyticsNetwork");
              } /*setVisibleAdNetworks(true)*/
            }
          />
        </View>
      </Card>
    );
  };

  const DonationSheet = () => {
    return (
      <BottonSheet
        isVisible={visibleDonation}
        onClose={function () {
          setVisibleDonation(false);
        }}
      >
        <View margin-16>
          <CustomCardButton
            label={"PayPal"}
            iconName={"logo-paypal"}
            iconColor={ColorsRUI.grey20}
            onPress={() =>
              handleOpenUrl(
                "https://www.paypal.com/donate/?hosted_button_id=7KVCPM9EJJBXW"
              )
            }
          />

          <CustomCardButton
            label={"Ko-fi"}
            iconName={"cafe-outline"}
            iconColor={ColorsRUI.grey20}
            onPress={() => handleOpenUrl("https://ko-fi.com/xfingerdev")}
          />

          <CustomCardButton
            label={t("settings.buttons.cancel")}
            textColor={ColorsRUI.red30}
            centerText={true}
            iconColor={ColorsRUI.grey20}
            onPress={() => setVisibleDonation(false)}
          />
        </View>
      </BottonSheet>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DonationSheet />

      <ScrollView>
        <Text
          text40BO
          marginT-16
          marginL-20
          color="black"
          style={{ fontWeight: "bold" }}
        >
          {t("settings.header.title")}
        </Text>
        <View margin-16>
          <GeneralModal />
          <AboutModal />
        </View>

        <Text text70 grey10 center marginB-16>
          {`${t("settings.version.title")} ${Constants.expoConfig?.version}`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
