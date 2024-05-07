import React, { useState } from "react";
import UserContext from "../context/UserContext";

const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    goal: "",
    currentWeight: 0,
    height: 0,
    gender: "",
    ethnicity: "",
    dateOfBirth: "",
    weightGoal: 0,
    allergies: [],
    dailyCalories: 0,
    dailyProtein: 0,
    dailyCarbs: 0,
    dailyFat: 0,
    dailyWater: 0,
    waist: 0,
    chest: 0,
    bicep: 0,
    meals: [],
    unit: "",
  });

  return (
    <UserContext.Provider value={[userInfo, setUserInfo]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
