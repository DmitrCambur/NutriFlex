import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import {
  UserContext,
  getCurrentUser,
  getDocument,
  config,
  transferUserDataToDailyEntries,
  listDocuments,
} from "../../lib/appwrite";
import BodyMeasurements from "../../components/BodyMeasurements";
import { LineChart } from "react-native-gifted-charts";
import LottieView from "lottie-react-native";
import animations from "../../constants/animations";
import images from "../../constants/images";
import icons from "../../constants/icons";
import bganimation from "../../assets/animations/nutriflexgiff.gif";

const Progress = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({ streak: 0 });
  const [loading, setLoading] = useState(true);
  const [yAxisStart, setYAxisStart] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [yAxisEnd, setYAxisEnd] = useState(null);
  const rate = 2;

  const [documents, setDocuments] = useState([]);

  const data = documents.map((doc) => ({ weight: doc.weight }));

  const handleTransferButtonClick = async () => {
    try {
      // Call the transferUserDataToDailyEntries function
      await transferUserDataToDailyEntries();
      console.log("Data transfer completed successfully.");
    } catch (error) {
      console.error("Error during data transfer:", error);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        console.log(`User $createdAt: ${user.$createdAt}`); // Log the $createdAt attribute of the user

        // Set streak, longeststreak, and goalweight to the state
        setUserData((prevState) => ({
          ...prevState,
          streak: user.streak || 0, // Use 0 as default value if streak is not present
          longeststreak: user.longeststreak || 0, // Use 0 as default value if longeststreak is not present
          goalweight: user.goalweight, // Fetch goalweight from Users collection
        }));

        setLoading(false); // Set loading to false after fetching the data
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.$id) {
      listDocuments(
        config.databaseId,
        config.dailyEntriesCollectionId,
        currentUser.$id
      )
        .then((documents) => {
          if (documents.length > 0) {
            console.log(`Fetched ${documents.length} documents`);

            documents.sort((a, b) => new Date(a.date) - new Date(b.date));

            documents.forEach((doc) => {
              console.log(
                `Document ID: ${doc.$id}, Date: ${doc.date}, Weight: ${doc.weight}`
              );
            });

            setYAxisStart(documents[0].weight);
            setYAxisEnd(documents[documents.length - 1].weight);

            const data = documents.map((doc) => ({ weight: doc.weight }));
            console.log("Data:", data);

            setDocuments(data); // Update the documents state with the new data array

            setUserData((prevState) => ({
              ...prevState,
              weight: documents[0].weight,
              date: documents[0].date,
              data,
            }));
          } else {
            console.log("No documents found for user", currentUser.$id);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.$id) {
      // Fetch the user document
      getDocument(config.databaseId, config.userCollectionId, currentUser.$id)
        .then((userDocument) => {
          if (userDocument) {
            console.log(`Fetched user document: ${userDocument.$id}`);

            // Set goalweight to the state
            setUserData((prevState) => ({
              ...prevState,
              goalweight: userDocument.goalweight, // Fetch goalweight from Users collection
            }));
          } else {
            console.log("No user document found for user", currentUser.$id);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [currentUser]);

  const prepareData = () => {
    const preparedData = documents.map((doc) => {
      return {
        date: doc.date, // Add the date value
        weight: doc.weight,
        value: doc.weight, // Return the actual weight as the value
      };
    });

    console.log(preparedData); // Log the prepared data
    return preparedData;
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex-col items-center justify-start min-h-[85vh] px-8">
          <Image
            source={bganimation}
            className="w-[240px] h-[200px]"
            resizeMode="contain"
          />
          <View className="w-full mt-[-40px]">
            <Text className="text-lg font-jbold">STREAKS</Text>
            <View className="border-2 border-secondary p-3 mt-2 flex-row justify-between items-center">
              {!loading && (
                <View className="flex-col items-center">
                  <View className="flex-row items-center">
                    <Text className="text-3xl font-jbold p-2">
                      {userData.streak}
                    </Text>
                    <Text className="text-3xl ml-1 font-jbold">Days</Text>
                  </View>
                  <Text className="text-sm mt-1 pl-2 font-jlight">
                    Current Streak
                  </Text>
                </View>
              )}
              <View className="border-l border-secondary h-full mx-2"></View>
              {!loading && (
                <View className="flex-col items-center">
                  <View className="flex-row items-center mr-4">
                    <Text className="text-3xl font-jbold p-2">
                      {userData.longeststreak}
                    </Text>
                    <Text className="text-3xl ml-1 font-jbold">Days</Text>
                  </View>
                  <Text className="text-sm mt-1 pr-2 font-jlight">
                    Longest Streak
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-lg font-jbold mt-10">WEIGHT GOAL</Text>
            <View className="mt-2 flex-col justify-between items-center">
              <View className="w-full pt-2 ml-[-10px]">
                <LineChart
                  areaChart
                  thickness={6}
                  isAnimated
                  color="#191919"
                  animationDuration={800}
                  data={prepareData()}
                  startFillColor="#191919"
                  startOpacity={0.8}
                  noOfSections={6}
                  endFillColor="#FFFFFF"
                  spacing={33}
                  initialSpacing={1}
                  endOpacity={0.3}
                  maxValue={userData.goalweight}
                />
              </View>
            </View>
          </View>
          <View className="w-full mt-6">
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true); // Show modal when button is clicked
              }}
            >
              <View className="border-2 border-secondary p-5 flex-row items-center">
                <Image
                  source={icons.profile}
                  className="w-[30px] h-[30px]"
                  tintColor={"#191919"}
                  resizeMode="contain"
                />
                <Text className="text-2xl font-jbold ml-4">
                  Body Measurements
                </Text>
              </View>
            </TouchableOpacity>

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible); // Hide modal when it's requested to close
              }}
            >
              <BodyMeasurements onClose={() => setModalVisible(false)} />
            </Modal>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Progress;
