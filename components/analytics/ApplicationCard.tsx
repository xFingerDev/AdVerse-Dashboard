import { currencySymbols } from "@/constants/CurrencySymbols";
import { AplicationAnalytic } from "@/repository/INetworkAnalytic";
import { formatNumericAbbreviation } from "@/utils/formatConcurency";
import { useTranslation } from "react-i18next";
import { Image, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Card, Text, View } from "react-native-ui-lib";

type ApplicationCardProps = {
  app: AplicationAnalytic;
  index: number;
  onPress(): void;
};

type ApplicationsDetailProps = {
  title: string;
  content: string;
};

export const ApplicationsDetail: React.FC<ApplicationsDetailProps> = ({
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

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  app,
  onPress,
  index,
}) => {
  const { t } = useTranslation();
  return (
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
        onPress={onPress}
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
            <ApplicationsDetail
              title={t("analytics.summary.earnings")}
              content={`${
                currencySymbols?.[
                  app.currencyCode as keyof typeof currencySymbols
                ] ?? "$"
              }${formatNumericAbbreviation(app.totalEarnings / 100)}`}
            />

            <ApplicationsDetail
              title={t("analytics.summary.impressions")}
              content={`${formatNumericAbbreviation(
                app.totalImpressions,
                false
              )}`}
            />

            <ApplicationsDetail
              title={t("analytics.summary.adRequests")}
              content={`${formatNumericAbbreviation(
                app.totalAdRequest,
                false
              )}`}
            />

            <ApplicationsDetail
              title={t("analytics.summary.eCPM")}
              content={`${
                isNaN(app.totalEarnings / app.totalImpressions)
                  ? 0
                  : formatNumericAbbreviation(
                      (app.totalEarnings / app.totalImpressions) * 10
                    )
              }`}
            />
          </View>
        </ScrollView>
      </Card>
    </Animated.View>
  );
};

export default ApplicationCard;
