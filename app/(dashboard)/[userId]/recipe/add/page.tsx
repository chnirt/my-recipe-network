"use client";

import React from "react";
import RecipeForm from "@/components/RecipeForm";

export default function Page() {
  return (
    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 pt-4 px-4 pb-8">
      <RecipeForm />
    </div>
  );
}
