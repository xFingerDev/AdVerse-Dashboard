import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useContext, useState } from "react";
import { AdNetworkManagerContext } from "@/contexts/AdNetworkManagerContext";
import { useFocusEffect } from "expo-router";
import { GlobalAnalytics } from "@/repository/IAdNetwork";

export default function TabOneScreen() {
  const adNetworkManager = useContext(AdNetworkManagerContext);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    const accounts = await adNetworkManager?.networks?.[0].getAnalytics(
      "pub-4713105116292090"
    );
    console.log(accounts);
    accounts && setAnalytics(accounts);
    setRefreshing(false);
  };

  const [analytics, setAnalytics] = useState<GlobalAnalytics | null>(null);
  useFocusEffect(() => {
    (async () => {
      if (analytics) return;
      //const accounts = await adNetworkManager?.networks?.[0].getListAccounts();
      const accounts = await adNetworkManager?.networks?.[0]
        .getAnalytics("pub-4713105116292090")
        .then((data) => setAnalytics(data));
      //console.log(accounts);
      console.log({
        dd: adNetworkManager?.networks.length,
        f: new Date(),
      });
    })();
  });

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]}
            tintColor="#689F38"
          />
        }
      >
        <View>
          <Text style={styles.title}>
            Total Earnings:{" "}
            {analytics?.totalEarnings ? analytics?.totalEarnings / 1000000 : 0}
          </Text>
          <Text style={styles.title}>
            Total Impressions: {analytics?.totalImpressions}
          </Text>
          <Text style={styles.title}>
            Total Ad Requests: {analytics?.totalAdRequest}
          </Text>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <Text style={styles.title}>Applications</Text>
          {analytics?.app?.map((app, index) => (
            <View key={index}>
              <Text>Application: {app.id}</Text>
              <Text>Total Earnings: {app.totalEarnings / 1000000}</Text>
              <Text>Total Impressions: {app.totalImpressions}</Text>
              <Text>Total Ad Requests: {app.totalAdRequest}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    //alignItems: "center",
    //justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
