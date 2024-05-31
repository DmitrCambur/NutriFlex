import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Button,
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
import { BarChart } from "react-native-gifted-charts";
import LottieView from "lottie-react-native";
import animations from "../../constants/animations";
import images from "../../constants/images";

const Progress = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({ streak: 0 });
  const [loading, setLoading] = useState(true);

  const data = [
    {
      name: "Weight",
      value: userData.weight,
    },
    {
      name: "Goal Weight",
      value: userData.goalweight,
    },
  ];
  const dummyData = [
    {
      value: 75,
      label: "Current Weight",
      color: "skyblue",
    },
    {
      value: 60,
      label: "Goal Weight",
      color: "green",
    },
  ];

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

        // Set streak and longeststreak to the state
        setUserData((prevState) => ({
          ...prevState,
          streak: user.streak,
          longeststreak: user.longeststreak,
        }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.$id) {
      // Fetch all documents where the user field is equal to currentUser.$id
      listDocuments(
        config.databaseId,
        config.dailyEntriesCollectionId,
        currentUser.$id
      )
        .then((documents) => {
          if (documents.length > 0) {
            console.log(`Fetched ${documents.length} documents`);
            // Log the weight and date of each document
            documents.forEach((doc) => {
              console.log(
                `Document ID: ${doc.$id}, Date: ${doc.date}, Weight: ${doc.weight}`
              );
            });
          } else {
            console.log("No documents found for user", currentUser.$id);
          }
        })
        .catch((err) => console.error(err));

      // Assume you have a documentId to fetch
      const documentId = "66589d79001e34abf62a";
      getDocument(
        config.databaseId,
        config.dailyEntriesCollectionId,
        documentId
      )
        .then((document) => {
          if (document) {
            console.log(`Document Weight:`, document.weight);
            // Set userData to the fetched document
            setUserData(document);
          } else {
            console.log("No document found with id", documentId);
          }
          setLoading(false);
        })
        .catch((err) => console.error(err));
    }
  }, [currentUser]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex-col items-center justify-start min-h-[85vh] px-8">
          <Image
            source={images.logo}
            className="w-[200px] h-[200px]"
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
            <Text className="text-lg font-jbold mt-4">WEIGHT GOAL</Text>
            <View className="border-2 border-secondary p-3 mt-2 flex-col justify-between items-center">
              <View className="w-full">
                <BarChart
                  data={dummyData.map((item) => ({ value: item.value }))}
                />
              </View>
              <View className="w-full mt-2">
                {/* Add content for the second view section here */}
              </View>
              <Button
                title="Transfer Data"
                onPress={handleTransferButtonClick}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Progress;
