import { useContext, useState, useEffect } from "react";
import {
  UserContext,
  getCurrentUser,
  getDocument,
  config,
  transferUserDataToDailyEntries,
  listDocuments,
} from "../lib/appwrite";
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
import { LineChart } from "react-native-gifted-charts";
import icons from "../constants/icons";

const BodyMeasurements = ({ onClose }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({ streak: 0 });
  const [documents, setDocuments] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const [proteinData, setProteinData] = useState([]); // New state for protein data

  const prepareData = (attribute) => {
    return documents.map((doc) => {
      let value = 0;

      if (doc[attribute]) {
        value = doc[attribute];
      } else if (doc["weight"]) {
        value = doc["weight"];
        console.log(`Using weight for missing ${attribute}:`, value);
      } else {
        console.log(`Document with 0 or missing ${attribute}:`, doc);
      }

      console.log(`${attribute} value: ${value}`);

      return {
        value: isNaN(value) ? 0 : value,
      };
    });
  };
  const [currentData, setCurrentData] = useState([]);

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
            const data = documents.map((doc) => ({ weight: doc.weight }));
            setDocuments(data);

            // Calculate BMI using the latest weight and user's height
            const latestWeight = documents[documents.length - 1].weight;
            const heightInMeters = userData.height / 100; // Convert height to meters
            const bmi = latestWeight / (heightInMeters * heightInMeters);

            console.log(`BMI: ${bmi}`); // Log the calculated BMI

            setUserData((prevState) => ({
              ...prevState,
              weight: documents[0].weight,
              data,
              bmi, // Store the calculated BMI in the state
            }));

            setMaxValue(bmi); // Set the maxValue to the latest BMI
          }
        })
        .catch((err) => console.error(err));
    }
  }, [currentUser, userData.height]);

  useEffect(() => {
    // Update currentData and proteinData after documents and userData are updated
    setCurrentData(prepareData("weight"));
    setProteinData(prepareData("protein")); // Prepare protein data
  }, [documents, userData]);

  useEffect(() => {
    if (currentUser && currentUser.$id) {
      getDocument(config.databaseId, config.userCollectionId, currentUser.$id)
        .then((userDocument) => {
          if (userDocument) {
            setUserData((prevState) => ({
              ...prevState,
              goalweight: userDocument.goalweight,
              height: userDocument.height, // Store the user's height in the state
            }));
          }
        })
        .catch((err) => console.error(err));
    }
  }, [currentUser]);

  return (
    <View className="flex-1 bg-white justify-start items-center">
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
        <Text className="text-2xl font-jbold text-secondary mt-5">Protein</Text>
        <View className="w-full pt-2 ml-[-10px] mt-4">
          <LineChart
            areaChart
            thickness={6}
            isAnimated
            color="#191919"
            animationDuration={800}
            data={proteinData}
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
  );
};

export default BodyMeasurements;
