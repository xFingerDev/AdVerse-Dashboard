import { View, Card, Text } from "react-native-ui-lib";
import { Image, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { currencySymbols } from "@/constants/CurrencySymbols";
import { AplicationAnalytic } from "@/repository/INetworkAnalytic";
import { useTranslation } from "react-i18next";

type ApplicationsListProps = {
  analytics: AplicationAnalytic[] | null;
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

const ApplicationsList: React.FC<ApplicationsListProps> = ({ analytics }) => {
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
            >
              <View row>
                <Image
                  source={{ uri: app.icon }}
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 16,
                    borderRadius: 10,
                  }}
                />
                <View flex-1>
                  <Text text60BO numberOfLines={1} ellipsizeMode="tail">
                    {app.name}
                  </Text>
                  <Text grey30 marginB-8 numberOfLines={1} ellipsizeMode="tail">
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
                    }${(app.totalEarnings / 100).toFixed(2)}`}
                  />

                  <ApplicationsCard
                    title={t("analytics.summary.impressions")}
                    content={`${app.totalImpressions}`}
                  />

                  <ApplicationsCard
                    title={t("analytics.summary.adRequests")}
                    content={`${app.totalAdRequest}`}
                  />

                  <ApplicationsCard
                    title={t("analytics.summary.eCPM")}
                    content={
                      isNaN(app.totalEarnings / app.totalImpressions)
                        ? "0.00"
                        : (
                            (app.totalEarnings / app.totalImpressions) *
                            10
                          ).toFixed(2)
                    }
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
