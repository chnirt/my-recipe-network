import React, { useEffect } from "react";
import useRecipeStore from "@/stores/recipeStore";
import RecipeItem from "./RecipeItem";
import { Skeleton } from "./ui/skeleton";

export default function RecipeList({
  id,
  isOwner,
}: {
  id: string;
  isOwner: boolean;
}) {
  const {
    searchedRecipes,
    loading,
    error,
    fetchRecipesWithIngredients,
    removeRecipe,
  } = useRecipeStore();

  useEffect(() => {
    fetchRecipesWithIngredients(id);
  }, [fetchRecipesWithIngredients, id]);

  if (loading)
    return (
      <div className="flex flex-col gap-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={["recipe", "item", i].join("-")}
              className="h-56 w-full"
            />
          ))}
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col gap-4">
      {searchedRecipes.map((recipe, index) => (
        <div key={index}>
          <RecipeItem {...{ recipe, remove: removeRecipe, isOwner }} />
        </div>
      ))}
    </div>
  );
}
