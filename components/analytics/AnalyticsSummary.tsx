import { currencySymbols } from "@/constants/CurrencySymbols";
import { formatNumericAbbreviation } from "@/utils/formatConcurency";
import { useTranslation } from "react-i18next";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Card, Colors, Text, View } from "react-native-ui-lib";

type AnalyticsSummaryProps = {
  totalEarnings: number;
  totalImpressions: number;
  totalAdRequests: number;
  currencyCode: string;
};

type AnalyticsCardProps = {
  title: string;
  content: string;
  color?: string;
};

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  content,
  color,
}) => {
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
      <Text
        text50BO
        color={color ?? "#ec85c7"}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {content}
      </Text>
      <Text text80 color={Colors.grey40} adjustsFontSizeToFit numberOfLines={1}>
        {title}
      </Text>
    </Card>
  );
};

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({
  totalAdRequests,
  totalImpressions,
  totalEarnings,
  currencyCode,
}) => {
  const { t } = useTranslation();

  const eCPM =
    totalImpressions > 0
      ? ((totalEarnings / totalImpressions) * 1000).toFixed(2)
      : 0;

  const currentSymbol =
    currencySymbols?.[currencyCode as keyof typeof currencySymbols] ?? "";

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <View row spread>
        <AnalyticsCard
          color={Colors.green20}
          title={t("analytics.summary.earnings")}
          content={`${currentSymbol}${formatNumericAbbreviation(
            totalEarnings
          )}`}
        />

        <AnalyticsCard
          color={Colors.cyan20}
          title={t("analytics.summary.impressions")}
          content={`${formatNumericAbbreviation(totalImpressions, false)}`}
        />
        <AnalyticsCard
          color={Colors.yellow20}
          title={t("analytics.summary.adRequests")}
          content={`${formatNumericAbbreviation(totalAdRequests, false)}`}
        />
        <AnalyticsCard
          color={Colors.purple20}
          title={t("analytics.summary.eCPM")}
          content={`${eCPM}`}
        />
      </View>
    </Animated.View>
  );
};

export default AnalyticsSummary;
