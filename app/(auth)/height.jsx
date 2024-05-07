import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import icons from "../../constants/icons";
import UserContext from "../../context/UserContext";

const Height = () => {
  const [heightCm, setHeightCm] = useState("");
  const [heightFtIn, setHeightFtIn] = useState("");
  const [unit, setUnit] = useState("cm");
  const [currentPage, setCurrentPage] = useState(7); // Assuming this is the second page
  const navigation = useNavigation();
  const route = useRoute();
  const [userInfo, setUserInfo] = useContext(UserContext);

  useEffect(() => {
    console.log(route.params.goal);
    console.log(route.params.weight);
    console.log(route.params.unit);
    console.log(route.params.goalweight);
    console.log(route.params.goalweightUnit);
    console.log(route.params.gender);
    console.log(route.params.dateOfBirth);
  }, []);
  const navigateToNextPage = () => {
    setUserInfo({
      ...userInfo,
      height: unit === "cm" ? heightCm : heightFtIn,
      heightUnit: unit,
    });
    if (unit === "cm" ? heightCm : heightFtIn) {
      navigation.navigate("ethnicity", {
        goal: userInfo.goal,
        weight: userInfo.weight,
        unit: userInfo.unit,
        goalweight: userInfo.goalweight,
        goalweightUnit: userInfo.goalweightUnit,
        gender: userInfo.gender,
        dateOfBirth: userInfo.dateOfBirth,
        height: unit === "cm" ? heightCm : heightFtIn,
        heightUnit: unit,
      });
    } else {
      alert("Please enter your height");
    }
  };

  const handleUnitChange = (newUnit) => {
    if (newUnit === "cm") {
      const [feet, inches] = heightFtIn.split("/").map(Number);
      const convertedHeight = feet * 30.48 + inches * 2.54;
      setHeightCm(convertedHeight.toFixed(2));
    } else if (newUnit === "ft/in") {
      const totalInches = heightCm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      setHeightFtIn(`${feet}/${inches}`);
    }
    setUnit(newUnit);
  };

  const convertHeight = (newUnit, height) => {
    let convertedHeight;

    if (newUnit === "cm") {
      // Convert from ft/in to cm
      const [feet, inches] = height.split("/").map(Number);
      convertedHeight = feet * 30.48 + inches * 2.54;
    } else if (newUnit === "ft/in") {
      // Convert from cm to ft/in
      const totalInches = height / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      convertedHeight = `${feet}/${inches}`;
    }

    return convertedHeight;
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
            What's your current height?
          </Text>
          <View className="flex-1 justify-center w-full px-10">
            <View className="flex-row border border-secondary mb-5 py-4">
              <TextInput
                className="flex-1 h-15 text-center font-jbold text-4xl"
                keyboardType="numeric"
                value={unit === "cm" ? heightCm : heightFtIn}
                onChangeText={unit === "cm" ? setHeightCm : setHeightFtIn}
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
                onPress={() => handleUnitChange("cm")}
              >
                <Text
                  className={
                    unit === "cm"
                      ? "font-jlight bg-secondary text-primary py-3 px-12 text-2xl"
                      : "font-jlight py-3 px-12 text-2xl"
                  }
                >
                  cm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="mx-0 border border-secondary"
                onPress={() => handleUnitChange("ft/in")}
              >
                <Text
                  className={
                    unit === "ft/in"
                      ? "font-jlight bg-secondary text-primary py-3 px-12 text-2xl "
                      : "font-jlight py-3 px-12 text-2xl"
                  }
                >
                  ft/in
                </Text>
              </TouchableOpacity>
            </View>
            <CustomButton title="Next" handlePress={navigateToNextPage} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Height;
