import { View, Chip, Colors } from "react-native-ui-lib";
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
            marginH-8
            backgroundColor={rangeDay === key ? "#ec85c7" : "transparent"}
            labelStyle={{
              color: rangeDay === key ? Colors.white : "#666",
              fontFamily: "Nunito",
              fontSize: 14,
              fontWeight: rangeDay === key ? "600" : "400",
            }}
            containerStyle={{
              marginLeft: index === 0 ? 20 : 0,
              borderColor: rangeDay === key ? "#ec85c7" : "#ddd",
              borderWidth: 1,
              borderRadius: 20,
              paddingVertical: 6,
              elevation: rangeDay === key ? 2 : 0,
            }}
            onPress={() => setRangeDays(key as AnalyticType)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default AnalyticsFilter;
