import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Redirect, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import UserContext from "../../context/UserContext"; // replace with the actual path to UserContext

const Goal = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useContext(UserContext);

  const handleGoalSelect = (goal) => {
    setUserInfo({
      ...userInfo,
      goal: goal,
    });
    navigation.navigate("current-weight", { goal: goal });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex-col items-center min-h-[85vh] px-4 my-6">
          <View className="w-full flex-row items-center justify-start">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="self-start"
            >
              <Image
                source={icons.leftArrow}
                style={{ tintColor: "#191919" }}
              />
            </TouchableOpacity>
            <View className="flex-1 flex-row justify-center">
              {[...Array(8)].map((_, i) => (
                <View
                  key={i}
                  className={`h-3 w-7 m-1 ${
                    i === 0
                      ? "bg-secondary"
                      : "bg-primary border-2 border-secondary"
                  }`}
                />
              ))}
            </View>
          </View>
          <Text className="text-2xl font-jbold my-10 text-center">
            What goal do you have in mind?
          </Text>
          <CustomButton
            title="Gain weight"
            handlePress={() => handleGoalSelect("gain_weight")}
            containerStyles="mt-10"
          />
          <CustomButton
            title="Maintain weight"
            handlePress={() => handleGoalSelect("maintain_weight")}
            containerStyles="mt-10"
          />
          <CustomButton
            title="Lose weight"
            handlePress={() => handleGoalSelect("lose_weight")}
            containerStyles="mt-10"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Goal;
