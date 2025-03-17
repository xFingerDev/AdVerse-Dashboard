import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from "react-native-reanimated";
import { Text, View } from "react-native-ui-lib";

const AnalyticsEmpty: React.FC = () => {
  const { t } = useTranslation();

  const sv = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    sv.value = withRepeat(
      withSpring(0.4, {
        damping: 10,
        stiffness: 10,
        mass: 0.4,
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(sv.value, [0, 0.5, 1], [1, 1.2, 1]);
    const translateY = interpolate(sv.value, [0, 0.5, 1], [0, -15, 0]);
    const rotateValue = `${rotation.value}deg`;
    const opacity = interpolate(sv.value, [0, 0.5, 1], [0.7, 1, 0.7]);

    return {
      transform: [{ scale }, { translateY }, { rotate: rotateValue }],
      opacity,
    };
  });

  return (
    <View center marginV-120 paddingB-70>
      <Animated.View entering={FadeIn.duration(500)}>
        <View center>
          <Animated.View style={animatedStyle}>
            <Ionicons
              name="stats-chart"
              size={120}
              color="#ec85c7"
              style={{
                opacity: 0.8,
                shadowColor: "#ec85c7",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
              }}
            />
          </Animated.View>
          <Animated.View style={animatedStyle}>
            <Text
              marginT-30
              text70
              center
              medium
              style={{
                letterSpacing: 0.3,
              }}
            >
              {t("analytics.applications.empty")}
            </Text>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

export default AnalyticsEmpty;
