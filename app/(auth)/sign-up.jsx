import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Link, router } from "expo-router";
import { useNavigation, useRoute } from "@react-navigation/native";
import UserContext from "../../context/UserContext";
import images from "../../constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import bganimation from "../../assets/animations/nutriflexgiff.gif";
import Toast from "react-native-toast-message";

const SignUp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { setGlobalUser, setIsLogged } = useGlobalContext();
  const [user, setUser] = useContext(UserContext);
  const [isSubmitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const toastConfig = {
    customToast: ({ text1, text2 }) => (
      <View className="h-full w-full bg-red p-4">
        <Text className="text-white font-jbold">{text1}</Text>
        <Text className="text-white font-jlight">{text2}</Text>
      </View>
    ),
  };

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Toast.show({
        text1: "Error",
        text2: "Please fill in all fields.",
        type: "customToast",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 10,
        bottomOffset: 0,
      });
      return;
    }
    setSubmitting(true);
    try {
      const { weightGoal, currentWeight, currentWeightUnit, ...restUserInfo } =
        route.params;
      let userInfo = {
        ...restUserInfo,
        goalweight: parseInt(restUserInfo.goalweight, 10),
        weight: parseInt(restUserInfo.weight, 10),
      };

      // Check if height is in ft/in format
      if (restUserInfo.height.includes("/")) {
        const [feet, inches] = restUserInfo.height.split("/");
        // Convert height to centimeters and round to nearest integer
        userInfo.height = Math.round((feet * 12 + parseInt(inches, 10)) * 2.54);
        userInfo.heightUnit = "cm";
      } else {
        userInfo.height = parseInt(restUserInfo.height, 10);
      }

      const filteredUserInfo = Object.fromEntries(
        Object.entries(userInfo).filter(([key, value]) => value && value !== 0)
      );
      console.log("Submitting the following data:", {
        email: form.email,
        password: form.password,
        username: form.username,
        userInfo: filteredUserInfo,
      });
      const result = await createUser(
        form.email,
        form.password,
        form.username,
        filteredUserInfo
      );
      setUser(result);
      console.log("User created:", result);
      setGlobalUser(result);
      setIsLogged(true);

      // Reset the navigation stack and navigate to the main part of the application
      navigation.reset({
        index: 0,
        routes: [{ name: "results", params: { userInfo: result } }],
      });
    } catch (error) {
      Toast.show({
        text1: "Error",
        text2: error.message,
        type: "customToast",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 10,
        bottomOffset: 0,
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(route.params.goal);
    console.log(route.params.weight);
    console.log(route.params.unit);
    console.log(route.params.goalweight);
    console.log(route.params.goalweightUnit);
    console.log(route.params.gender);
    console.log(route.params.dateOfBirth);
    console.log(route.params.height);
    console.log(route.params.heightUnit);
    console.log(route.params.ethnicity);
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center items-center h-full px-10 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={bganimation}
            resizeMode="contain"
            className="w-[350px] h-[200px] items-center justify-center mb-[-40px]"
          />
          <Text className="text-3xl text-secondary mt-3 font-jbold">
            Sign Up
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-5"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="SIGN UP"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-6 flex-row gap-1">
            <Text className="text-l text-secondary font-jlight pt-1">
              Have an account already?
            </Text>
            <Link href="/sign-in" className="text-lg font-jbold text-secondary">
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

export default SignUp;
