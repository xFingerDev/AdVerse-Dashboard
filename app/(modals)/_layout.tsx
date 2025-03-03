import { Stack } from "expo-router/stack";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "app-detail",
};

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="app-detail" />
      <Stack.Screen name="analyticsNetwork" />
    </Stack>
  );
}
