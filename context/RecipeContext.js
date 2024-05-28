import { createContext } from "react";

const RecipeContext = createContext({
  selectedRecipe: null,
  setSelectedRecipe: () => {},
});

export default RecipeContext;
