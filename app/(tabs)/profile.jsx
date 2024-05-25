import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { router } from "expo-router";
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
import { Player } from "@lordicon/react";
import {
  calculateDailyIntake,
  saveToDatabase,
} from "../../context/Calculations";
import LottieView from "lottie-react-native";
import animations from "../../constants/animations";
import { useGlobalContext } from "../../context/GlobalProvider";
import images from "../../constants/images";
import * as Progress from "react-native-progress";
import {
  config,
  getDocument,
  updateUser,
  deleteCurrentSession,
} from "../../lib/appwrite";

const Profile = () => {
  const { userGlobal, setGlobalUser, setIsLogged, isLogged } =
    useGlobalContext();
  const [userInfo, setUserInfo] = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openView, setOpenView] = useState(null);
  const [playAnimation, setPlayAnimation] = useState(null);

  const logout = async () => {
    if (isLogged) {
      try {
        await deleteCurrentSession();
        setGlobalUser(null);
        setIsLogged(false);
        router.replace("/sign-in");
      } catch (error) {
        console.error("Failed to delete session:", error);
      }
    } else {
      console.log("User is not logged in");
    }
  };

  useEffect(() => {
    if (userGlobal && userGlobal.$id) {
      getDocument(config.databaseId, userGlobal.$collectionId, userGlobal.$id)
        .then((document) => {
          setUserData(document);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    } else {
      console.log("User ID is undefined");
    }
  }, [userGlobal]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex-col items-center justify-start min-h-[85vh] px-8">
          <Image
            source={images.logo}
            className="w-[200px] h-[200px] mt-[-50px]"
            resizeMode="contain"
          />
          {!loading && userData && (
            <View className="border-2 border-secondary p-3 mt-[-40px] w-full">
              <View className="flex-row items-start">
                <Image
                  source={{ uri: userData.avatar }}
                  className="w-20 h-20"
                />
                <View className="ml-3">
                  <Text className="font-jbold text-2xl">
                    {userData.username}
                  </Text>
                  <Text className="font-jlight text-s">
                    {calculateAge(userData.dateOfBirth)} years old
                  </Text>
                </View>
              </View>
              <View className="border-t-2 border-secondary my-4"></View>
              <View className="flex-row justify-between">
                <Text className="font-jlight text-base">Current Weight</Text>
                <Text className="font-jbold">{userData.weight} kg</Text>
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="font-jlight text-base">Goal Weight</Text>
                <Text className="font-jbold">{userData.goalweight} kg</Text>
              </View>
            </View>
          )}
          <View className="w-full mt-8">
            <Text className="font-jbold text-sm">CUSTOMIZATION</Text>
            <View className="border-b-2 border-secondary">
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (openView === "personal") {
                    setOpenView(null);
                    setPlayAnimation(null);
                  } else {
                    setOpenView("personal");
                    setPlayAnimation("personavatar");
                  }
                }}
              >
                <View className="mt-5 flex-row items-center pb-1">
                  <LottieView
                    source={animations.personavatar}
                    autoPlay={playAnimation === "personavatar"}
                    loop={false}
                    style={{ width: 40, height: 40 }}
                  />
                  <Text className="font-jlight text-lg ml-2">
                    Personal details
                  </Text>
                </View>
              </TouchableOpacity>
              {openView === "personal" && (
                <View className="p-2">
                  <View className="flex-row justify-between items-center my-2">
                    <View className="flex-1 flex-row justify-between items-center">
                      <Text className="font-jbold text-base">Weight</Text>
                      <TouchableOpacity
                        className="w-20 h-10 border-secondary border-2 justify-center items-center mr-4"
                        onPress={() => {
                          // Handle the click event here
                          console.log(`Clicked on Weight`);
                        }}
                      >
                        <Text className="text-base font-jbold">
                          {userData.weight} {userData.unit}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-1 flex-row justify-between items-center">
                      <Text className="font-jbold text-base">Height</Text>
                      <TouchableOpacity
                        className="w-20 h-10 border-secondary border-2 justify-center items-center mr-4"
                        onPress={() => {
                          // Handle the click event here
                          console.log(`Clicked on Height`);
                        }}
                      >
                        <Text className="text-base font-jbold">
                          {userData.height} {userData.heightUnit}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center my-2">
                    <View className="flex-1 flex-row justify-between items-center">
                      <Text className="font-jbold text-base mr-2">
                        Goalweight
                      </Text>
                      <TouchableOpacity
                        className="w-20 h-10 border-secondary border-2 justify-center items-center mr-4"
                        onPress={() => {
                          // Handle the click event here
                          console.log(`Clicked on Goalweight`);
                        }}
                      >
                        <Text className="text-base font-jbold">
                          {userData.goalweight} {userData.goalweightUnit}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-1 flex-row justify-end items-center">
                      <Text className="font-jbold text-base mr-2">Age</Text>
                      <TouchableOpacity
                        className="w-20 h-10 border-secondary border-2 justify-center items-center mr-4"
                        onPress={() => {
                          // Handle the click event here
                          console.log(`Clicked on Date of Birth`);
                        }}
                      >
                        <Text className="text-base font-jbold">
                          dateofBirth
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center my-2">
                    <View className="flex-1 flex-row justify-between items-center">
                      <Text className="font-jbold text-base mr-2">Waist</Text>
                      <TouchableOpacity
                        className="w-20 h-10 border-secondary border-2 justify-center items-center mr-4"
                        onPress={() => {
                          // Handle the click event here
                          console.log(`Clicked on Waist`);
                        }}
                      >
                        <Text className="text-base font-jbold">
                          {userData.waist} {userData.heightUnit}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-1 flex-row justify-end items-center">
                      <Text className="font-jbold text-base mr-2">Chest</Text>
                      <TouchableOpacity
                        className="w-20 h-10 border-secondary border-2 justify-center items-center mr-4"
                        onPress={() => {
                          // Handle the click event here
                          console.log(`Clicked on Chest`);
                        }}
                      >
                        <Text className="text-base font-jbold">
                          {userData.chest} {userData.heightUnit}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center my-2">
                    <View className="flex-1 flex-row items-center">
                      <Text className="font-jbold text-base mr-2">
                        Ethnicity
                      </Text>
                      <TouchableOpacity
                        className="flex-1 h-10 border-secondary border-2 justify-center items-center mr-4"
                        onPress={() => {
                          // Handle the click event here
                          console.log(`Clicked on Ethnicity`);
                        }}
                      >
                        <Text className="text-base font-jbold">
                          {userData.ethnicity}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="flex-row justify-center items-center my-2">
                    <View className="flex-1 flex-row items-center">
                      <Text className="font-jbold text-base mr-2">Gender</Text>
                      <TouchableOpacity
                        className="w-20 h-10 border-secondary border-2 justify-center items-center mr-4"
                        onPress={() => {
                          // Handle the click event here
                          console.log(`Clicked on Gender`);
                        }}
                      >
                        <Text className="text-base font-jbold">
                          {userData.gender}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View className="border-b-2 border-secondary">
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (openView === "dietary") {
                    setOpenView(null);
                    setPlayAnimation(null);
                  } else {
                    setOpenView("dietary");
                    setPlayAnimation("gluten");
                  }
                }}
              >
                <View className="mt-5 flex-row items-center pb-1">
                  <LottieView
                    source={animations.gluten}
                    autoPlay={playAnimation === "gluten"}
                    loop={false}
                    style={{ width: 40, height: 40 }}
                  />
                  <Text className="font-jlight text-lg ml-2">
                    Dietary preferences
                  </Text>
                </View>
              </TouchableOpacity>
              {openView === "dietary" && (
                <View className="p-2">
                  <View className="flex-row justify-between items-center my-2">
                    <TouchableOpacity
                      className="flex-1 h-10 border-secondary border-2 justify-center items-center mr-2"
                      onPress={() => {
                        // Handle the click event here
                        console.log(`Clicked on Gluten`);
                      }}
                    >
                      <Text className="font-jbold text-base">Gluten</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 h-10 border-secondary border-2 justify-center items-center mr-2"
                      onPress={() => {
                        // Handle the click event here
                        console.log(`Clicked on Nuts`);
                      }}
                    >
                      <Text className="font-jbold text-base">Nuts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 h-10 border-secondary border-2 justify-center items-center mr-2"
                      onPress={() => {
                        // Handle the click event here
                        console.log(`Clicked on Dairy`);
                      }}
                    >
                      <Text className="font-jbold text-base">Dairy</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row justify-start items-center my-2">
                    <TouchableOpacity
                      className="flex-1 h-10 border-secondary border-2 justify-center items-center mr-2"
                      onPress={() => {
                        // Handle the click event here
                        console.log(`Clicked on Egg`);
                      }}
                    >
                      <Text className="font-jbold text-base">Egg</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 h-10 border-secondary border-2 justify-center items-center mr-2"
                      onPress={() => {
                        // Handle the click event here
                        console.log(`Clicked on Soy`);
                      }}
                    >
                      <Text className="font-jbold text-base">Soy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 h-10 border-secondary border-2 justify-center items-center mr-2"
                      onPress={() => {
                        // Handle the click event here
                        console.log(`Clicked on Fish`);
                      }}
                    >
                      <Text className="font-jbold text-base">Fish</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <View className="border-b-2 border-secondary">
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (openView === "notifications") {
                    setOpenView(null);
                    setPlayAnimation(null);
                  } else {
                    setOpenView("notifications");
                    setPlayAnimation("bell");
                  }
                }}
              >
                <View className="mt-5 flex-row items-center pb-1">
                  <LottieView
                    source={animations.bell}
                    autoPlay={playAnimation === "bell"}
                    loop={false}
                    style={{ width: 40, height: 40 }}
                  />
                  <Text className="font-jlight text-lg ml-2">
                    Notifications
                  </Text>
                </View>
              </TouchableOpacity>
              {openView === "notifications" && (
                <Text className="p-3">!!!!!!!!!!!!!!!!!</Text>
              )}
            </View>
          </View>
          <CustomButton
            title="LOG OUT"
            containerStyles="mt-10"
            handlePress={logout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
