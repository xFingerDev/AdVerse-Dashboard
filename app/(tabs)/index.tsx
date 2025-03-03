import React, { useCallback, useEffect, useState } from "react";

import { useAdNetworkManager } from "@/contexts/AdNetworkManagerContext";

import { useTranslation } from "react-i18next";
import { Text, View } from "react-native-ui-lib";
import { RefreshControl, SafeAreaView, ScrollView } from "react-native";
import {
  AnalyticType,
  AplicationAnalytic,
} from "@/repository/INetworkAnalytic";
import AnalyticsFilter from "@/components/analytics/AnalyticsFilter";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import ApplicationsList from "@/components/analytics/ApplicationsList";
import { useFocusEffect } from "expo-router";

export default function TabOneScreen() {
  const adNetworkManager = useAdNetworkManager();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [rangeDay, setRangeDays] = useState<AnalyticType>(AnalyticType.today);
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
          <AnalyticsSummary analytics={analytics} />
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
          <ApplicationsList analytics={analytics} analyticType={rangeDay} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
