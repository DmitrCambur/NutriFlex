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
import images from "../../constants/images";
import * as Progress from "react-native-progress";
import { config, getDocument } from "../../lib/appwrite";

const Diary = () => {
  const [userInfo, setUserInfo] = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [calories, setCalories] = useState(0);

  const handleCalories = (value) => {
    setCalories(value);
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
  useEffect(() => {
    getDocument(config.databaseId, userInfo.$collectionId, userInfo.$id)
      .then((document) => {
        setUserData(document);
        console.log("User data:", document); // using two arguments
        console.log("User daily calories burned:", document.protein); // Log user's daily calories
      })
      .catch((err) => console.error(err));
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

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex-col items-center justify-start min-h-[85vh] px-8">
          <Image
            source={images.logo}
            className="w-[200px] h-[200px] mt-[-50px]"
            resizeMode="contain"
          />
          <View className="flex-row justify-between w-full mt-[-40px] items-center">
            <View className="items-center">
              <View className="flex-row items-end">
                <Text className="font-jbold text-3xl">{calories}</Text>
                <Text className="font-jlight text-xs mb-1 ml-1">kcal</Text>
              </View>
              <Text className="font-jlight text-l">EATEN</Text>
            </View>
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
                .map((_, i) => (
                  <Image
                    key={i}
                    source={images.waterdroplet}
                    style={{ width: 50, height: 50 }}
                  />
                ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Diary;
