import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";
import { Card, Colors as ColorsRUI, Text, View } from "react-native-ui-lib";

interface CustomCardButtonProps {
  label: string;
  disabled?: boolean;
  iconName?: string;
  centerText?: boolean;
  iconColor?: string;
  onPress: () => void;
  textColor?: string;
  disabledTextColor?: string;
  cardStyle?: StyleProp<ViewStyle | Animated.AnimatedProps<ViewStyle>>;
}

const CustomCardButton: React.FC<CustomCardButtonProps> = ({
  label,
  iconName,
  disabled,
  centerText,
  cardStyle,
  iconColor = ColorsRUI.grey20,
  onPress,
  textColor = ColorsRUI.grey10,
  disabledTextColor = ColorsRUI.grey40,
}) => {
  return (
    <Card
      marginB-10
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        cardStyle,
        {
          elevation: 4,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 4,
        },
      ]}
      disabled={disabled}
    >
      <View padding-16 row centerV spread>
        <Text
          text70
          style={{
            color: disabled ? disabledTextColor : textColor,
            textAlign: centerText ? "center" : "left",
            flex: 1,
          }}
        >
          {label}
        </Text>
        {iconName && (
          <Ionicons name={iconName as any} size={24} color={iconColor} />
        )}
      </View>
    </Card>
  );
};

export default CustomCardButton;
