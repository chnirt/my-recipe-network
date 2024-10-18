"use client";

import React from "react";
import RecipeForm from "@/components/RecipeForm";

export default function Page({ params }: { params: { recipeId: string } }) {
  return (
    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 px-4 pb-8 pt-4">
      <RecipeForm {...{ id: params.recipeId }} />
    </div>
  );
}
