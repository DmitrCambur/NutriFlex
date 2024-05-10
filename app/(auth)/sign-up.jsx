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

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }
    setSubmitting(true);
    try {
      const { weightGoal, currentWeight, currentWeightUnit, ...restUserInfo } =
        route.params;
      const userInfo = {
        ...restUserInfo,
        height: parseInt(restUserInfo.height, 10),
        goalweight: parseInt(restUserInfo.goalweight, 10),
        weight: parseInt(restUserInfo.weight, 10),
      };
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
      setGlobalUser(result);
      setIsLogged(true);

      router.replace("/diary");
    } catch (error) {
      Alert.alert("Error", error.message);
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
            source={images.logo}
            resizeMode="contain"
            className="w-[300px] h-[100px] items-center justify-center"
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
    </SafeAreaView>
  );
};

export default SignUp;
