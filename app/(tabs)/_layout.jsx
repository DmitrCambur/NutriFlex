import { View, Text, Image, Platform } from "react-native";
import { Redirect, Tabs } from "expo-router";
import React, { useState } from "react";

import icons from "../../constants/icons";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-jbold" : "font-jlight"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const [keys, setKeys] = useState({
    diary: 0,
    progress: 0,
    recipes: 0,
    profile: 0,
  });

  const incrementKey = (tabName) => {
    setKeys((prevKeys) => ({
      ...prevKeys,
      [tabName]: prevKeys[tabName] + 1,
    }));
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#F5F5F5",
          tabBarInactiveTintColor: "#7F7F7F",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#191919",
            borderTopWidth: 1,
            borderTopColor: "#191919",
            height: Platform.OS === "ios" ? 100 : 65,
          },
        }}
      >
        <Tabs.Screen
          name="diary"
          key={`diary-${keys.diary}`}
          options={{
            title: "Diary",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.diary}
                color={color}
                name="Diary"
                focused={focused}
              />
            ),
          }}
          listeners={{
            focus: () => incrementKey("diary"),
          }}
        />
        <Tabs.Screen
          name="progress"
          key={`progress-${keys.progress}`}
          options={{
            title: "Progress",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.progress}
                color={color}
                name="Progress"
                focused={focused}
              />
            ),
          }}
          listeners={{
            focus: () => incrementKey("progress"),
          }}
        />
        <Tabs.Screen
          name="recipes"
          key={`recipes-${keys.recipes}`}
          options={{
            title: "Recipes",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.recipes}
                color={color}
                name="Recipes"
                focused={focused}
              />
            ),
          }}
          listeners={{
            focus: () => incrementKey("recipes"),
          }}
        />
        <Tabs.Screen
          name="profile"
          key={`profile-${keys.profile}`}
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
          listeners={{
            focus: () => incrementKey("profile"),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
