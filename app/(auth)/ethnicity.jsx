import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import icons from "../../constants/icons";
import UserContext from "../../context/UserContext";

const Ethnicity = () => {
  const [currentPage, setCurrentPage] = useState(8); // Assuming this is the second page
  const navigation = useNavigation();
  const route = useRoute();
  const [userInfo, setUserInfo] = useContext(UserContext);
  const [selectedEthnicity, setSelectedEthnicity] = useState("");

  useEffect(() => {
    console.log(route.params.goal);
    console.log(route.params.weight);
    console.log(route.params.unit);
    console.log(route.params.goalweight);
    console.log(route.params.goalweightUnit);
    console.log(route.params.gender);
    console.log(route.params.dateOfBirth);
    console.log(route.params.height);
    console.log(route.params.heightUnit);
  }, []);

  const navigateToNextPage = () => {
    const updatedUserInfo = {
      ...userInfo,
      ethnicity: selectedEthnicity,
    };
    setUserInfo(updatedUserInfo);
    if (selectedEthnicity) {
      navigation.navigate("sign-up", updatedUserInfo);
    } else {
      alert("Please select your ethnicity");
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex-col items-center min-h-[85vh] px-4 my-6">
          <View className="w-full flex-row items-center justify-start">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="self-start"
            >
              <Image
                source={icons.leftArrow}
                style={{ tintColor: "#191919" }}
              />
            </TouchableOpacity>
            <View className="flex-1 flex-row justify-center">
              {[...Array(8)].map((_, i) => (
                <View
                  key={i}
                  className={`h-3 w-7 m-1 ${
                    i < currentPage
                      ? "bg-secondary"
                      : "bg-primary border-2 border-secondary"
                  }`}
                />
              ))}
            </View>
          </View>
          <Text className="text-2xl font-jbold my-10 text-center">
            Select the ethnicity from the list that most closely resembles you
          </Text>
          <View className="flex-1 justify-center w-full px-10">
            <View className="flex-row border border-secondary mb-5 py-4">
              <Picker
                selectedValue={selectedEthnicity}
                onValueChange={(itemValue) => setSelectedEthnicity(itemValue)}
                style={{ flex: 1, height: 0, textAlign: "left" }}
                itemStyle={{ textAlign: "left" }}
              >
                <Picker.Item label="Select ethnicity" value="" />
                <Picker.Item
                  label="European: Germanic (German, Swedish, Dutch, etc.)"
                  value="european_germanic"
                />
                <Picker.Item
                  label="European: Romance (Italian, Spanish, French, etc.)"
                  value="european_romance"
                />
                <Picker.Item
                  label="European: Slavic (Russian, Polish, Ukrainian, etc.)"
                  value="european_slavic"
                />
                <Picker.Item
                  label="Asian: Han Chinese"
                  value="asian_han_chinese"
                />
                <Picker.Item
                  label="Asian: Indian (Hindi, Bengali, Tamil, etc.)"
                  value="asian_indian"
                />
                <Picker.Item
                  label="Asian: Southeast Asian (Thai, Vietnamese, Filipino, etc.)"
                  value="asian_southeast_asian"
                />
                <Picker.Item
                  label="African: North African (Arab-Berber, Egyptian, Sudanese, etc.)"
                  value="african_north_african"
                />
                <Picker.Item
                  label="African: Central African (Bantu, Nilotic, etc.)"
                  value="african_central_african"
                />
              </Picker>
            </View>
            <CustomButton title="Next" handlePress={navigateToNextPage} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Ethnicity;
