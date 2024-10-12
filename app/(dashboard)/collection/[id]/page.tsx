"use client";

import RecipeList from "@/components/RecipeList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recipes } from "@/data/recipes";
import { PlusCircle, Share } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const [copySuccess, setCopySuccess] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Collection");

  const copyToClipboard = async (): Promise<void> => {
    try {
      const fullUrl: string = `${window.location.origin}${pathname}${
        searchParams ? `?${searchParams}` : ""
      }`;

      await navigator.clipboard.writeText(fullUrl);

      setCopySuccess("Copied!");
    } catch (error: unknown) {
      console.log(error);
      setCopySuccess("Failed to copy!");
    }
  };

  function share() {
    console.log("🚀 ~ share ~ share:");
    copyToClipboard();
  }

  function add() {
    console.log("🚀 ~ add ~ add:");
    router.push("/collection/add");
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="w-full">
          <Input
            placeholder={t("filterRecipes")}
            // value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            // onChange={(event) =>
            //   table.getColumn("email")?.setFilterValue(event.target.value)
            // }
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
