import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
  Animated,
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
import LottieView from "lottie-react-native";
import animations from "../../constants/animations";

import { config, getDocument } from "../../lib/appwrite";

const Results = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [results, setResults] = useState({});
  const [userInfo, setUserInfo] = useContext(UserContext);

  const navigateToNextPage = () => {
    navigation.navigate("(tabs)");
  };

  const TabIcon = ({ icon, color, name, focused }) => {
    return (
      <View className="flex items-center justify-center gap-2">
        <Image
          source={icon}
          resizeMode="contain"
          tintColor={color}
          className="w-6 h-6"
        />
      </View>
    );
  };
  function Nutrient({ name, value, progress }) {
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(animation, {
        toValue: progress,
        duration: 2200,
        useNativeDriver: false,
      }).start();
    }, [progress]);

    const width = animation.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", `${progress}%`],
    });

    const displayValue = name === "Calories" ? `${value} kcal` : `${value} g`;

    return (
      <View className="w-full flex-col items-start mt-4">
        <View className="w-full flex-row justify-between">
          <Text className="font-jbold text-l">{name}</Text>
          <Text className="font-jbold text-l">{displayValue}</Text>
        </View>
        <View className="w-full h-2 bg-gray-200 mt-1">
          <Animated.View
            style={{
              width,
              height: "100%",
              backgroundColor: "#191919",
            }}
          />
        </View>
      </View>
    );
  }
  function GoalStep({ animation, text }) {
    return (
      <View className="flex-row items-center mt-4">
        <LottieView source={animation} autoPlay loop className="w-14 h-14" />
        <Text className="ml-3 w-64 font-jlight text-xs">{text}</Text>
      </View>
    );
  }
  useEffect(() => {
    const { userInfo } = route.params;
    console.log("userInfo in Results:", userInfo); // This should now log the actual user info object
    if (userInfo) {
      const calculatedResults = calculateDailyIntake(userInfo);
      // Format the date
      const goalDate = new Date(calculatedResults.goaldate);
      const formattedGoalDate = `${goalDate.getFullYear()}-${
        goalDate.getMonth() + 1
      }-${goalDate.getDate()}`;
      calculatedResults.goaldate = formattedGoalDate;
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

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex-col items-center min-h-[85vh] px-8 my-6">
          <Text className="text-2xl font-jbold my-10 text-center">
            {userInfo.username}, your personalized health plan is ready!
          </Text>
          <View className="w-full items-center border-2 border-secondary p-4">
            <View className="flex-row px-5 justify-between">
              <Text className="font-jbold text-3xl mr-4">
                {userInfo.weight} {userInfo.unit}
              </Text>
              <TabIcon
                icon={icons.progress}
                color={"#191919"}
                className="mx-4"
              />
              <Text className="font-jbold text-3xl ml-3">
                {userInfo.goalweight} {userInfo.goalweightUnit}
              </Text>
            </View>
            <Text className="font-jlight text-l text-center mt-4">
              Follow your recommendations and you will reach your goal on{" "}
              <Text className="font-jbold">{results.goaldate}</Text>
            </Text>
          </View>
          <View className="w-full items-center mt-6 border-2 border-secondary p-4">
            <Text className="font-jbold text-2xl text-center">
              Daily nutritional recommendations
            </Text>
            <Text className="font-jlight text-l text-center mt-2">
              You can edit this anytime in the app
            </Text>
            <View className="w-full mt-4">
              <Nutrient
                name="Calories"
                value={results.daily_calories}
                progress={100}
              />
              <Nutrient
                name="Protein"
                value={results.daily_protein}
                progress={20}
              />
              <Nutrient name="Fat" value={results.daily_fat} progress={30} />
              <Nutrient
                name="Carbs"
                value={results.daily_carbs}
                progress={50}
              />
            </View>
          </View>
          <View className="w-full items-center mt-6 border-2 border-secondary p-4">
            <Text className="font-jbold text-2xl text-center">
              How to reach your goals:
            </Text>
            <View className="w-full mt-2">
              <GoalStep
                animation={animations.paperbag}
                text="Get your daily requirements and personal advice to improve your nutritional habits"
              />
              <GoalStep
                animation={animations.schedule}
                text="Track your food"
              />
              <GoalStep
                animation={animations.glasswater}
                text="Stay hydrated and track water intake"
              />
              <GoalStep
                animation={animations.scale}
                text="Log your progress by updating
your weight or body measurements"
              />
            </View>
          </View>
          <View className="flex-1 justify-center w-full px-10 mt-10">
            <CustomButton
              title="GET STARTED"
              handlePress={navigateToNextPage}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Results;
