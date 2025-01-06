import React, { useContext, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { AdNetworkManagerContext } from "@/contexts/AdNetworkManagerContext";
import { useFocusEffect } from "expo-router";
import { GlobalAnalytics } from "@/repository/IAdNetwork";
import { currencySymbols } from "@/constants/CurrencySymbols";

export default function TabOneScreen() {
  const adNetworkManager = useContext(AdNetworkManagerContext);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<GlobalAnalytics | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    const accounts = await adNetworkManager?.networks?.[0].getAnalytics(
      "pub-4713105116292090"
    );
    accounts && setAnalytics(accounts);
    setRefreshing(false);
  };

  useFocusEffect(() => {
    (async () => {
      if (analytics) return;
      const accounts = await adNetworkManager?.networks?.[0]
        .getAnalytics("pub-4713105116292090")
        .then((data) => setAnalytics(data));
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
