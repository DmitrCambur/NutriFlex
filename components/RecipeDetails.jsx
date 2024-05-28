import { useContext } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import RecipeContext from "../context/RecipeContext";
import icons from "../constants/icons";

const RecipeDetails = ({ onBack }) => {
  const { selectedRecipe } = useContext(RecipeContext);

  // Get the screen height
  const screenHeight = Dimensions.get("window").height;

  // Calculate 35% of the screen height
  const imageHeight = screenHeight * 0.45;

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
          className="w-7 h-6 ml-2"
          tintColor="white"
        />
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
