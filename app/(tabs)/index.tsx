import { useAdNetworkManager } from "@/contexts/AdNetworkManagerContext";
import React, { useCallback, useState } from "react";

import AnalyticsEmpty from "@/components/analytics/AnalyticsEmpty";
import AnalyticsFilter from "@/components/analytics/AnalyticsFilter";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import ApplicationsList from "@/components/analytics/ApplicationsList";
import {
  AnalyticType,
  AnalyticTypeEnum,
  AplicationAnalytic,
} from "@/repository/INetworkAnalytic";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { RefreshControl, SafeAreaView, ScrollView } from "react-native";
import { Text, View } from "react-native-ui-lib";

export default function TabOneScreen() {
  const adNetworkManager = useAdNetworkManager();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [rangeDay, setRangeDays] = useState<AnalyticType>(
    AnalyticTypeEnum.today
  );
  const [analytics, setAnalytics] = useState<AplicationAnalytic[] | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);

    await adNetworkManager
      .getAnalyticList(rangeDay)
      .then((data) => {
        setAnalytics(data);
      })
      .catch((err) => null)
      .finally(() => setRefreshing(false));
  };

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [rangeDay])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ec85c7", "#ec85c7"]}
            tintColor="#ec85c7"
          />
        }
      >
        <Text
          text40BO
          marginV-16
          color="black"
          marginL-20
          style={{ fontWeight: "bold" }}
        >
          {t("analytics.header.title")}
        </Text>
        <AnalyticsFilter rangeDay={rangeDay} setRangeDays={setRangeDays} />

        <View margin-16>
          <AnalyticsSummary
            totalAdRequests={
              analytics
                ? analytics.reduce((acc, app) => acc + app.totalAdRequest, 0)
                : 0
            }
            totalEarnings={
              analytics
                ? analytics.reduce((acc, app) => acc + app.totalEarnings, 0) /
                  100
                : 0
            }
            totalImpressions={
              analytics
                ? analytics.reduce((acc, app) => acc + app.totalImpressions, 0)
                : 0
            }
            currencyCode={analytics?.[0].currencyCode ?? ""}
          />
          <Text
            text40BO
            marginV-16
            marginL-4
            color="black"
            marginT-30
            style={{ fontWeight: "bold" }}
          >
            {t("analytics.applications.title")}
          </Text>
          {!analytics?.length && <AnalyticsEmpty />}
          <ApplicationsList analytics={analytics} analyticType={rangeDay} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
