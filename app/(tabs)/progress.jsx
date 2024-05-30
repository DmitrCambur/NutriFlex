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
} from "../../lib/appwrite";
import LottieView from "lottie-react-native";
import animations from "../../constants/animations";
import images from "../../constants/images";

const Progress = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({ streak: 0 });
  const [loading, setLoading] = useState(true);

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
      getDocument(config.databaseId, currentUser.$collectionId, currentUser.$id)
        .then((document) => {
          setUserData(document);
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Progress;
