import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function TabOneScreen() {
  return (
    <View className="flex-1 mt-40">
      <Text style={styles.title}>Total ganado</Text>
      <Text>eCPM</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text style={styles.title}>Aplicaciones</Text>
      <View>
        {/* Aquí puedes mapear una lista de aplicaciones y sus analíticas */}
        <Text>Aplicación 1: Analíticas</Text>
        <Text>Aplicación 2: Analíticas</Text>
        {/* Agrega más aplicaciones según sea necesario */}
      </View>
    </View>
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
