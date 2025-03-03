import { View, Card, Text } from "react-native-ui-lib";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { currencySymbols } from "@/constants/CurrencySymbols";
import { AplicationAnalytic } from "@/repository/INetworkAnalytic";
import { useTranslation } from "react-i18next";

type AnalyticsSummaryProps = {
  analytics: AplicationAnalytic[] | null;
};

type AnalyticsCardProps = {
  title: string;
  content: string;
};

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, content }) => {
  return (
    <Card
      center
      flex-1
      marginH-4
      padding-10
      style={{
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
      }}
    >
      <Text text40BO green600 adjustsFontSizeToFit numberOfLines={1}>
        {content}
      </Text>
      <Text text80L grey30 adjustsFontSizeToFit numberOfLines={1}>
        {title}
      </Text>
    </Card>
  );
};

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ analytics }) => {
  const { t } = useTranslation();

  const totalEarnings = analytics
    ? analytics.reduce((acc, app) => acc + app.totalEarnings, 0) / 100
    : 0;
  const totalImpressions = analytics
    ? analytics.reduce((acc, app) => acc + app.totalImpressions, 0)
    : 0;
  const totalAdRequests = analytics
    ? analytics.reduce((acc, app) => acc + app.totalAdRequest, 0)
    : 0;
  const eCPM =
    totalImpressions > 0
      ? ((totalEarnings / totalImpressions) * 1000).toFixed(2)
      : "0.00";

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <View row spread>
        <AnalyticsCard
          title={t("analytics.summary.earnings")}
          content={`${
            currencySymbols?.[
              analytics?.[0]?.currencyCode as keyof typeof currencySymbols
            ] ?? ""
          }${totalEarnings.toFixed(2)}`}
        />

        <AnalyticsCard
          title={t("analytics.summary.impressions")}
          content={`${totalImpressions}`}
        />
        <AnalyticsCard
          title={t("analytics.summary.adRequests")}
          content={`${totalAdRequests}`}
        />
        <AnalyticsCard
          title={t("analytics.summary.eCPM")}
          content={`${eCPM}`}
        />
      </View>
    </Animated.View>
  );
};

export default AnalyticsSummary;
