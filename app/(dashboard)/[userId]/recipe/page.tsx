"use client";

import RecipeList from "@/components/RecipeList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRecipeStore from "@/stores/recipeStore";
import { useAuth } from "@clerk/nextjs";
import { debounce } from "lodash";
import { PlusCircle, Share } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Collection");
  const { userId } = useAuth();
  const [searchName, setSearchName] = useState("");
  const { fetchRecipes } = useRecipeStore();

  useEffect(() => {
    // Create a debounced version of the fetchRecipes function
    const debouncedFetchRecipes = debounce(async (name: string) => {
      if (name) {
        await fetchRecipes(name); // Call fetch with search name
      } else {
        await fetchRecipes(); // Call fetch to get all recipes
      }
    }, 300); // Adjust the debounce delay as needed (300ms is common)

    // Call the debounced function when the searchName changes
    debouncedFetchRecipes(searchName);

    // Cleanup function to cancel the debounce on unmount
    return () => {
      debouncedFetchRecipes.cancel();
    };
  }, [fetchRecipes, searchName]); // Add fetchRecipes to dependencies

  const copyToClipboard = async (): Promise<void> => {
    try {
      const fullUrl: string = `${window.location.origin}${pathname}${
        searchParams ? `?${searchParams}` : ""
      }`;

      await navigator.clipboard.writeText(fullUrl);
      // setCopySuccess("Copied!");
    } catch (error: unknown) {
      console.log(error);
      // setCopySuccess("Failed to copy!");
    }
  };

  function share() {
    copyToClipboard();
  }

  function add() {
    router.push(`/${userId}/recipe/add`);
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="sticky top-16 z-10 flex items-center gap-4">
        <div className="w-full">
          <Input
            placeholder={t("filterRecipes")}
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1"
            onClick={share}
          >
            <Share className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {t("share")}
            </span>
          </Button>
          <Button size="sm" className="h-7 gap-1" onClick={add}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {t("add")}
            </span>
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <RecipeList />
      </div>
    </div>
  );
}
