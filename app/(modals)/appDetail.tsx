import { SafeAreaView, ScrollView } from "react-native";

import AnalyticsFilter from "@/components/analytics/AnalyticsFilter";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import { useAdNetworkManager } from "@/contexts/AdNetworkManagerContext";
import { AnalyticType, parseAnalyticType } from "@/repository/INetworkAnalytic";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native-ui-lib";

export default function AppDetail() {
  const { appId, analyticType } = useLocalSearchParams();
  const adNetworkManager = useAdNetworkManager();

  const [rangeDay, setRangeDays] = useState<AnalyticType>(() =>
    parseAnalyticType(analyticType?.toString())
  );

  const [appData] = useState(() =>
    adNetworkManager.getAplicationDataById(appId.toString())
  );

  useEffect(() => {
    if (!appData) {
      router.back();
    }
  }, [appId]);

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
        <View row marginV-16 marginL-20 centerV>
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

        <AnalyticsFilter rangeDay={rangeDay} setRangeDays={setRangeDays} />
        <View margin-16>
          <AnalyticsSummary analytics={null}></AnalyticsSummary>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
