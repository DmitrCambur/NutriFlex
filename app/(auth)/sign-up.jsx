import { View, Text } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import UserContext from "../../context/UserContext";

const SignUp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userInfo, setUserInfo] = useContext(UserContext);
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
    console.log(route.params.ethnicity);
  }, []);
  return (
    <View>
      <Text>SignUp</Text>
    </View>
  );
};

export default SignUp;
