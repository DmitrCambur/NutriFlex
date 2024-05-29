import React, { useEffect, useState, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import { fetchRecipes } from "../../context/RecipesAPI";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import icons from "../../constants/icons";
import { getCurrentUser } from "../../lib/appwrite";
import RecipeContext from "../../context/RecipeContext";
import RecipeDetails from "../../components/RecipeDetails";
import { Link } from "react-router-dom";

const Recipes = () => {
  const [query, setQuery] = useState("");
  const [breakfastRecipes, setBreakfastRecipes] = useState([]);
  const [lunchRecipes, setLunchRecipes] = useState([]);
  const [dinnerRecipes, setDinnerRecipes] = useState([]);
  const [snackRecipes, setSnackRecipes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [userData, setUserData] = useState({ daily_calories: 0 });
  const [currentUser, setCurrentUser] = useState(null);
  const { setSelectedRecipe } = useContext(RecipeContext);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const dietFilters = [
    "balanced",
    "high-fiber",
    "high-protein",
    "low-carb",
    "low-fat",
    "low-sodium",
  ];

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeDetails(true);
  };
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log("Current user:", user);
        setCurrentUser(user);
        setUserData((prevState) => ({
          ...prevState,
          daily_calories: user.daily_calories,
        }));
        console.log("User's daily calories:", user.daily_calories); // Log the daily_calories value
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentUser();
  }, []);
  const dietFilterRows = [];
  for (let i = 0; i < dietFilters.length; i += 3) {
    dietFilterRows.push(dietFilters.slice(i, i + 3));
  }
  const handleFilterChange = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };
  useEffect(() => {
    const totalCalories = userData.daily_calories;
    const breakfastCalories = Math.round(totalCalories * 0.15);
    const lunchCalories = Math.round(totalCalories * 0.3);
    const dinnerCalories = Math.round(totalCalories * 0.4);
    const snackCalories = Math.round(totalCalories * 0.15);

    console.log("Total daily calories:", totalCalories);
    console.log("Breakfast calories:", breakfastCalories);
    console.log("Lunch calories:", lunchCalories);
    console.log("Dinner calories:", dinnerCalories);
    console.log("Snack calories:", snackCalories);

    const breakfastCaloriesRange = `${breakfastCalories}-${
      breakfastCalories + 150
    }`;
    const lunchCaloriesRange = `${lunchCalories}-${lunchCalories + 250}`;
    const dinnerCaloriesRange = `${dinnerCalories}-${dinnerCalories + 250}`;
    const snackCaloriesRange = `${snackCalories}-${snackCalories + 100}`;

    console.log("Breakfast calories range:", breakfastCaloriesRange);
    console.log("Lunch calories range:", lunchCaloriesRange);
    console.log("Dinner calories range:", dinnerCaloriesRange);
    console.log("Snack calories range:", snackCaloriesRange);

    fetchRecipes(query, ["Breakfast"], breakfastCaloriesRange, selectedFilters)
      .then((data) => {
        setBreakfastRecipes(data.hits);
      })
      .catch((error) => console.error("Error:", error));

    fetchRecipes(query, ["Lunch"], lunchCaloriesRange, selectedFilters)
      .then((data) => {
        setLunchRecipes(data.hits);
      })
      .catch((error) => console.error("Error:", error));

    fetchRecipes(query, ["Dinner"], dinnerCaloriesRange, selectedFilters)
      .then((data) => {
        setDinnerRecipes(data.hits);
      })
      .catch((error) => console.error("Error:", error));

    fetchRecipes(query, ["Snack"], snackCaloriesRange, selectedFilters)
      .then((data) => {
        setSnackRecipes(data.hits);
      })
      .catch((error) => console.error("Error:", error));
  }, [query, selectedFilters, userData]);

  const renderRecipes = (recipes) => {
    const uniqueRecipes = [
      ...new Set(recipes.map((recipe) => recipe.recipe.label)),
    ];

    return (
      <ScrollView horizontal>
        {uniqueRecipes &&
          uniqueRecipes.length > 0 &&
          uniqueRecipes.slice(0, 20).map((label, index) => {
            const recipe = recipes.find((r) => r.recipe.label === label);
            return (
              <View
                key={index}
                className="mr-3 w-36 h-48"
                onTouchEnd={() => handleRecipeClick(recipe)}
              >
                <Image
                  source={{ uri: recipe.recipe.image }}
                  className="w-36 h-24"
                />
                <View className="mt-2">
                  <Text className="font-jbold">{recipe.recipe.label}</Text>
                  <Text className="font-jlight text-xs">
                    {Math.round(recipe.recipe.calories)} kcal
                  </Text>
                </View>
              </View>
            );
          })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        {showRecipeDetails ? (
          <RecipeDetails onBack={() => setShowRecipeDetails(false)} />
        ) : (
          <View className="w-full flex-col items-center justify-start min-h-[85vh] px-8">
            <Image
              source={images.logo}
              className="w-[200px] h-[200px] mt-[-50px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center bg-secondary border-2 border-secondary h-11 mt-[-40px]">
              <Image
                source={icons.search}
                className="ml-2 w-5 h-5 text-primary"
              />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search Recipes"
                placeholderTextColor="white"
                className="text-xl text-primary pl-4 font-jbold text-left flex-grow"
              />
              <TouchableOpacity onPress={toggleFilters}>
                <Image
                  source={icons.filter}
                  className="mr-2 w-6 h-6 text-primary"
                />
              </TouchableOpacity>
            </View>
            {showFilters &&
              dietFilterRows.map((row, rowIndex) => (
                <View
                  key={rowIndex}
                  className="flex-row justify-around w-full p-2 mb-0 border-r-2 border-b-2 border-l-2 border-secondary"
                >
                  {row.map((filter) => (
                    <View key={filter} style={{ width: "32%", margin: "1%" }}>
                      <TouchableOpacity
                        className={`h-10 justify-center items-center ${
                          selectedFilters.includes(filter)
                            ? "border-2 bg-secondary"
                            : "border-2 border-secondary bg-primary"
                        }`}
                        onPress={() => handleFilterChange(filter)}
                      >
                        <Text
                          className={`font-jbold text-sm text-center ${
                            selectedFilters.includes(filter)
                              ? "text-primary"
                              : "text-secondary"
                          }`}
                        >
                          {filter}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))}
            <Text className="text-base mt-10 mb-2 text-secondary font-jbold text-left w-full">
              BREAKFAST
            </Text>
            {renderRecipes(breakfastRecipes)}
            <Text className="text-base mb-2 text-secondary font-jbold text-left w-full">
              LUNCH
            </Text>
            {renderRecipes(lunchRecipes)}
            <Text className="text-base mb-2 text-secondary font-jbold text-left w-full">
              DINNER
            </Text>
            {renderRecipes(dinnerRecipes)}
            <Text className="text-base mb-2 text-secondary font-jbold text-left w-full">
              SNACK
            </Text>
            {renderRecipes(snackRecipes)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Recipes;
