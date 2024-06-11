import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import icons from "../../constants/icons";
import UserContext from "../../context/UserContext";

const GoalWeight = () => {
  const [goalWeight, setGoalWeight] = useState("");
  const [unit, setUnit] = useState("kg");
  const [currentPage, setCurrentPage] = useState(3); // Assuming this is the second page
  const navigation = useNavigation();
  const route = useRoute();
  const [userInfo, setUserInfo] = useContext(UserContext);

  useEffect(() => {
    console.log(route.params.goal);
    console.log(route.params.weight);
    console.log(route.params.currentWeightUnit);
  }, []);

  const toastConfig = {
    customToast: ({ text1, text2 }) => (
      <View className="h-full w-full bg-red p-4">
        <Text className="text-white font-jbold">{text1}</Text>
        <Text className="text-white font-jlight">{text2}</Text>
      </View>
    ),
  };

  const navigateToNextPage = () => {
    if (goalWeight) {
      // Convert goalWeight and current weight to the same unit for comparison
      let currentWeightInGoalUnit = userInfo.weight;
      if (userInfo.currentWeightUnit !== unit) {
        currentWeightInGoalUnit = convertWeight(
          userInfo.weight,
          userInfo.currentWeightUnit,
          unit
        );
      }

      // Check if the goal weight is valid based on the goal
      if (
        (route.params.goal === "gain_weight" &&
          parseFloat(goalWeight) <= currentWeightInGoalUnit) ||
        (route.params.goal === "lose_weight" &&
          parseFloat(goalWeight) >= currentWeightInGoalUnit)
      ) {
        Toast.show({
          text1: "Invalid Goal Weight",
          text2:
            "Please enter a goal weight that aligns with your current weight & goal.",
          type: "customToast",
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 10,
          bottomOffset: 0,
        });
        return;
      }

      const updatedUserInfo = {
        ...userInfo,
        goalweight: goalWeight,
        goalweightUnit: unit,
        unit: userInfo.currentWeightUnit, // Changed from unit to userInfo.currentWeightUnit
      };
      setUserInfo(updatedUserInfo);

      navigation.navigate("gender", {
        goal: updatedUserInfo.goal,
        weight: updatedUserInfo.weight,
        unit: userInfo.currentWeightUnit, // Changed from unit to userInfo.currentWeightUnit
        goalweight: goalWeight,
        goalweightUnit: unit,
      });
    } else {
      Toast.show({
        text1: "Missing Weight",
        text2: "Please enter your goal weight",
        type: "customToast",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 10,
        bottomOffset: 0,
      });
    }
  };

  const convertWeight = (newUnit) => {
    let convertedWeight = parseFloat(goalWeight);
    if (isNaN(convertedWeight)) {
      // If the weight is not a number, don't convert it
      return;
    }

    // Convert the weight to the new unit
    switch (newUnit) {
      case "kg":
        if (unit === "lbs") {
          convertedWeight /= 2.2046;
        } else if (unit === "st") {
          convertedWeight *= 6.3503;
        }
        break;
      case "lbs":
        if (unit === "kg") {
          convertedWeight *= 2.2046;
        } else if (unit === "st") {
          convertedWeight *= 14;
        }
        break;
      case "st":
        if (unit === "kg") {
          convertedWeight /= 6.3503;
        } else if (unit === "lbs") {
          convertedWeight /= 14;
        }
        break;
    }

    // Update the weight and unit
    setGoalWeight(convertedWeight.toFixed(2)); // Changed setWeight to setGoalWeight
    setUnit(newUnit);
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
          <Text className="text-2xl font-jbold my-10 text-center h-15">
            What's your current weight goal?
          </Text>
          <View className="flex-1 justify-center w-full px-10">
            <View className="flex-row border border-secondary mb-5 py-4">
              <TextInput
                className="flex-1 h-15 text-center font-jbold text-4xl"
                keyboardType="numeric"
                value={goalWeight}
                onChangeText={setGoalWeight}
                style={{ textAlign: "center" }}
              />
              <Text
                className="font-jlight text-xl"
                style={{ position: "absolute", top: 25, right: 10 }}
              >
                {unit}
              </Text>
            </View>
            <View className="flex-row mb-5 justify-center">
              <TouchableOpacity
                className="mx-0 border border-secondary"
                onPress={() => convertWeight("kg")}
              >
                <Text
                  className={
                    unit === "kg"
                      ? "font-jlight bg-secondary text-primary py-3 px-8 text-2xl"
                      : "font-jlight py-3 px-8 text-2xl"
                  }
                >
                  kg
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="mx-0 border border-secondary"
                onPress={() => convertWeight("lbs")}
              >
                <Text
                  className={
                    unit === "lbs"
                      ? "font-jlight bg-secondary text-primary py-3 px-8 text-2xl"
                      : "font-jlight py-3 px-8 text-2xl"
                  }
                >
                  lbs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="mx-0 border border-secondary"
                onPress={() => convertWeight("st")}
              >
                <Text
                  className={
                    unit === "st"
                      ? "font-jlight bg-secondary text-primary py-3 px-8 text-2xl "
                      : "font-jlight py-3 px-8 text-2xl"
                  }
                >
                  st
                </Text>
              </TouchableOpacity>
            </View>
            <CustomButton title="Next" handlePress={navigateToNextPage} />
          </View>
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

export default GoalWeight;
