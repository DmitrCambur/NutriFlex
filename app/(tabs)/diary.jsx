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
  Modal,
  Animated,
} from "react-native";
import MealDetails from "../../components/MealDetails";
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
import { Player } from "@lordicon/react";
import {
  calculateDailyIntake,
  saveToDatabase,
} from "../../context/Calculations";
import LottieView from "lottie-react-native";
import animations from "../../constants/animations";
import images from "../../constants/images";
import * as Progress from "react-native-progress";
import {
  config,
  getDocument,
  updateUser,
  getCurrentUser,
} from "../../lib/appwrite";

const Diary = () => {
  const [userInfo, setUserInfo] = useContext(UserContext);
  const [userData, setUserData] = useState({ water: 0 });
  const [loading, setLoading] = useState(true);
  const [calories, setCalories] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAnimated, setIsAnimated] = useState(Array(6).fill(false));
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const playerRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log("Current user:", user);
        setCurrentUser(user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentUser();
  }, [refreshKey]);

  useEffect(() => {
    if (currentUser && currentUser.$id) {
      getDocument(config.databaseId, currentUser.$collectionId, currentUser.$id)
        .then((document) => {
          console.log("Document:", document);
          setUserData(document);
          setCalories(document.calories || 0); // Set the calories state with the user's calories
          setLoading(false);
        })
        .catch((err) => console.error(err));
    } else {
    }
  }, [currentUser]);

  useEffect(() => {
    console.log("Loading:", loading);
    // Check if userData.$id is defined and not empty
    if (!loading && userData && userData.$id) {
      updateUser(userData.$id, { water: userData.water })
        .then((result) => {
          console.log("Update Result:", result);
        })
        .catch((err) => console.error(err));
    } else {
    }
  }, [userData, loading, currentUser]);

  const handleWaterDropClick = (index) => {
    setIsAnimated((prev) => {
      const newIsAnimated = [...prev];
      let newWaterValue = 0; // Reset water value
      if (newIsAnimated[index]) {
        for (let i = index; i < newIsAnimated.length; i++) {
          newIsAnimated[i] = false;
        }
      } else {
        for (let i = 0; i <= index; i++) {
          newIsAnimated[i] = true;
        }
      }
      // Calculate new water value based on the number of filled droplets
      newWaterValue = newIsAnimated.filter(Boolean).length * 0.5;
      const newUserData = { ...userData, water: newWaterValue };
      setUserData(newUserData);
      return newIsAnimated;
    });
  };
  useEffect(() => {
    if (isAnimated.some((value) => value)) {
      playerRef.current?.playFromBeginning();
    }
  }, [isAnimated]);

  const handleCalories = (value) => {
    setCalories(value);
  };

  const handleCaloriesConsumed = (value) => {
    setCalories((prevCalories) => prevCalories + value);
  };

  const handleCaloriesBurned = (value) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      caloriesBurned: (prevUserData.caloriesBurned || 0) + value,
    }));
  };

  const remainingCalories = userData.daily_calories
    ? userData.daily_calories - calories
    : 0;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const breakfastAnimation = useRef(null);
  const lunchAnimation = useRef(null);
  const dinnerAnimation = useRef(null);
  const snackAnimation = useRef(null);
  const stretchAnimation = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      breakfastAnimation.current.play();
      lunchAnimation.current.play();
      dinnerAnimation.current.play();
      snackAnimation.current.play();
      stretchAnimation.current.play();
    }, 4000); // 4 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  let progress = userData.daily_calories
    ? calories / userData.daily_calories
    : 0;
  progress = Math.min(Math.max(progress, 0), 1);

  const getColor = (progress) => {
    if (progress === 0) return "grey";
    if (progress < 0.3) return "red";
    if (progress < 0.6) return "orange";
    return "green";
  };

  const color = getColor(progress);

  const totalCalories = userData.daily_calories; // extract daily_calories from user data
  const breakfastCalories = Math.round(totalCalories * 0.15); // 15% of total
  const lunchCalories = Math.round(totalCalories * 0.3); // 35% of total
  const dinnerCalories = Math.round(totalCalories * 0.4); // 35% of total
  const snackCalories = Math.round(totalCalories * 0.15); // 15% of total

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        {selectedMeal && (
          <Modal
            animationType="fade"
            transparent={false}
            visible={selectedMeal !== null}
            onRequestClose={() => setSelectedMeal(null)}
          >
            <MealDetails
              meal={selectedMeal}
              onClose={() => {
                setSelectedMeal(null);
                setRefreshKey((oldKey) => oldKey + 1); // Increment refreshKey to trigger a refresh
              }}
            />
          </Modal>
        )}
        <View className="w-full flex-col items-center justify-start min-h-[85vh] px-8">
          <Image
            source={images.logo}
            className="w-[200px] h-[200px] mt-[-50px]"
            resizeMode="contain"
          />
          <View className="flex-col items-center w-full mt-[-40px]">
            <View className="items-center relative">
              <Progress.Circle
                progress={progress}
                size={180}
                showsText={false}
                color={color}
              />
              <View className="items-center absolute top-14">
                <Text className="font-jbold text-5xl leading-[50px]">
                  {remainingCalories}
                </Text>
                <Text className="font-jlight text-xl mb-1 ml-1">KCAL LEFT</Text>
              </View>
            </View>
            <View className="flex-row justify-between w-full items-center mt-[-20px]">
              <View className="items-center">
                <View className="flex-row items-end">
                  <Text className="font-jbold text-3xl">{calories}</Text>
                  <Text className="font-jlight text-xs mb-1 ml-1">kcal</Text>
                </View>
                <Text className="font-jlight text-l">EATEN</Text>
              </View>
              <View className="items-center">
                <View className="flex-row items-end">
                  <Text className="font-jbold text-3xl">
                    {userData.caloriesBurned}
                  </Text>
                  <Text className="font-jlight text-xs mb-1 ml-1">kcal</Text>
                </View>
                <Text className="font-jlight text-l">BURNED</Text>
              </View>
            </View>
          </View>
          <View className="flex-row justify-around w-full mt-8 items-center border-2 border-secondary p-3">
            <View className="items-center">
              <Text className="font-jbold text-l">PROTEIN</Text>
              <Progress.Bar
                progress={
                  userData.protein && userData.daily_protein
                    ? userData.protein / userData.daily_protein
                    : 0
                }
                width={100}
                color={"#191919"}
                borderWidth={1}
                borderColor="#191919"
                borderRadius={0}
              />
              <View className="flex-row mt-1">
                <Text className="font-jlight text-xs">
                  {userData.protein}/{userData.daily_protein}
                </Text>
                <Text className="font-jlight text-xs mb-1 ml-1">g</Text>
              </View>
            </View>
            <View className="items-center">
              <Text className="font-jbold text-l">CARBS</Text>
              <Progress.Bar
                progress={
                  userData.carbs && userData.daily_carbs
                    ? userData.carbs / userData.daily_carbs
                    : 0
                }
                width={100}
                color={"#191919"}
                borderWidth={1}
                borderColor="#191919"
                borderRadius={0}
              />
              <View className="flex-row mt-1">
                <Text className="font-jlight text-xs">
                  {userData.carbs}/{userData.daily_carbs}
                </Text>
                <Text className="font-jlight text-xs mb-1 ml-1">g</Text>
              </View>
            </View>
            <View className="items-center">
              <Text className="font-jbold text-l">FAT</Text>
              <Progress.Bar
                progress={
                  userData.fat && userData.daily_fat
                    ? userData.fat / userData.daily_fat
                    : 0
                }
                width={100}
                color={"#191919"}
                borderWidth={1}
                borderColor="#191919"
                borderRadius={0}
              />
              <View className="flex-row mt-1">
                <Text className="font-jlight text-xs">
                  {userData.fat}/{userData.daily_fat}
                </Text>
                <Text className="font-jlight text-xs mb-1 ml-1">g</Text>
              </View>
            </View>
          </View>
          <View className="flex-col justify-between w-full mt-8 items-center border-2 border-secondary p-3">
            <View className="flex-row justify-between w-full">
              <Text className="font-jbold text-l">WATER</Text>
              <View className="flex-row items-center">
                <Text className="font-jbold text-xs">{userData.water}</Text>
                <Text className="font-jlight text-xs  ml-1">L</Text>
              </View>
            </View>
            <View className="flex-row mt-2">
              {Array(6)
                .fill()
                .map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleWaterDropClick(index)}
                  >
                    {isAnimated[index] ? (
                      <LottieView
                        source={animations.waterdropleta}
                        autoPlay
                        loop={false}
                        style={{ width: 50, height: 50 }}
                      />
                    ) : (
                      <Image
                        source={images.waterdroplet}
                        style={{ width: 50, height: 50 }}
                      />
                    )}
                  </TouchableOpacity>
                ))}
            </View>
          </View>
          <View className="flex-col justify-between w-full mt-8 pb-10">
            <TouchableOpacity
              className="flex-row items-center border-2 border-secondary p-4 mb-2"
              onPress={() => setSelectedMeal("Breakfast")}
            >
              <LottieView
                ref={breakfastAnimation}
                source={animations.breakfast}
                loop={false}
                style={{ width: 45, height: 45 }}
              />
              <View>
                <Text className="font-jbold text-l">Breakfast</Text>
                <Text className="font-jlight text-xs">
                  Recommended{" "}
                  <Text className="font-jbold">{breakfastCalories}</Text> -{" "}
                  <Text className="font-jbold">{breakfastCalories + 100}</Text>{" "}
                  kcal
                </Text>
              </View>
            </TouchableOpacity>
            <View className="flex-row items-center border-2 border-secondary p-4 mb-2">
              <LottieView
                ref={lunchAnimation}
                source={animations.lunch}
                loop={false}
                style={{ width: 45, height: 45 }}
              />
              <View>
                <Text className="font-jbold text-l">Lunch</Text>
                <Text className="font-jlight text-xs">
                  Recommended{" "}
                  <Text className="font-jbold">{lunchCalories}</Text> -{" "}
                  <Text className="font-jbold">{lunchCalories + 100}</Text> kcal
                </Text>
              </View>
            </View>
            <View className="flex-row items-center border-2 border-secondary p-4 mb-2">
              <LottieView
                ref={dinnerAnimation}
                source={animations.dinner}
                loop={false}
                style={{ width: 45, height: 45 }}
              />
              <View>
                <Text className="font-jbold text-l">Dinner</Text>
                <Text className="font-jlight text-xs">
                  Recommended{" "}
                  <Text className="font-jbold">{dinnerCalories}</Text> -{" "}
                  <Text className="font-jbold">{dinnerCalories + 150}</Text>{" "}
                  kcal
                </Text>
              </View>
            </View>
            <View className="flex-row items-center border-2 border-secondary p-4 mb-2">
              <LottieView
                ref={snackAnimation}
                source={animations.snack}
                loop={false}
                style={{ width: 45, height: 45 }}
              />
              <View>
                <Text className="font-jbold text-l">Snacks</Text>
                <Text className="font-jlight text-xs">
                  Recommended{" "}
                  <Text className="font-jbold">{snackCalories}</Text> -{" "}
                  <Text className="font-jbold">{snackCalories + 50}</Text> kcal
                </Text>
              </View>
            </View>
            <View className="flex-row items-center border-2 border-secondary p-4">
              <LottieView
                ref={stretchAnimation}
                source={animations.stretch}
                loop={false}
                style={{ width: 45, height: 45 }}
              />
              <View>
                <Text className="font-jbold text-l">Exercise</Text>
                <Text className="font-jlight text-xs">
                  Recommended <Text className="font-jbold">30</Text> mins
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Diary;
