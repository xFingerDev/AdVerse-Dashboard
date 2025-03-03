import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import React from "react";
import { AntDesign, Feather } from "@expo/vector-icons";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Card, Colors } from "react-native-ui-lib";
import TabBarButton from "./TabBarButton";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <Card
      row
      paddingT-8
      paddingB-20={Platform.OS === "ios"}
      style={{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        backgroundColor: Colors.grey70,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            label={label}
          />
        );
      })}
    </Card>
  );
};

export default TabBar;
