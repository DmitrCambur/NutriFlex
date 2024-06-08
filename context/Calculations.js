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
    ethnicity,
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

  // Calculate Basal Metabolic Rate (BMR) with ethnicity adjustments
  switch (ethnicity) {
    case "Germanic":
    case "Romance":
    case "Slavic":
      if (gender === "male") {
        bmr = 88.362 + 13.397 * weight + 4.799 * heightInMeters - 5.677 * age;
      } else {
        bmr = 447.593 + 9.247 * weight + 3.098 * heightInMeters - 4.33 * age;
      }
      break;
    case "Han Chinese":
    case "Indian":
    case "Southeast Asian":
      if (gender === "male") {
        bmr =
          88.362 +
          13.397 * weight +
          4.799 * heightInMeters -
          5.677 * age * 0.95;
      } else {
        bmr =
          447.593 + 9.247 * weight + 3.098 * heightInMeters - 4.33 * age * 0.95;
      }
      break;
    case "North African":
    case "Central African":
      if (gender === "male") {
        bmr =
          88.362 +
          13.397 * weight +
          4.799 * heightInMeters -
          5.677 * age * 1.05;
      } else {
        bmr =
          447.593 + 9.247 * weight + 3.098 * heightInMeters - 4.33 * age * 1.05;
      }
      break;
    default:
      if (gender === "male") {
        bmr = 88.362 + 13.397 * weight + 4.799 * heightInMeters - 5.677 * age;
      } else {
        bmr = 447.593 + 9.247 * weight + 3.098 * heightInMeters - 4.33 * age;
      }
  }

  let dailyCalorieRequirement = Math.round(bmr * 1.2);
  const weightDifference = goalweight - weight;

  if (ethnicity === "european_germanic") {
    dailyCalorieRequirement = gender === "male" ? 2500 : 2000;
  } else if (ethnicity === "european_romance") {
    dailyCalorieRequirement = gender === "male" ? 2350 : 1850; // Reduced by 150 calories
  } else if (ethnicity === "european_slavic") {
    dailyCalorieRequirement = gender === "male" ? 2550 : 2050; // Increased by 50 calories
  } else if (ethnicity === "asian_han_chinese") {
    dailyCalorieRequirement = gender === "male" ? 1900 : 1600; // Specific values for Asian Han Chinese
  } else if (ethnicity === "asian_indian") {
    dailyCalorieRequirement = gender === "male" ? 2000 : 1500; // Specific values for Asian Indian
  } else if (ethnicity === "asian_southeast_asian") {
    dailyCalorieRequirement = gender === "male" ? 1950 : 1450; // Specific values for Asian Southeast Asian
  } else if (ethnicity === "african_central_african") {
    dailyCalorieRequirement = gender === "male" ? 2250 : 1700; // Specific values for African Central African
  } else if (ethnicity === "african_north_african") {
    dailyCalorieRequirement = gender === "male" ? 2200 : 1750; // Specific values for African North African
  }

  if (goal === "lose_weight") {
    dailyCalorieRequirement -= weightDifference * 20; // Subtract 20 calories for each kg of weight difference
  } else if (goal === "gain_weight") {
    dailyCalorieRequirement += weightDifference * 20; // Add 20 calories for each kg of weight difference
  }

  // Calculate macronutrients
  const protein = Math.round(weight * 2.2); // 2.2g of protein per kg of body weight
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

  // Format the goal date
  const goalDateFormatted = `${goalDate.getFullYear()}-${String(
    goalDate.getMonth() + 1
  ).padStart(2, "0")}-${String(goalDate.getDate()).padStart(2, "0")}`;

  // Return calculated values
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
