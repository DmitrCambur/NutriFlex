import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Link, router } from "expo-router";
import { useNavigation, useRoute } from "@react-navigation/native";
import UserContext from "../../context/UserContext";
import images from "../../constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import bganimation from "../../assets/animations/nutriflexgiff.gif";

const SignIn = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userInfo, setUserInfo] = useContext(UserContext);
  const { setGlobalUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      const user = await signIn(form.email, form.password);
      setGlobalUser(user);
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
            source={bganimation}
            resizeMode="contain"
            className="w-[350px] h-[200px] items-center justify-center mb-[-40px]"
          />

          <Text className="text-3xl text-secondary mt-3 font-jbold">
            Sign In
          </Text>

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
            title="SIGN IN"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-6">
            <Text className="text-l text-secondary font-jlight pt-1 text-center">
              Don't have an account?
            </Text>
            <Link
              href="/goal"
              className="text-lg font-jbold text-secondary text-center"
            >
              Get Started
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
