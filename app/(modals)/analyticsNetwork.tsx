import { SafeAreaView, ScrollView } from "react-native";

import BottonSheet from "@/components/settings/BottonSheet";
import CustomCardButton from "@/components/settings/CustomCardButton";
import { useAdNetworkManager } from "@/contexts/AdNetworkManagerContext";
import { INetworkAnalytic } from "@/repository/INetworkAnalytic";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Card, Colors, Text, View } from "react-native-ui-lib";

export default function AnalyticsNetwork() {
  const [visibleAdNetworks, setVisibleAdNetworks] = useState(false);
  const adNetworkManager = useAdNetworkManager();
  const { t } = useTranslation();
  const router = useRouter();

  const _refresh = () => {
    router.replace("./analyticsNetwork", {});
  };

  const [netWorkRefresh, setNetworkRefresh] = useState<string | null>(null);

  const sv = useSharedValue<number>(0);

  useEffect(() => {
    sv.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sv.value * 360}deg` }],
  }));

  const refreshNetwork = async (network: INetworkAnalytic) => {
    setNetworkRefresh(network.id);

    await adNetworkManager.refreshNetwork(network).catch((err) => {});
    _refresh();
  };

  const AddNewNetworkSheet = () => {
    return (
      <BottonSheet
        isVisible={visibleAdNetworks}
        onClose={function () {
          setVisibleAdNetworks(false);
        }}
      >
        <View margin-16>
          {adNetworkManager.availableNetworks().map((network) => {
            return (
              <CustomCardButton
                key={`add_netowrk_${network.id}`}
                label={network.name}
                iconName={"add-outline"}
                iconColor={Colors.grey20}
                disabled={!network.enabled}
                disabledTextColor="black"
                cardStyle={
                  network.enabled
                    ? undefined
                    : { backgroundColor: Colors.grey70 }
                }
                onPress={async () => {
                  const net = await network.newNetwork();
                  adNetworkManager.addNetwork(net);
                  setVisibleAdNetworks(false);
                  await refreshNetwork(net);
                }}
              />
            );
          })}
          <CustomCardButton
            label={t("settings.buttons.cancel")}
            textColor={Colors.red30}
            centerText={true}
            iconColor={Colors.grey20}
            onPress={() => setVisibleAdNetworks(false)}
          />
        </View>
      </BottonSheet>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AddNewNetworkSheet />
      <ScrollView>
        <View row marginT-16 marginL-20 centerV>
          <Ionicons
            name="chevron-back-outline"
            size={24}
            color="black"
            style={{ fontWeight: "bold" }}
            onPress={() => {
              router.back();
            }}
          />
          <Text marginL-5 text40BO color="black" style={{ fontWeight: "bold" }}>
            {t("networks.manage.header.title")}
          </Text>
        </View>

        <View margin-16>
          {adNetworkManager.loadedNetworks().length === 0 && (
            <View center marginV-32>
              <Ionicons name="apps-outline" size={48} color={Colors.grey40} />
              <Text text70 grey40 marginT-8>
                {t("networks.manage.empty")}
              </Text>
            </View>
          )}

          {adNetworkManager.loadedNetworks().map((network) => {
            return (
              <Card
                key={network.network.id}
                marginB-10
                activeOpacity={0.8}
                style={[
                  {
                    elevation: 4,
                    shadowColor: "#000",
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: 4 },
                    shadowRadius: 4,
                  },
                ]}
              >
                <View row padding-20 paddingB-0 spread>
                  <Card.Section
                    content={[
                      {
                        text: network.network.name,
                        text60: true,
                        grey10: true,
                      },
                    ]}
                  />
                  <View row marginL-10>
                    <Animated.View
                      style={[
                        network.id === netWorkRefresh ? animatedStyle : {},
                        { alignItems: "center", marginRight: 10 },
                      ]}
                    >
                      <Ionicons
                        name="refresh-outline"
                        size={24}
                        color={netWorkRefresh ? Colors.grey50 : Colors.grey20}
                        onPress={async () => {
                          await refreshNetwork(network);
                        }}
                        disabled={!!netWorkRefresh}
                      />
                    </Animated.View>

                    <Ionicons
                      name="trash-outline"
                      size={24}
                      color={netWorkRefresh ? Colors.grey50 : Colors.grey20}
                      disabled={!!netWorkRefresh}
                      onPress={() => {
                        adNetworkManager.removeNetwork(network);
                        _refresh();
                      }}
                    />
                  </View>
                </View>

                <View padding-16>
                  {network.getApps().length === 0 && (
                    <View
                      row
                      centerV
                      marginB-4
                      style={{
                        backgroundColor: Colors.grey70,
                        padding: 16,
                        borderRadius: 12,
                        opacity: 0.8,
                      }}
                    >
                      <Ionicons
                        name="information-circle-outline"
                        size={32}
                        color={Colors.grey40}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        grey40
                        style={{
                          fontSize: 16,
                          fontWeight: "500",
                        }}
                      >
                        {t("networks.manage.noApps")}
                      </Text>
                    </View>
                  )}
                  {network.getApps().map((app) => (
                    <View row centerV marginB-4 key={app.id}>
                      <Image
                        source={{ uri: app.icon }}
                        style={{
                          width: 40,
                          height: 40,
                          marginRight: 16,
                          borderRadius: 10,
                        }}
                      />
                      <Text marginL-4>{app.name}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            );
          })}

          {
            <CustomCardButton
              key={`add_netowrk`}
              label={t("networks.manage.buttons.add")}
              textColor={Colors.blue30}
              centerText={true}
              iconColor={Colors.grey20}
              disabled={visibleAdNetworks}
              onPress={() => setVisibleAdNetworks(true)}
            />
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
