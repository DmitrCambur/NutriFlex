import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Redirect, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import UserContext from "../../context/UserContext"; // replace with the actual path to UserContext

const Gender = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(4);
  const route = useRoute();

  useEffect(() => {
    console.log(route.params.goal);
    console.log(route.params.weight);
    console.log(route.params.unit);
    console.log(route.params.goalweight);
    console.log(route.params.goalweightUnit);
  }, []);

  const handleGenderSelect = (gender) => {
    const updatedUserInfo = {
      ...userInfo,
      gender: gender,
    };
    setUserInfo(updatedUserInfo);
    // navigate to the next page and pass the values
    navigation.navigate("dof", {
      goal: updatedUserInfo.goal,
      weight: updatedUserInfo.weight,
      unit: updatedUserInfo.currentWeightUnit, // Changed from unit to currentWeightUnit
      goalweight: updatedUserInfo.goalweight,
      goalweightUnit: updatedUserInfo.goalweightUnit,
      gender: gender,
    });
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
                    i < currentPage
                      ? "bg-secondary"
                      : "bg-primary border-2 border-secondary"
                  }`}
                />
              ))}
            </View>
          </View>
          <Text className="text-2xl font-jbold my-10 text-center">
            What sex should we use to calculate your result?
          </Text>
          <CustomButton
            title="Male"
            handlePress={() => handleGenderSelect("male")}
            containerStyles="mt-10"
          />
          <CustomButton
            title="Female"
            handlePress={() => handleGenderSelect("female")}
            containerStyles="mt-10"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Gender;
