import { useNavigation } from "expo-router";
import { Text, View, Button } from "react-native";

export default function SettingsScreen() {
  const navigation = useNavigation();

  const handleRemoveAds = () => {
    // Logic to remove ads
  };

  // Logic to manage services

  const handleOpenGitHub = () => {
    // Logic to open GitHub
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-lg font-bold mb-4">Settings</Text>

      <Button title="Remove Ads" onPress={handleRemoveAds} className="mb-4" />

      <Button
        title="Manage Services"
        onPress={handleManageServices}
        className="mb-4"
      />

      <View className="flex-1 justify-end">
        <Button title="GitHub" onPress={handleOpenGitHub} />
      </View>
      <Button
        title="Remove Ads"
        onPress={handleRemoveAds}
        style={{ marginBottom: 16 }}
      />

      <Button
        title="Manage Services"
        onPress={handleManageServices}
        style={{ marginBottom: 16 }}
      />

      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Button title="GitHub" onPress={handleOpenGitHub} />
      </View>
    </View>
  );
}
