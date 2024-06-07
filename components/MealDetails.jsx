import { useContext, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import RecipeContext from "../context/RecipeContext";
import icons from "../constants/icons";
import animations from "../constants/animations";
import LottieView from "lottie-react-native";
import UserContext from "../context/UserContext";
import {
  config,
  getDocument,
  updateUser,
  getCurrentUser,
} from "../lib/appwrite";
import * as Progress from "react-native-progress";

const MealDetails = ({ meal, onClose }) => {
  const [userInfo, setUserInfo] = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [userState, setUserState] = useState(userInfo);
  const [refreshKey, setRefreshKey] = useState(0); // Add this line

  useEffect(() => {
    setUserState(userInfo);
  }, [userInfo]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.$id) {
      getDocument(config.databaseId, currentUser.$collectionId, currentUser.$id)
        .then((document) => {
          setUserInfo(document);
        })
        .catch((err) => console.error(err));
    }
  }, [currentUser]);
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="flex-1 bg-primary">
          <View className="flex-row items-center justify-center p-4 bg-secondary">
            <TouchableOpacity onPress={onClose}>
              <Image
                source={icons.leftArrow}
                className="w-8 h-6"
                tintColor="white"
              />
            </TouchableOpacity>
            <View className="flex-1 items-center">
              <Text className="text-3xl font-jbold mr-5 text-primary">
                {meal}
              </Text>
            </View>
          </View>
          <View className="px-5 bg-secondary pb-9">
            <View className="flex-row justify-center w-full mt-8 items-center border-2 border-primary p-3">
              <View className="flex-1 items-center">
                <View className="flex-row justify-between w-full">
                  <Text className="font-jbold text-l text-primary">
                    Daily Intake
                  </Text>
                  <View className="flex-row mt-1">
                    <Text className="font-jlight text-xs text-primary">
                      {userInfo.calories}/{userInfo.daily_calories}
                    </Text>
                    <Text className="font-jlight text-xs mb-1 ml-1 text-primary">
                      kcal
                    </Text>
                  </View>
                </View>
                <Progress.Bar
                  progress={
                    userInfo.calories && userInfo.daily_calories
                      ? userInfo.calories / userInfo.daily_calories
                      : 0
                  }
                  width={null} // Remove the fixed width
                  color={"#F5F5F5"}
                  borderWidth={1}
                  borderColor="#F5F5F5"
                  borderRadius={0}
                  className="w-full" // Add full width
                />
                <View className="flex-row justify-between w-full mt-4">
                  <Text className="font-jbold text-l text-primary">
                    Protein
                  </Text>
                  <View className="flex-row mt-1">
                    <Text className="font-jlight text-xs text-primary">
                      {userInfo.protein}/{userInfo.daily_protein}
                    </Text>
                    <Text className="font-jlight text-xs mb-1 ml-1 text-primary">
                      g
                    </Text>
                  </View>
                </View>
                <Progress.Bar
                  progress={
                    userInfo.protein && userInfo.daily_protein
                      ? userInfo.protein / userInfo.daily_protein
                      : 0
                  }
                  width={null} // Remove the fixed width
                  color={"#F5F5F5"}
                  borderWidth={1}
                  borderColor="#F5F5F5"
                  borderRadius={0}
                  className="w-full" // Add full width
                />
                <View className="flex-row justify-between w-full mt-4">
                  <Text className="font-jbold text-l text-primary">Carbs</Text>
                  <View className="flex-row mt-1">
                    <Text className="font-jlight text-xs text-primary">
                      {userInfo.carbs}/{userInfo.daily_carbs}
                    </Text>
                    <Text className="font-jlight text-xs mb-1 ml-1 text-primary">
                      g
                    </Text>
                  </View>
                </View>
                <Progress.Bar
                  progress={
                    userInfo.carbs && userInfo.daily_carbs
                      ? userInfo.carbs / userInfo.daily_carbs
                      : 0
                  }
                  width={null} // Remove the fixed width
                  color={"#F5F5F5"}
                  borderWidth={1}
                  borderColor="#F5F5F5"
                  borderRadius={0}
                  className="w-full" // Add full width
                />
                <View className="flex-row justify-between w-full mt-4">
                  <Text className="font-jbold text-l text-primary">Fat</Text>
                  <View className="flex-row mt-1">
                    <Text className="font-jlight text-xs text-primary">
                      {userInfo.fat}/{userInfo.daily_fat}
                    </Text>
                    <Text className="font-jlight text-xs mb-1 ml-1 text-primary">
                      g
                    </Text>
                  </View>
                </View>
                <Progress.Bar
                  progress={
                    userInfo.fat && userInfo.daily_fat
                      ? userInfo.fat / userInfo.daily_fat
                      : 0
                  }
                  width={null} // Remove the fixed width
                  color={"#F5F5F5"}
                  borderWidth={1}
                  borderColor="#F5F5F5"
                  borderRadius={0}
                  className="w-full" // Add full width
                />
              </View>
            </View>
          </View>
          <View className="px-5 bg-primary">
            <Text className="font-jbold text-3xl mt-5 text-secondary">
              Meals
            </Text>
            <View className="flex-row justify-center w-full mt-4 items-center">
              <View className="flex-1 items-center">
                {userInfo.meals.map((mealString, index) => {
                  try {
                    const meal = JSON.parse(mealString);
                    if (meal.mealType && meal.mealType.includes("breakfast")) {
                      return (
                        <View
                          key={index}
                          className={`flex-col justify-between w-full mt-1 border-2 border-secondary ${
                            index !== 0 ? "p-3" : " p-3"
                          }`}
                        >
                          <Text
                            className="font-jbold text-l text-secondary"
                            style={{ marginRight: 10 }}
                          >
                            {meal.title}
                          </Text>
                          <View className="flex-row mt-1">
                            <Text className="font-jlight text-xs text-secondary">
                              {meal.calories}
                            </Text>
                            <Text className="font-jlight text-xs mb-1 ml-1 text-secondary">
                              kcal
                            </Text>
                          </View>
                          <View className="flex-row justify-between mt-4">
                            <View className="text-left flex-row">
                              <TouchableOpacity
                                onPress={async () => {
                                  console.log("Meal info:", meal); // Log meal info
                                  console.log(
                                    "Updating user with accountId:",
                                    userInfo.$id
                                  ); // Log accountId
                                  console.log(
                                    "User's current nutritional info:",
                                    {
                                      calories: userInfo.calories,
                                      protein: userInfo.protein,
                                      carbs: userInfo.carbs,
                                      fat: userInfo.fat,
                                    }
                                  ); // Log user's current nutritional info
                                  const updatedUserInfo = {
                                    calories: userInfo.calories + meal.calories,
                                    protein:
                                      userInfo.protein +
                                      Math.round(
                                        parseFloat(meal.nutrients.protein)
                                      ),
                                    carbs:
                                      userInfo.carbs +
                                      Math.round(
                                        parseFloat(meal.nutrients.carbs)
                                      ),
                                    fat:
                                      userInfo.fat +
                                      Math.round(
                                        parseFloat(meal.nutrients.fat)
                                      ),
                                  };
                                  try {
                                    await updateUser(
                                      userInfo.$id,
                                      updatedUserInfo
                                    ); // Use userInfo.$id as the document ID
                                    setUserState(updatedUserInfo);
                                    setRefreshKey((oldKey) => oldKey + 1); // Add this line
                                    console.log(
                                      "User's updated nutritional info:",
                                      updatedUserInfo
                                    ); // Log user's updated nutritional info
                                    // Update the local state if necessary
                                  } catch (error) {
                                    console.error(
                                      "Error updating user info:",
                                      error
                                    );
                                  }
                                }}
                              >
                                <Image
                                  className="w-8 h-8"
                                  source={icons.plus}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={async () => {
                                  console.log(
                                    "Updating user with accountId:",
                                    userInfo.$id
                                  ); // Log accountId
                                  console.log(
                                    "User's current nutritional info:",
                                    {
                                      calories: userInfo.calories,
                                      protein: userInfo.protein,
                                      carbs: userInfo.carbs,
                                      fat: userInfo.fat,
                                    }
                                  ); // Log user's current nutritional info
                                  const updatedUserInfo = {
                                    calories: userInfo.calories - meal.calories,
                                    protein:
                                      userInfo.protein -
                                      Math.round(
                                        parseFloat(meal.nutrients.protein)
                                      ),
                                    carbs:
                                      userInfo.carbs -
                                      Math.round(
                                        parseFloat(meal.nutrients.carbs)
                                      ),
                                    fat:
                                      userInfo.fat -
                                      Math.round(
                                        parseFloat(meal.nutrients.fat)
                                      ),
                                  };
                                  try {
                                    await updateUser(
                                      userInfo.$id,
                                      updatedUserInfo
                                    ); // Use userInfo.$id as the document ID
                                    setUserState(updatedUserInfo);
                                    setRefreshKey((oldKey) => oldKey + 1); // Add this line
                                    console.log(
                                      "User's updated nutritional info:",
                                      updatedUserInfo
                                    ); // Log user's updated nutritional info
                                    // Update the local state if necessary
                                  } catch (error) {
                                    console.error(
                                      "Error updating user info:",
                                      error
                                    );
                                  }
                                }}
                              >
                                <Image
                                  className="w-8 h-8 ml-6"
                                  source={icons.minus}
                                />
                              </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                              onPress={async () => {
                                console.log("Deleting meal with id:", meal.id); // Log meal id
                                const updatedMeals = userInfo.meals.filter(
                                  (mealString) => {
                                    const mealObject = JSON.parse(mealString);
                                    return mealObject.id !== meal.id;
                                  }
                                );
                                try {
                                  await updateUser(userInfo.$id, {
                                    meals: updatedMeals,
                                  }); // Use userInfo.$id as the document ID
                                  setUserState({
                                    ...userState,
                                    meals: updatedMeals,
                                  });
                                  setRefreshKey((oldKey) => oldKey + 1); // Add this line
                                  console.log(
                                    "Meal deleted. Updated meals:",
                                    updatedMeals
                                  ); // Log updated meals
                                  // Update the local state if necessary
                                } catch (error) {
                                  console.error("Error deleting meal:", error);
                                }
                              }}
                            >
                              <Image
                                className="w-7 h-8 ml-2"
                                source={icons.trash}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }
                  } catch (error) {
                    console.error("Error parsing JSON:", error);
                  }
                })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MealDetails;
