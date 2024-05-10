import { View, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import animations from "../../constants/animations";

const Recipes = () => {
  const movinglinesintro = animations.movinglinesintro;
  return (
    <View className="flex-1 justify-center items-center">
      <LottieView
        source={movinglinesintro}
        autoPlay
        loop
        style={{ position: "absolute", top: 100, left: 0, right: 0, bottom: 0 }}
      />
      <Text className="text-3xl text-secondary mt-3 font-jbold text-center">
        RECIPES
      </Text>
    </View>
  );
};

export default Recipes;
