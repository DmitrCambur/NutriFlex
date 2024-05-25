import React from "react";
import { View, Text, Button } from "react-native";
import LottieView from "lottie-react-native";
import animations from "../../constants/animations";
import { transferUserDataToDailyEntries } from "../../lib/appwrite";

const Progress = () => {
  const movinglinesintro = animations.movinglinesintro;

  // Function to handle the button press
  const handleTransferButtonClick = async () => {
    try {
      // Call the transferUserDataToDailyEntries function
      await transferUserDataToDailyEntries();
      console.log("Data transfer completed successfully.");
    } catch (error) {
      console.error("Error during data transfer:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LottieView
        source={movinglinesintro}
        autoPlay
        loop
        style={{ position: "absolute", top: 100, left: 0, right: 0, bottom: 0 }}
      />
      <Text style={{ fontSize: 24, marginTop: 20 }}>PROGRESS</Text>

      {/* Button to trigger data transfer */}
      <Button title="Transfer Data" onPress={handleTransferButtonClick} />
    </View>
  );
};

export default Progress;
