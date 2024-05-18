import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import icons from "../../constants/icons";
import UserContext from "../../context/UserContext";
import {
  calculateDailyIntake,
  saveToDatabase,
} from "../../context/Calculations";

import { config, getDocument } from "../../lib/appwrite";

const Results = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [results, setResults] = useState({});
  const [userInfo, setUserInfo] = useContext(UserContext);

  const navigateToNextPage = () => {
    navigation.navigate("diary");
  };
  useEffect(() => {
    const { userInfo } = route.params;
    console.log("userInfo in Results:", userInfo); // This should now log the actual user info object
    if (userInfo) {
      const calculatedResults = calculateDailyIntake(userInfo);
      setResults(calculatedResults);
      saveToDatabase(userInfo.$id, calculatedResults);

      console.log(`documentId: ${userInfo.$id}`);
      getDocument(config.databaseId, userInfo.$collectionId, userInfo.$id)
        .then((document) => console.log(document))
        .catch((err) => console.error(err));
    }
  }, [route.params]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true; // This will prevent the hardware back button press on Android
      };

      // Add event listener for hardware back button press on Android
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        // Remove event listener
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  //   useEffect(() => {
  //     console.log(route.params.goal);
  //     console.log(route.params.weight);
  //     console.log(route.params.unit);
  //     console.log(route.params.goalweight);
  //     console.log(route.params.goalweightUnit);
  //     console.log(route.params.gender);
  //     console.log(route.params.dateOfBirth);
  //     console.log(route.params.height);
  //     console.log(route.params.heightUnit);
  //   }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex-col items-center min-h-[85vh] px-4 my-6">
          <Text className="text-2xl font-jbold my-10 text-center">
            Your personalized health plan is ready!
          </Text>
          <View>
            <Text>Daily Calories: {results.daily_calories}</Text>
            <Text>Daily Protein: {results.daily_protein}</Text>
            <Text>Daily Fat: {results.daily_fat}</Text>
            <Text>Daily Carbs: {results.daily_carbs}</Text>
          </View>
          <View className="flex-1 justify-center w-full px-10">
            <CustomButton title="Next" handlePress={navigateToNextPage} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Results;
