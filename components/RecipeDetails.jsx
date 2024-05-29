import { useContext, useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
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

const RecipeDetails = ({ onBack }) => {
  const { selectedRecipe } = useContext(RecipeContext);
  const [userInfo, setUserInfo] = useContext(UserContext);
  const [loading, setLoading] = useState(true); // Define loading and setLoading
  const [currentUser, setCurrentUser] = useState(null); // Define currentUser and setCurrentUser

  const onPlus = (param1, param2) => {
    console.log("Plus icon was pressed with parameters:", param1, param2);
  };

  // Get the screen height
  const screenHeight = Dimensions.get("window").height;

  // Calculate 35% of the screen height
  const imageHeight = screenHeight * 0.45;

  const handleRecipeAdd = (recipe) => {
    // Check if userInfo is defined
    if (userInfo) {
      // Get the user's current meals
      const currentMeals = userInfo.meals || [];

      // Create a new object with only the necessary data from the recipe
      const simplifiedRecipe = {
        id: recipe.recipe.uri,
        title: recipe.recipe.label,
        image: recipe.recipe.image,
        mealType: recipe.recipe.mealType,
        calories: Math.round(recipe.recipe.calories),
        nutrients: {
          protein: recipe.recipe.totalNutrients.PROCNT.quantity.toFixed(2),
          fat: recipe.recipe.totalNutrients.FAT.quantity.toFixed(2),
          carbs: recipe.recipe.totalNutrients.CHOCDF.quantity.toFixed(2),
          cholesterol: recipe.recipe.totalNutrients.CHOLE.quantity.toFixed(2),
          sodium: recipe.recipe.totalNutrients.NA.quantity.toFixed(2),
          calcium: recipe.recipe.totalNutrients.CA.quantity.toFixed(2),
          magnesium: recipe.recipe.totalNutrients.MG.quantity.toFixed(2),
          potassium: recipe.recipe.totalNutrients.K.quantity.toFixed(2),
          iron: recipe.recipe.totalNutrients.FE.quantity.toFixed(2),
        },
        healthLabels: recipe.recipe.healthLabels,
        // Add any other properties you need
      };

      // Convert simplifiedRecipe to a string
      const recipeString = JSON.stringify(simplifiedRecipe);

      // Check if the recipe string is too long
      if (recipeString.length > 999999) {
        console.error("Recipe string is too long");
        return;
      }

      // Check if the recipe is already in the meals array
      if (
        currentMeals.some((meal) => JSON.parse(meal).id === simplifiedRecipe.id)
      ) {
        console.log("Recipe is already saved");
        return;
      }
      // Add the new recipe to the meals array
      const updatedMeals = [...currentMeals, recipeString];
      console.log("Recipe added successfully");

      // Update the userInfo state
      const newUserInfo = { ...userInfo, meals: updatedMeals };
      setUserInfo(newUserInfo);
    } else {
      console.error("userInfo is undefined");
    }
  };

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
          setLoading(false);
        })
        .catch((err) => console.error(err));
    } else {
    }
  }, [currentUser]);

  useEffect(() => {
    console.log("Loading:", loading);
    // Check if userInfo.$id is defined and not empty
    if (!loading && userInfo && userInfo.$id) {
      updateUser(userInfo.$id, {
        meals: userInfo.meals,
      })
        .then((result) => {
          console.log("Update Result:", result);
        })
        .catch((err) => console.error(err));
    } else {
    }
  }, [userInfo, loading, currentUser]);

  return (
    <View className="flex-1 bg-primary ">
      <Image
        source={{ uri: selectedRecipe.recipe.image }}
        style={{ width: "100%", height: imageHeight }}
        className="mb-3"
      />
      <TouchableOpacity onPress={onBack} className="absolute top-4 left-2">
        <Image
          source={icons.leftArrow}
          className="w-8 h-6 ml-2"
          tintColor="white"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleRecipeAdd(selectedRecipe)}
        className="absolute top-4 right-2"
      >
        <Image source={icons.plus} className="w-9 h-9 mr-2" tintColor="white" />
      </TouchableOpacity>
      <View className="mt-auto text-left ml-3">
        <Text className="text-secondary font-jbold text-2xl">
          {selectedRecipe.recipe.label}
        </Text>
        <Text className="text-secondary font-jlight text-sm mb-4">
          Per Serving 100g
        </Text>
        <Text className="text-secondary font-jlight text-sm">
          Calories:{" "}
          <Text className="font-jbold">
            {Math.round(selectedRecipe.recipe.calories)} kcal
          </Text>
        </Text>
        <Text className="text-secondary font-jlight text-sm">
          Protein:{" "}
          <Text className="font-jbold">
            {selectedRecipe.recipe.totalNutrients.PROCNT.quantity.toFixed(2)}g
          </Text>
        </Text>
        <Text className="text-secondary font-jlight text-sm">
          Fat:{" "}
          <Text className="font-jbold">
            {selectedRecipe.recipe.totalNutrients.FAT.quantity.toFixed(2)}g
          </Text>
        </Text>
        <Text className="text-secondary font-jlight text-sm">
          Carbs:{" "}
          <Text className="font-jbold">
            {selectedRecipe.recipe.totalNutrients.CHOCDF.quantity.toFixed(2)}g
          </Text>
        </Text>
      </View>
      <View className="mt-4 mx-3">
        <View className="flex-row justify-between border-t-2 border-l-2 border-r-2 border-b-2 border-secondary p-2">
          <Text className="text-secondary font-jlight text-base mr-3">
            Cholesterol
          </Text>
          <Text className="text-secondary font-jbold text-base mr-3">
            {selectedRecipe.recipe.totalNutrients.CHOLE.quantity.toFixed(2)}mg
          </Text>
        </View>
        <View className="flex-row justify-between border-l-2 border-r-2 border-b-2 border-secondary p-2">
          <Text className="text-secondary font-jlight text-base">Sodium</Text>
          <Text className="text-secondary font-jbold text-base mr-3">
            {selectedRecipe.recipe.totalNutrients.NA.quantity.toFixed(2)}mg
          </Text>
        </View>
        <View className="flex-row justify-between border-l-2 border-r-2 border-b-2 border-secondary p-2">
          <Text className="text-secondary font-jlight text-base">Calcium</Text>
          <Text className="text-secondary font-jbold text-base mr-3">
            {selectedRecipe.recipe.totalNutrients.CA.quantity.toFixed(2)}mg
          </Text>
        </View>
        <View className="flex-row justify-between border-l-2 border-r-2 border-b-2 border-secondary p-2">
          <Text className="text-secondary font-jlight text-base">
            Magnesium
          </Text>
          <Text className="text-secondary font-jbold text-base mr-3">
            {selectedRecipe.recipe.totalNutrients.MG.quantity.toFixed(2)}mg
          </Text>
        </View>
        <View className="flex-row justify-between border-l-2 border-r-2 border-b-2 border-secondary p-2">
          <Text className="text-secondary font-jlight text-base">
            Potassium
          </Text>
          <Text className="text-secondary font-jbold text-base mr-3">
            {selectedRecipe.recipe.totalNutrients.K.quantity.toFixed(2)}mg
          </Text>
        </View>
        <View className="flex-row justify-between border-l-2 border-r-2 border-b-2 border-secondary p-2 mb-6">
          <Text className="text-secondary font-jlight text-base">Iron</Text>
          <Text className="text-secondary font-jbold text-base mr-3">
            {selectedRecipe.recipe.totalNutrients.FE.quantity.toFixed(2)}mg
          </Text>
        </View>
      </View>
      <View className="mt-4 mx-2 flex flex-row flex-wrap mb-7">
        {selectedRecipe.recipe.healthLabels.map((label, index) => (
          <View key={index} className="border-2 p-2 border-secondary m-1">
            <Text className="text-secondary font-jbold text-sm">{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RecipeDetails;
