import {
  AnalyticType,
  AplicationAnalytic,
} from "@/repository/INetworkAnalytic";
import { router } from "expo-router";
import { View } from "react-native-ui-lib";
import ApplicationCard from "./ApplicationCard";

type ApplicationsListProps = {
  analytics: AplicationAnalytic[] | null;
  analyticType: AnalyticType;
};

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  analytics,
  analyticType,
}) => {
  return (
    <View>
      {analytics
        ?.sort((a, b) => b.totalEarnings - a.totalEarnings)
        .map((app, index) => (
          <ApplicationCard
            key={index}
            app={app}
            index={index}
            onPress={() => {
              router.push({
                pathname: "/(modals)/appDetail",
                params: {
                  appId: app.id,
                  analyticType: JSON.stringify(analyticType),
                },
              });
            }}
          />
        ))}
    </View>
  );
};

export default ApplicationsList;
