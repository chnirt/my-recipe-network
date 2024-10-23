import React, { useEffect } from "react";
import useRecipeStore from "@/stores/recipeStore";
import RecipeItem from "./RecipeItem";
import { Skeleton } from "./ui/skeleton";
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
  const router = useRouter();
  const t = useTranslations("RecipeList");

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
  if (error)
    return (
      <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
        <div className="mb-4 flex items-center justify-center text-red-500">
          <AlertTriangle className="h-8 w-8" />
          <span className="ml-2 text-lg font-semibold">{t("title")}</span>
        </div>
        <p className="mb-6 text-sm text-gray-600">{t("description")}</p>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push("/")} // Update the route if necessary
            className="flex items-center"
          >
            <Home className="mr-2 h-4 w-4" />
            {t("goToDashboard")}
          </Button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {searchedRecipes.map((recipe, index) => (
        <div key={index}>
          <RecipeItem
            {...{
              recipe,
              remove: removeRecipe,
              isOwner,
              number: index + 1,
            }}
          />
        </div>
      ))}
    </div>
  );
}
