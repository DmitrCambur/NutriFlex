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
  Modal,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  BackHandler,
  Animated,
} from "react-native";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import DropDownPicker from "react-native-dropdown-picker";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import icons from "../../constants/icons";
import UserContext from "../../context/UserContext";
import Dialog from "react-native-dialog";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import bganimation from "../../assets/animations/nutriflexgiff.gif";

const Profile = () => {
  const { userGlobal, setGlobalUser, setIsLogged, isLogged } =
    useGlobalContext();
  const [userInfo, setUserInfo] = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openView, setOpenView] = useState(null);
  const [playAnimation, setPlayAnimation] = useState(null);

  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeField, setActiveField] = useState("");
  const [ethnicityPickerVisible, setEthnicityPickerVisible] = useState(false);
  const [ethnicity, setEthnicity] = useState(
    userData ? userData.ethnicity : ""
  );

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

  const handleWeightClick = () => {
    setActiveField("weight");
    setDialogVisible(true);
  };

  const handleHeightClick = () => {
    setActiveField("height");
    setDialogVisible(true);
  };

  const handleWaistClick = () => {
    setActiveField("waist");
    setDialogVisible(true);
  };

  const handleChestClick = () => {
    setActiveField("chest");
    setDialogVisible(true);
  };

  const handleDateChange = (event, selectedDate) => {
    console.log("handleDateChange called"); // Log when the function is called

    if (event.type === "set") {
      // User pressed the "OK" button
      const currentDate = selectedDate || dateOfBirth;
      setDateOfBirth(currentDate);
      setActiveField("dateOfBirth");
      handleOk(); // Call the handleOk function
    }
    // Hide the date picker after 'OK' or 'Cancel' button is pressed
    setDatePickerVisible(false);
  };

  const handleEthnicityChange = (ethnicity) => {
    setEthnicity(ethnicity);
    const newUserData = { ...userData, ethnicity };
    setUserData(newUserData);
    setEthnicityPickerVisible(false);
    setActiveField("ethnicity");
    handleOk();
  };

  const handleGenderChange = () => {
    setUserData((prevState) => ({
      ...prevState,
      gender: prevState.gender === "Male" ? "Female" : "Male",
    }));
  };
  const handleOk = () => {
    let parsedInputValue;

    switch (activeField) {
      case "goalweight":
      case "height":
      case "weight":
      case "waist":
      case "chest":
        parsedInputValue = parseInt(inputValue, 10);
        break;
      case "dateOfBirth":
        const dateObject = new Date(dateOfBirth);
        parsedInputValue = dateObject.toISOString();
        console.log("Date of Birth:", parsedInputValue);
        break;
      case "ethnicity":
        parsedInputValue = ethnicity; // Use the ethnicity value
        break;
      case "gender":
        parsedInputValue = userData.gender; // Use the gender value
        break;
      default:
        parsedInputValue = inputValue;
    }

    const newUserData = { ...userData, [activeField]: parsedInputValue };
    setUserData(newUserData);
    setDialogVisible(false);

    if (!loading && newUserData && newUserData.$id) {
      updateUser(newUserData.$id, { [activeField]: parsedInputValue })
        .then((result) => {
          console.log("Update Result:", result);

          // Recalculate daily nutrient intake if weight, height, goal weight, date of birth, ethnicity, or gender was updated
          if (
            [
              "weight",
              "height",
              "goalweight",
              "dateOfBirth",
              "ethnicity",
              "gender",
            ].includes(activeField)
          ) {
            const dailyIntake = calculateDailyIntake(newUserData);
            saveToDatabase(newUserData.$id, dailyIntake)
              .then(() => console.log("Daily intake updated"))
              .catch((err) => console.error(err));
          }
        })
        .catch((err) => console.error(err));
    } else {
      console.error("User ID is undefined");
    }
  };
  const toastConfig = {
    customToast: ({ text1, text2 }) => (
      <View className="h-full w-full bg-secondary p-4">
        <Text className="text-white font-jbold">{text1}</Text>
        <Text className="text-white font-jlight">{text2}</Text>
      </View>
    ),
  };

  const allergyToHealthLabel = {
    Gluten: "gluten-free",
    Nuts: "peanut-free",
    Dairy: "dairy-free",
    Egg: "egg-free",
    Soy: "soy-free",
    Fish: "fish-free",
  };
  const handleAllergyChange = (allergy) => {
    const healthLabel = allergyToHealthLabel[allergy];
    const isAllergyAdded = !userData.allergies.includes(healthLabel);
    const newAllergies = isAllergyAdded
      ? [...userData.allergies, healthLabel]
      : userData.allergies.filter((a) => a !== healthLabel);

    const newUserData = { ...userData, allergies: newAllergies };
    setUserData(newUserData);

    if (!loading && newUserData && newUserData.$id) {
      updateUser(newUserData.$id, { allergies: newAllergies })
        .then((result) => {
          console.log("Update Result:", result);
        })
        .catch((err) => console.error(err));
    } else {
      console.error("User ID is undefined");
    }

    return isAllergyAdded;
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex-col items-center justify-start min-h-[85vh] px-8">
          <Image
            source={bganimation}
            className="w-[240px] h-[200px] mt-[-50px]"
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
                        onPress={handleWeightClick}
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
                        onPress={handleHeightClick}
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
                          setActiveField("goalweight");
                          setDialogVisible(true);
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
                          setActiveField("dateOfBirth");
                          setDatePickerVisible(true);
                        }}
                      >
                        <Text className="text-base font-jbold">
                          {calculateAge(userData.dateOfBirth)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {datePickerVisible && (
                    <DateTimePicker
                      value={dateOfBirth}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                  <View className="flex-row justify-between items-center my-2">
                    <View className="flex-1 flex-row justify-between items-center">
                      <Text className="font-jbold text-base">Waist</Text>
                      <TouchableOpacity
                        className="w-20 h-10 border-secondary border-2 justify-center items-center mr-4"
                        onPress={handleWaistClick}
                      >
                        <Text className="text-base font-jbold">
                          {userData.waist} {userData.heightUnit}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-1 flex-row justify-between items-center">
                      <Text className="font-jbold text-base">Chest</Text>
                      <TouchableOpacity
                        className="w-20 h-10 border-secondary border-2 justify-center items-center mr-4"
                        onPress={handleChestClick}
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
                        onPress={() => setEthnicityPickerVisible(true)}
                      >
                        <Text className="text-base font-jbold">
                          {userData ? userData.ethnicity : ""}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={ethnicityPickerVisible}
                      onRequestClose={() => setEthnicityPickerVisible(false)}
                    >
                      <TouchableWithoutFeedback
                        onPress={() => setEthnicityPickerVisible(false)}
                      >
                        <View className="flex-1 justify-center">
                          <View className="mx-9 p-5 bg-primary border-2 border-secondary">
                            <Picker
                              selectedValue={userData ? userData.ethnicity : ""}
                              onValueChange={handleEthnicityChange}
                              className="flex-1 h-0 text-left"
                              itemStyle={{
                                textAlign: "left",
                              }}
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
                        </View>
                      </TouchableWithoutFeedback>
                    </Modal>
                  </View>
                  <View className="flex-row justify-center items-center my-2">
                    <View className="flex-1 flex-row items-center">
                      <Text className="font-jbold text-base mr-2">Gender</Text>
                      <TouchableOpacity
                        className="w-20 h-10 border-secondary border-2 justify-center items-center mr-4"
                        onPress={handleGenderChange}
                      >
                        <Text className="text-base font-jbold">
                          {userData.gender}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Dialog.Container
                    contentStyle={{ borderWidth: 2, borderColor: "secondary" }}
                    visible={dialogVisible}
                  >
                    <Dialog.Title className=" font-jbold text-center mb-5">
                      Enter your new {activeField}
                    </Dialog.Title>
                    <Dialog.Input
                      className=" font-jlight text-base"
                      onChangeText={(value) => setInputValue(value)}
                    ></Dialog.Input>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Dialog.Button
                        label="Cancel"
                        onPress={() => setDialogVisible(false)}
                        className=" font-jbold text-base"
                        style={{
                          color: "black",
                        }}
                      />
                      <Dialog.Button
                        label="OK"
                        onPress={handleOk}
                        className="font-jbold text-base"
                        style={{
                          color: "black",
                        }}
                      />
                    </View>
                  </Dialog.Container>
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
                      className={`flex-1 h-10 justify-center items-center mr-2 ${
                        userData.allergies.includes("gluten-free")
                          ? "border-2 bg-secondary"
                          : "border-2 border-secondary bg-primary"
                      }`}
                      onPress={() => {
                        const isAllergyAdded = handleAllergyChange("Gluten");
                        Toast.hide();
                        if (isAllergyAdded) {
                          Toast.show({
                            text1: "Hello,",
                            text2:
                              "Your dietary preference 'Gluten', has been applied 👍",
                            type: "customToast",
                            position: "top",
                          });
                        } else {
                          Toast.show({
                            text1: "Hello,",
                            text2:
                              "Your dietary preference 'Gluten', has been removed 🙌",
                            type: "customToast",
                            position: "top",
                          });
                        }
                      }}
                    >
                      <Text
                        className={`font-jbold text-base ${
                          userData.allergies.includes("gluten-free")
                            ? "text-primary"
                            : "text-secondary"
                        }`}
                      >
                        Gluten
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`flex-1 h-10 justify-center items-center mr-2 ${
                        userData.allergies.includes("peanut-free")
                          ? "border-2 bg-secondary"
                          : "border-2 border-secondary bg-primary"
                      }`}
                      onPress={() => {
                        const isAllergyAdded = handleAllergyChange("Nuts");
                        Toast.hide();
                        if (isAllergyAdded) {
                          Toast.show({
                            text1: "Hello,",
                            text2:
                              "Your dietary preference 'Nuts', has been applied 👍",
                            type: "customToast",
                            position: "top",
                          });
                        } else {
                          Toast.show({
                            text1: "Hello,",
                            text2:
                              "Your dietary preference 'Nuts', has been removed 🙌",
                            type: "customToast",
                            position: "top",
                          });
                        }
                      }}
                    >
                      <Text
                        className={`font-jbold text-base ${
                          userData.allergies.includes("peanut-free")
                            ? "text-primary"
                            : "text-secondary"
                        }`}
                      >
                        Nuts
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className={`flex-1 h-10 justify-center items-center mr-2 ${
                        userData.allergies.includes("dairy-free")
                          ? "border-2 bg-secondary"
                          : "border-2 border-secondary bg-primary"
                      }`}
                      onPress={() => {
                        const isAllergyAdded = handleAllergyChange("Dairy");
                        Toast.hide();
                        if (isAllergyAdded) {
                          Toast.show({
                            text1: "Hello,",
                            text2:
                              "Your dietary preference 'Dairy', has been applied 👍",
                            type: "customToast",
                            position: "top",
                          });
                        } else {
                          Toast.show({
                            text1: "Hello,",
                            text2:
                              "Your dietary preference 'Dairy', has been removed 🙌",
                            type: "customToast",
                            position: "top",
                          });
                        }
                      }}
                    >
                      <Text
                        className={`font-jbold text-base ${
                          userData.allergies.includes("dairy-free")
                            ? "text-primary"
                            : "text-secondary"
                        }`}
                      >
                        Dairy
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row justify-start items-center my-2">
                    <TouchableOpacity
                      className={`flex-1 h-10 justify-center items-center mr-2 ${
                        userData.allergies.includes("egg-free")
                          ? "border-2 bg-secondary"
                          : "border-2 border-secondary bg-primary"
                      }`}
                      onPress={() => {
                        const isAllergyAdded = handleAllergyChange("Egg");
                        Toast.hide();
                        if (isAllergyAdded) {
                          Toast.show({
                            text1: "Hello,",
                            text2:
                              "Your dietary preference 'Egg', has been applied 👍",
                            type: "customToast",
                            position: "top",
                          });
                        } else {
                          Toast.show({
                            text1: "Hello,",
                            text2:
                              "Your dietary preference 'Egg', has been removed 🙌",
                            type: "customToast",
                            position: "top",
                          });
                        }
                      }}
                    >
                      <Text
                        className={`font-jbold text-base ${
                          userData.allergies.includes("egg-free")
                            ? "text-primary"
                            : "text-secondary"
                        }`}
                      >
                        Egg
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`flex-1 h-10 justify-center items-center mr-2 ${
                        userData.allergies.includes("soy-free")
                          ? "border-2 bg-secondary"
                          : "border-2 border-secondary bg-primary"
                      }`}
                      onPress={() => {
                        const isAllergyAdded = handleAllergyChange("Soy");
                        Toast.hide();
                        if (isAllergyAdded) {
                          Toast.show({
                            text1: "Hello,",
                            text2:
                              "Your dietary preference 'Soy', has been applied 👍",
                            type: "customToast",
                            position: "top",
                          });
                        } else {
                          Toast.show({
                            text1: "Hello,",
                            text2:
                              "Your dietary preference 'Soy', has been removed 🙌",
                            type: "customToast",
                            position: "top",
                          });
                        }
                      }}
                    >
                      <Text
                        className={`font-jbold text-base ${
                          userData.allergies.includes("soy-free")
                            ? "text-primary"
                            : "text-secondary"
                        }`}
                      >
                        Soy
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className={`flex-1 h-10 justify-center items-center mr-2 ${
                        userData.allergies.includes("fish-free")
                          ? "border-2 bg-secondary"
                          : "border-2 border-secondary bg-primary"
                      }`}
                      onPress={() => {
                        const isAllergyAdded = handleAllergyChange("Fish");
                        Toast.hide();
                        if (isAllergyAdded) {
                          Toast.show({
                            text1: "Hello,",
                            text2:
                              "Your dietary preference 'Fish', has been applied 👍",
                            type: "customToast",
                            position: "top",
                          });
                        } else {
                          Toast.show({
                            text1: "Hello,",
                            text2:
                              "Your dietary preference 'Fish', has been removed 🙌",
                            type: "customToast",
                            position: "top",
                          });
                        }
                      }}
                    >
                      <Text
                        className={`font-jbold text-base ${
                          userData.allergies.includes("fish-free")
                            ? "text-primary"
                            : "text-secondary"
                        }`}
                      >
                        Fish
                      </Text>
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
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

export default Profile;
