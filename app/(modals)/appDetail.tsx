import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, ScrollView, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { useEffect, useState } from "react";
import BottonSheet from "@/components/settings/BottonSheet";
import CustomCardButton from "@/components/settings/CustomCardButton";
import { Card, Colors, Text, View } from "react-native-ui-lib";
import { useAdNetworkManager } from "@/contexts/AdNetworkManagerContext";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import { use } from "i18next";
import { INetwork } from "@/repository/INetwork";
import { INetworkAnalytic } from "@/repository/INetworkAnalytic";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";

export default function AppDetail() {
  const { appId, analyticType } = useLocalSearchParams();
  const adNetworkManager = useAdNetworkManager();

  const [appData] = useState(() =>
    adNetworkManager.getAplicationDataById(appId.toString())
  );

  useEffect(() => {
    if (!appData) {
      router.back();
    }
  }, [appId]);

  console.log({ appId, analyticType });
  const router = useRouter();

  const { t } = useTranslation();

  if (!appData) {
    return (
      <View center>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
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

          <Text
            marginL-5
            text40BO
            color="black"
            style={{ fontWeight: "bold" }}
            ellipsizeMode="tail"
          >
            {appData.name}
          </Text>
        </View>

        <View margin-16>
          <Card>
            <View padding-16>
              <View row centerV>
                <Image
                  source={{ uri: appData.icon }}
                  style={{ width: 50, height: 50, borderRadius: 10 }}
                />
                <View marginL-16>
                  <View marginT-16>
                    <Text text70>
                      Platform:{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {appData.platform}
                      </Text>
                    </Text>

                    <Text text70 marginT-8>
                      Created:{" "}
                      <Text style={{ fontWeight: "bold" }}>{appData.id}</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
