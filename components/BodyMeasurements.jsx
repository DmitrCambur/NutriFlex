import { useState, useEffect } from "react";
import {
  getCurrentUser,
  getDocument,
  config,
  listDocuments,
} from "../lib/appwrite";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import icons from "../constants/icons";

const BodyMeasurements = ({ onClose }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({ streak: 0 });
  const [documents, setDocuments] = useState([]);
  const [currentData, setCurrentData] = useState([]);

  const prepareData = (documents) => {
    return documents.map((doc) => {
      const heightInMeters = userData.height / 100; // Convert height to meters
      const bmi = doc.weight / (heightInMeters * heightInMeters);
      return {
        value: isNaN(bmi) ? 0 : bmi,
      };
    });
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
      listDocuments(
        config.databaseId,
        config.dailyEntriesCollectionId,
        currentUser.$id
      )
        .then((documents) => {
          if (documents.length > 0) {
            documents.sort((a, b) => new Date(a.date) - new Date(b.date));
            setDocuments(documents);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.$id) {
      getDocument(config.databaseId, config.userCollectionId, currentUser.$id)
        .then((userDocument) => {
          if (userDocument) {
            setUserData((prevState) => ({
              ...prevState,
              height: userDocument.height,
            }));
          }
        })
        .catch((err) => console.error(err));
    }
  }, [currentUser]);

  useEffect(() => {
    setCurrentData(prepareData(documents));
  }, [documents, userData]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="flex-1 bg-primary justify-start items-center">
          <View className="flex-row items-center justify-center p-5 bg-secondary">
            <TouchableOpacity onPress={onClose}>
              <Image
                source={icons.leftArrow}
                className="w-8 h-6"
                tintColor="white"
              />
            </TouchableOpacity>
            <View className="flex-1 items-center">
              <Text className="text-3xl font-jbold ml-2 text-primary">
                Body Measurements
              </Text>
            </View>
          </View>
          <View className="w-full p-5">
            <Text className="text-2xl font-jbold text-secondary mt-5">BMI</Text>
            <View className="w-full pt-2 ml-[-10px] mt-4">
              <LineChart
                areaChart
                thickness={6}
                isAnimated
                color="#191919"
                animationDuration={800}
                data={currentData}
                startFillColor="#191919"
                startOpacity={0.8}
                noOfSections={7}
                endFillColor="#FFFFFF"
                spacing={33}
                initialSpacing={1}
                endOpacity={0.3}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BodyMeasurements;
