import { APP_ID, APP_KEY } from "@env";

export async function fetchRecipes(query, mealType, calories, dietLabels) {
  try {
    let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&mealType=${mealType.join(
      ","
    )}&calories=${calories}&app_id=${APP_ID}&app_key=${APP_KEY}`;
    dietLabels.forEach((label) => {
      url += `&diet=${label}`;
    });
    const response = await fetch(url);
    const data = await response.json();
    // Calculate calories per serving for each recipe
    if (data.hits) {
      data.hits = data.hits.map((hit) => ({
        ...hit,
        recipe: {
          ...hit.recipe,
          calories: hit.recipe.calories / hit.recipe.yield,
        },
      }));
    }
    return data;
  } catch (error) {
    return { error };
  }
}
