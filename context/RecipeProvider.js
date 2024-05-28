import React, { useState } from "react";
import RecipeContext from "../context/RecipeContext";

const RecipeProvider = ({ children }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <RecipeContext.Provider value={{ selectedRecipe, setSelectedRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeProvider;
