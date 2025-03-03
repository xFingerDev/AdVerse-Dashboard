import { View, Chip } from "react-native-ui-lib";
import { useTranslation } from "react-i18next";
import { AnalyticType } from "@/repository/INetworkAnalytic";
import { ScrollView } from "react-native";

type AnalyticsFilterProps = {
  rangeDay: AnalyticType;
  setRangeDays: (value: AnalyticType) => void;
};

const AnalyticsFilter: React.FC<AnalyticsFilterProps> = ({
  rangeDay,
  setRangeDays,
}) => {
  const { t } = useTranslation();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View row>
        {Object.keys(AnalyticType).map((key, index) => (
          <Chip
            key={index}
            label={t(`analytics.filter.date.${key}`)}
            marginH-5
            labelStyle={{
              color: rangeDay === key ? "#b84dff" : undefined,
              fontFamily: "Nunito",
            }}
            containerStyle={{
              marginLeft: index === 0 ? 20 : 0,
              borderColor: rangeDay === key ? "#b84dff" : undefined,
            }}
            onPress={() => setRangeDays(key as AnalyticType)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default AnalyticsFilter;
