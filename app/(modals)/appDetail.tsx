import { RefreshControl, SafeAreaView, ScrollView } from "react-native";

import AnalyticsFilter from "@/components/analytics/AnalyticsFilter";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import { ApplicationsDetail } from "@/components/analytics/ApplicationCard";
import { currencySymbols } from "@/constants/CurrencySymbols";
import { useAdNetworkManager } from "@/contexts/AdNetworkManagerContext";
import { AppAnalytics } from "@/repository/IAdNetworkRepository";
import { IApp } from "@/repository/INetwork";
import { AnalyticType, parseAnalyticType } from "@/repository/INetworkAnalytic";
import { formatNumericAbbreviation } from "@/utils/formatConcurency";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Animated, { FadeIn } from "react-native-reanimated";
import { Card, Text, View } from "react-native-ui-lib";

const AnalyticsApps: React.FC<{
  app: AppAnalytics | null;
}> = ({ app }) => {
  if (!app) return null;

  const countryData = app.analytics.reduce((acc, item) => {
    if (!acc[item.country]) {
      acc[item.country] = {
        earnings: 0,
        impressions: 0,
        requests: 0,
        date: item.date.toString(),
      };
    }
    acc[item.country].earnings += item.totalEarnings;
    acc[item.country].impressions += item.totalImpressions;
    acc[item.country].requests += item.totalAdRequest;
    return acc;
  }, {} as Record<string, { earnings: number; impressions: number; requests: number; date: string }>);

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const sortedCountries = Object.entries(countryData)
    .sort(([, a], [, b]) => b.earnings - a.earnings)
    .slice(0, 5);

  const currentSymbol =
    currencySymbols?.[app.currencyCode as keyof typeof currencySymbols] ?? "";

  return (
    <View margin-16>
      <Text
        text40BO
        marginV-16
        marginL-4
        color="black"
        style={{ fontWeight: "bold" }}
      >
        {t("analytics.countries.title")}
      </Text>

      {sortedCountries.map(([country, data]) => (
        <Animated.View key={country} entering={FadeIn}>
          <Card
            padding-16
            marginB-16
            style={{
              elevation: 4,
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 4,
            }}
          >
            <View row spread centerV>
              <View row centerV>
                <Text text60BO marginR-8>
                  {getCountryFlag(country)}
                </Text>
                <Text text60BO>
                  {Intl.DisplayNames
                    ? new Intl.DisplayNames(["en"], { type: "region" }).of(
                        country
                      ) || country
                    : country}
                </Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View row marginT-16 spread>
                <ApplicationsDetail
                  title={t("analytics.summary.earnings")}
                  content={`${currentSymbol ?? "$"}${formatNumericAbbreviation(
                    data.earnings
                  )}`}
                />
                <ApplicationsDetail
                  title={t("analytics.summary.impressions")}
                  content={formatNumericAbbreviation(data.impressions, false)}
                />

                <ApplicationsDetail
                  title={t("analytics.summary.adRequests")}
                  content={formatNumericAbbreviation(data.requests, false)}
                />
                <ApplicationsDetail
                  title={t("analytics.summary.eCPM")}
                  content={`${formatNumericAbbreviation(
                    (data.earnings / data.impressions) * 10
                  )}`}
                />
              </View>
            </ScrollView>
          </Card>
        </Animated.View>
      ))}
    </View>
  );
};

export default function AppDetail() {
  const { appId, analyticType } = useLocalSearchParams();
  const adNetworkManager = useAdNetworkManager();

  const [rangeDay, setRangeDays] = useState<AnalyticType>(() =>
    parseAnalyticType(analyticType?.toString())
  );

  const [appData, setAppData] = useState<IApp | null>(null);
  const [appAnalytics, setAppAnalytics] = useState<AppAnalytics | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    await adNetworkManager
      .getAplicationAnalyticsById(rangeDay, appId.toString())
      .then((data) => setAppAnalytics(data))
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    if (!appId) {
      router.back();
    }
    setAppData(adNetworkManager.getAplicationDataById(appId.toString()));
  }, [appId]);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [rangeDay])
  );

  const router = useRouter();

  const { t } = useTranslation();

  if (!appData) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View center>
          <Text>No data available</Text>
        </View>
      </SafeAreaView>
    );
  }

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

          <View flex>
            <Text
              marginL-5
              text40BO
              color="black"
              style={{ fontWeight: "bold" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {appData.name}
            </Text>
          </View>
        </View>

        <AnalyticsFilter rangeDay={rangeDay} setRangeDays={setRangeDays} />
        <View margin-16>
          <AnalyticsSummary
            currencyCode={appAnalytics?.currencyCode ?? ""}
            totalEarnings={
              appAnalytics?.analytics.reduce(
                (acc, app) => acc + app.totalEarnings,
                0
              ) ?? 0
            }
            totalImpressions={
              appAnalytics?.analytics.reduce(
                (acc, app) => acc + app.totalImpressions,
                0
              ) ?? 0
            }
            totalAdRequests={
              appAnalytics?.analytics.reduce(
                (acc, app) => acc + app.totalAdRequest,
                0
              ) ?? 0
            }
          />
        </View>
        <AnalyticsApps app={appAnalytics} />
      </ScrollView>
    </SafeAreaView>
  );
}
