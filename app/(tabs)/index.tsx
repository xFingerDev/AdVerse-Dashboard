import React, { useContext, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { useAdNetworkManager } from "@/contexts/AdNetworkManagerContext";
import { useFocusEffect } from "expo-router";
import { GlobalAnalytics } from "@/repository/IAdNetwork";
import { currencySymbols } from "@/constants/CurrencySymbols";
import { useTranslation } from "react-i18next";

export default function TabOneScreen() {
  const adNetworkManager = useAdNetworkManager();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<GlobalAnalytics | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const accounts = await adNetworkManager.networks?.[0]
        .getAnalytics("pub-4713105116292090")
        .catch((err) => null);
      accounts && setAnalytics(accounts);
    } catch (err) {}

    setRefreshing(false);
  };

  useFocusEffect(() => {
    (async () => {
      if (analytics || refreshing) return;
      setRefreshing(true);
      console.log("Refresh Default");
      try {
        const accounts = await adNetworkManager.networks?.[0]
          .getAnalytics("pub-4713105116292090")
          .then((data) => setAnalytics(data))
          .catch((err) => null);
      } catch (err) {}

      console.log("Refresh Default End");

      setRefreshing(false);
    })();
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4CAF50", "#388E3C"]}
            tintColor="#388E3C"
          />
        }
      >
        <View className="p-4">
          {/* Total Metrics */}
          <View className="flex-row justify-between">
            <View className="mb-4 flex-1 mr-2">
              <Text className="text-lg font-semibold  mb-2">Earnings</Text>
              <Text className="text-2xl font-bold text-green-600">
                {currencySymbols?.[
                  (analytics?.currencyCode as keyof typeof currencySymbols) ??
                    "USD"
                ] ?? "$"}
                {analytics?.totalEarnings
                  ? (analytics.totalEarnings / 100).toFixed(2)
                  : 0}
              </Text>
            </View>
            <View className="mb-4 flex-1 mx-2">
              <Text className="text-lg font-semibold mb-2">Impressions</Text>
              <Text className="text-2xl font-bold text-green-600">
                {analytics?.totalImpressions ?? 0}
              </Text>
            </View>
            <View className=" mb-4 flex-1 ml-2">
              <Text className="text-lg font-semibold  mb-2">Ad Requests</Text>
              <Text className="text-2xl font-bold text-green-600">
                {analytics?.totalAdRequest ?? 0}
              </Text>
            </View>
          </View>

          {/* Applications Section */}
          <Text className="text-xl font-bold  my-4">Applications</Text>
          <View className="mb-16">
            {analytics?.app?.map((app, index) => (
              <View
                key={index}
                className=" p-4 rounded-lg mb-4 border border-gray-300"
              >
                <Text className="text-lg font-semibold mb-2">
                  Application: {app.id}
                </Text>
                <Text className="text-base mb-1">
                  Earnings:{" "}
                  {currencySymbols?.[
                    (analytics?.currencyCode as keyof typeof currencySymbols) ??
                      "USD"
                  ] ?? "$"}
                  {(app.totalEarnings / 100).toFixed(2)}
                </Text>
                <Text className="text-base  mb-1">
                  Impressions: {app.totalImpressions}
                </Text>
                <Text className="text-basemb-1">
                  Ad Requests: {app.totalAdRequest}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
