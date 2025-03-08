import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "react-native-ui-lib";

const TabBarButton = ({
  onPress,
  isFocused,
  onLongPress,
  label,
  routeName,
}: {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: string;
  label: string;
}): React.ReactNode => {
  const scale = useSharedValue(0);
  const { t } = useTranslation();

  useEffect(() => {
    scale.value = withSpring(Number(isFocused), { duration: 350 });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
    const top = interpolate(scale.value, [0, 1], [0, 8]);

    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      opacity,
    };
  });
  return (
    <Pressable
      onLongPress={() => onLongPress()}
      onPress={() => onPress()}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Animated.View style={animatedIconStyle}>
        {(() => {
          switch (routeName) {
            case "settings":
              return (
                <Ionicons
                  name="settings-sharp"
                  size={24}
                  color={isFocused ? Colors.black : Colors.grey20}
                />
              );
            case "index":
              return (
                <MaterialCommunityIcons
                  name="google-analytics"
                  size={24}
                  color={isFocused ? Colors.black : Colors.grey20}
                />
              );
            default:
              return (
                <AntDesign
                  name="unknowfile1"
                  size={24}
                  color={isFocused ? Colors.black : Colors.grey20}
                />
              );
          }
        })()}
      </Animated.View>

      <Animated.Text
        style={[
          {
            color: isFocused ? Colors.black : Colors.grey20,
            fontSize: 11,
          },
          animatedTextStyle,
        ]}
      >
        {t(`${label.toLocaleLowerCase()}.header.title`)}
      </Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;
