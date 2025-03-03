import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import "@/constants/Google";
import { AdNetworkManagerProvider } from "@/contexts/AdNetworkManagerContext";
import "@/i18n/index";
import { Colors } from "react-native-ui-lib";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
export { ErrorBoundary } from "expo-router";
import { ThemeManager } from "react-native-ui-lib";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Appearance, Button, StyleSheet } from "react-native";
import SheetDonation from "@/components/settings/BottonSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

ThemeManager.setComponentTheme("Text", {
  style: {
    fontFamily: "Nunito",
  },
});

ThemeManager.setComponentTheme("Buttons", {
  style: {
    fontFamily: "Nunito",
  },
});
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  //TODO: In future handle correclty the dark theme and light theme
  const colorScheme = useColorScheme();
  Colors.setScheme("light");
  Appearance.setColorScheme("light");

  return (
    <ThemeProvider
      value={
        colorScheme === "dark"
          ? DarkTheme
          : {
              ...DefaultTheme,
              colors: { ...DefaultTheme.colors, background: "white" },
            }
      }
    >
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <AdNetworkManagerProvider>
            <Stack
              screenOptions={{
                navigationBarColor: Colors.grey70,
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(modals)"
                options={{ headerShown: false }}
                // options={{ presentation: "modal" }}
              />
            </Stack>
          </AdNetworkManagerProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
