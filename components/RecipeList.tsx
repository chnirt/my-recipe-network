import React, { useEffect } from "react";
import useRecipeStore from "@/stores/recipeStore";
import RecipeItem from "./RecipeItem";

export default function RecipeList() {
  const {
    searchedRecipes,
    loading,
    error,
    fetchRecipesWithIngredients,
    removeRecipe,
  } = useRecipeStore();

  useEffect(() => {
    fetchRecipesWithIngredients();
  }, [fetchRecipesWithIngredients]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col gap-4">
      {searchedRecipes.map((recipe, index) => (
        <div key={index}>
          <RecipeItem {...{ recipe, remove: removeRecipe }} />
        </div>
      ))}
    </div>
  );
}
