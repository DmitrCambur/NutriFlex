import { updateUser } from "../lib/appwrite";

// Function to calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  const diff = Date.now() - new Date(dateOfBirth).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Function to calculate daily caloric intake
export const calculateDailyIntake = (userInfo) => {
  let {
    goal,
    weight,
    goalweight,
    gender,
    dateOfBirth,
    height,
    unit,
    goalweightUnit,
    heightUnit,
  } = userInfo;

  // Convert weight, goal weight, and height to metric units if necessary
  if (unit === "lb") {
    weight = weight * 0.453592; // Convert pounds to kilograms
  } else if (unit === "st") {
    weight = weight * 6.35029; // Convert stones to kilograms
  }
  if (goalweightUnit === "lb") {
    goalweight = goalweight * 0.453592; // Convert pounds to kilograms
  } else if (goalweightUnit === "st") {
    goalweight = goalweight * 6.35029; // Convert stones to kilograms
  }
  if (heightUnit === "in") {
    height = height * 2.54; // Convert inches to centimeters
  }
  const weightDifferenceInKg = Math.abs(goalweight - weight);
  const weeksToGoal = weightDifferenceInKg / 0.5; // 0.5kg per week
  const goalDate = new Date();
  const daysToGoal = Math.round(weeksToGoal * 7); // Round to the nearest whole number
  goalDate.setDate(goalDate.getDate() + daysToGoal); // Add the number of days to the current date

  const heightInMeters = height / 100;
  const age = calculateAge(dateOfBirth);
  let bmr;

  if (gender === "male") {
    bmr = 88.362 + 13.397 * weight + 4.799 * heightInMeters - 5.677 * age;
  } else {
    bmr = 447.593 + 9.247 * weight + 3.098 * heightInMeters - 4.33 * age;
  }

  let dailyCalorieRequirement = Math.round(bmr * 1.2); // Assuming a sedentary lifestyle

  const weightDifference = goalweight - weight;

  if (goal === "lose_weight") {
    dailyCalorieRequirement -= 500 + weightDifference * 10; // Subtract additional calories based on weight difference
  } else if (goal === "gain_weight") {
    dailyCalorieRequirement += 500 + weightDifference * 10; // Add additional calories based on weight difference
  }

  // Calculate macronutrients
  const protein = Math.round(weight * 2.2); // 2.2g of protein per kg of bodyweight
  const fat = Math.round((dailyCalorieRequirement * 0.25) / 9); // 25% of daily calories from fat, 1g fat = 9 calories
  const carbs = Math.round(
    (dailyCalorieRequirement - (protein * 4 + fat * 9)) / 4
  ); // Remaining calories from carbs, 1g protein/carbs = 4 calories

  // Convert daily caloric intake and macronutrients back to original units if necessary
  if (unit === "lb") {
    weight = weight / 0.453592; // Convert kilograms back to pounds
    protein = protein / 0.453592; // Convert grams to pounds
  }
  if (heightUnit === "in") {
    height = height / 2.54; // Convert centimeters back to inches
  }
  const goalDateFormatted = `${goalDate.getFullYear()}-${String(
    goalDate.getMonth() + 1
  ).padStart(2, "0")}-${String(goalDate.getDate()).padStart(2, "0")}`;
  return {
    daily_calories: dailyCalorieRequirement,
    daily_protein: protein,
    daily_fat: fat,
    daily_carbs: carbs,
    goaldate: goalDateFormatted,
  };
};

// Function to save the calculated data to Appwrite database
export const saveToDatabase = async (userId, data) => {
  try {
    await updateUser(userId, data);
  } catch (error) {
    console.error(error);
  }
};
