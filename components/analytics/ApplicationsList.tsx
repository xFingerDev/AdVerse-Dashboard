import { View, Card, Text } from "react-native-ui-lib";
import { Image, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { currencySymbols } from "@/constants/CurrencySymbols";
import {
  AnalyticType,
  AplicationAnalytic,
} from "@/repository/INetworkAnalytic";
import { useTranslation } from "react-i18next";
import { formatNumericAbbreviation } from "@/utils/formatConcurency";
import { router } from "expo-router";

type ApplicationsListProps = {
  analytics: AplicationAnalytic[] | null;
  analyticType: AnalyticType;
};

type ApplicationsCardProps = {
  title: string;
  content: string;
};

const ApplicationsCard: React.FC<ApplicationsCardProps> = ({
  title,
  content,
}) => {
  return (
    <View center marginR-16>
      <Text text70 grey30>
        {title}
      </Text>
      <Text text60BO>{content}</Text>
    </View>
  );
};

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  analytics,
  analyticType,
}) => {
  const { t } = useTranslation();

  return (
    <View>
      {analytics
        ?.sort((a, b) => b.totalEarnings - a.totalEarnings)
        .map((app, index) => (
          <Animated.View key={index} entering={FadeIn.delay(index * 100)}>
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
              onPress={() => {
                router.push({
                  pathname: "/(modals)/appDetail",
                  params: {
                    appId: app.id,
                    analyticType: analyticType,
                  },
                });
              }}
            >
              <View row>
                <Image
                  source={{ uri: app.icon }}
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: 16,
                    borderRadius: 10,
                  }}
                />
                <View flex-1>
                  <Text text60BO numberOfLines={1} ellipsizeMode="tail">
                    {app.name}
                  </Text>
                  <Text
                    grey30
                    text90L
                    marginB-8
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {`${app.platform} | ${app.id}`}
                  </Text>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View row spread marginT-8>
                  <ApplicationsCard
                    title={t("analytics.summary.earnings")}
                    content={`${
                      currencySymbols?.[
                        app.currencyCode as keyof typeof currencySymbols
                      ] ?? "$"
                    }${formatNumericAbbreviation(app.totalEarnings / 100)}`}
                  />

                  <ApplicationsCard
                    title={t("analytics.summary.impressions")}
                    content={`${formatNumericAbbreviation(
                      app.totalImpressions,
                      false
                    )}`}
                  />

                  <ApplicationsCard
                    title={t("analytics.summary.adRequests")}
                    content={`${formatNumericAbbreviation(
                      app.totalAdRequest,
                      false
                    )}`}
                  />

                  <ApplicationsCard
                    title={t("analytics.summary.eCPM")}
                    content={`${
                      isNaN(app.totalEarnings / app.totalImpressions)
                        ? 0
                        : formatNumericAbbreviation(
                            app.totalEarnings / app.totalImpressions
                          )
                    }`}
                  />
                </View>
              </ScrollView>
            </Card>
          </Animated.View>
        ))}
    </View>
  );
};

export default ApplicationsList;
