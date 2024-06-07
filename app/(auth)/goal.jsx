import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Redirect, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import UserContext from "../../context/UserContext"; // replace with the actual path to UserContext

const Goal = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleGoalSelect = (goal) => {
    setUserInfo({
      ...userInfo,
      goal: goal,
    });
    navigation.navigate("current-weight", { goal: goal });
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
                    i === 0
                      ? "bg-secondary"
                      : "bg-primary border-2 border-secondary"
                  }`}
                />
              ))}
            </View>
          </View>
          <View className="my-10">
            <View className="flex-row items-center flex-wrap justify-center">
              <Text className="text-2xl font-jbold">
                What goal do you have in
              </Text>
              <View className="flex-row items-center">
                <Text className="text-2xl font-jbold">mind?</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image source={icons.info} className="w-5 h-5 ml-1 mb-2" />
                </TouchableOpacity>
              </View>
            </View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View className="flex-1 items-center justify-start">
                <View
                  className="m-4 p-4 bg-primary border-b-2 border-secondary flex-col justify-between"
                  style={{ height: "30%", width: "100%" }}
                >
                  <Text className="font-jbold text-center">
                    To provide you with the most accurate calculations and
                    recommendations, we need to know your goal. Whether you're
                    looking to lose weight, gain muscle, maintain your current
                    weight, or simply improve your overall health, your goal
                    will guide our calculations. Please share your goal so we
                    can tailor our services to your needs.
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    className="mt-4 p-3 bg-secondary font-jbold self-center"
                    style={{ width: "40%" }}
                  >
                    <Text className="text-white text-center">Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
          <CustomButton
            title="Gain weight"
            handlePress={() => handleGoalSelect("gain_weight")}
            containerStyles="mt-10"
          />
          <CustomButton
            title="Lose weight"
            handlePress={() => handleGoalSelect("lose_weight")}
            containerStyles="mt-10"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Goal;
