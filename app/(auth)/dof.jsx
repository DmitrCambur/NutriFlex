import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Redirect, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import UserContext from "../../context/UserContext";
import Toast from "react-native-toast-message";

import DateTimePicker from "@react-native-community/datetimepicker";

const Dof = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(5);
  const route = useRoute();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false); // Declare the 'show' state variable

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false); // Hide the date picker
    setDate(currentDate);
  };

  useEffect(() => {
    console.log(route.params.goal);
    console.log(route.params.weight);
    console.log(route.params.unit);
    console.log(route.params.goalweight);
    console.log(route.params.goalweightUnit);
    console.log(route.params.gender);
  }, []);

  const toastConfig = {
    customToast: ({ text1, text2 }) => (
      <View className="h-full w-full bg-red p-4">
        <Text className="text-white font-jbold">{text1}</Text>
        <Text className="text-white font-jlight">{text2}</Text>
      </View>
    ),
  };

  const handleDateOfBirthSelect = () => {
    const dateOfBirthString = date.toISOString(); // Convert date to a string

    // Calculate the age
    const today = new Date();
    const birthDate = new Date(dateOfBirthString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Check if age is between 14 and 90
    if (age < 14 || age > 90) {
      Toast.show({
        text1: "Invalid Age",
        text2: "Age must be between 14 and 90.",
        type: "customToast",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 10,
        bottomOffset: 0,
      });
      return;
    }

    setUserInfo({
      ...userInfo,
      dateOfBirth: dateOfBirthString,
      goalweight: route.params.goalweight, // Add this line
      goalweightUnit: route.params.goalweightUnit, // Add this line
    });

    navigation.navigate("height", {
      goal: userInfo.goal,
      weight: userInfo.weight,
      unit: userInfo.unit,
      goalweight: route.params.goalweight, // Update this line
      goalweightUnit: route.params.goalweightUnit, // Update this line
      gender: userInfo.gender,
      dateOfBirth: dateOfBirthString,
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
            What's your date of birth?
          </Text>
          <View className="flex-1 justify-center w-full px-9">
            <View className="flex-row mb-5 justify-center">
              <TouchableOpacity
                className="mx-0 border border-secondary"
                onPress={() => setShow(true)}
              >
                <Text className="font-jlight py-5 w-full px-16 text-3xl">
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={"date"}
                  display="default"
                  onChange={onChange}
                  format="DD/MM/YYYY"
                />
              )}
            </View>
            <CustomButton
              title="Next"
              handlePress={() => handleDateOfBirthSelect(date)}
            />
          </View>
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

export default Dof;
