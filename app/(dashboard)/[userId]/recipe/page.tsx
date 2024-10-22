"use client";

import RecipeList from "@/components/RecipeList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRecipeStore from "@/stores/recipeStore";
import { useAuth } from "@clerk/nextjs";
import { debounce } from "lodash";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

export default function Page({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const t = useTranslations("Collection");
  const { userId } = useAuth();
  const [searchName, setSearchName] = useState("");
  const { searchRecipes } = useRecipeStore();

  const isOwner = useMemo(() => userId === params.userId, [userId, params]);

  useEffect(() => {
    // Create a debounced version of the fetchRecipes function
    const debouncedFetchRecipes = debounce(async (name: string) => {
      searchRecipes(name);
    }, 300); // Adjust the debounce delay as needed (300ms is common)

    // Call the debounced function when the searchName changes
    debouncedFetchRecipes(searchName);

    // Cleanup function to cancel the debounce on unmount
    return () => {
      debouncedFetchRecipes.cancel();
    };
  }, [, searchRecipes, searchName]); // Add fetchRecipes to dependencies

  function add() {
    router.push(`/${userId}/recipe/add`);
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-[53px] z-10 flex items-center gap-4 border-border/40 bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full">
          <Input
            placeholder={t("filterRecipes")}
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
          />
        </div>
        {isOwner ? (
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-7 gap-1" onClick={add}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {t("add")}
              </span>
            </Button>
          </div>
        ) : null}
      </div>

      <div className="px-4 pb-8">
        <RecipeList {...{ id: params.userId, isOwner }} />
      </div>
    </div>
  );
}
