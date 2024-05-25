import { StatusBar } from "expo-status-bar";
import { View, Text, Image, ScrollView } from "react-native";
import { Redirect, router, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/images";
import animations from "../constants/animations";
import LottieView from "lottie-react-native";
import CustomButton from "../components/CustomButton";

export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.logo}
            className="w-[300px] h-[300px]"
            resizeMode="contain"
          />
          <CustomButton
            title="GET STARTED"
            handlePress={() => router.push("/goal")}
            containerStyles="mt-5"
          />
          <View className="flex justify-center pt-4 flex-row gap-1">
            <Text className="text-base text-secondary font-jlight">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-base font-jbold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
