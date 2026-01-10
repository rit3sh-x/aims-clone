import { Tabs } from "expo-router";
import { View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Home03Icon } from "@hugeicons/core-free-icons";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          height: 90,
          paddingTop: 10,
          paddingBottom: 12,
        },
        tabBarItemStyle: {
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: -6,
          },
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: focused ? color : "transparent",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 6,
                elevation: focused ? 8 : 0,
              }}
            >
              <HugeiconsIcon
                icon={Home03Icon}
                size={38}
                color={focused ? "#fff" : color}
                strokeWidth={focused ? 0 : 1.8}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}