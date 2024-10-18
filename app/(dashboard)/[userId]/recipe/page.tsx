"use client";

import RecipeList from "@/components/RecipeList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useInvitationStore from "@/stores/invitationStore";
import useRecipeStore from "@/stores/recipeStore";
import { useAuth } from "@clerk/nextjs";
import { debounce } from "lodash";
import { Clipboard, ClipboardCheck, PlusCircle, Share } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const t = useTranslations("Collection");
  const { userId } = useAuth();
  const [searchName, setSearchName] = useState("");
  const { fetchRecipes } = useRecipeStore();
  const [open, setOpen] = useState(false);
  const { addInvitation } = useInvitationStore();
  const [invitationLink, setInvitationLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

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

  async function createInvitationLink() {
    const recipeId = userId;
    if (recipeId) {
      const invitation = await addInvitation({ recipeId });
      const invitationId = invitation.id;
      const fullUrl: string = `${window.location.origin}/accept-invitation/${invitationId}`;
      setInvitationLink(fullUrl);
      setOpen(true);
    }
  }

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true); // Set flag to true on success
    } catch (error: unknown) {
      console.log(error);
      setCopySuccess(false); // Set flag to false on failure
    }
  };

  function add() {
    router.push(`/${userId}/recipe/add`);
  }

  function handleOnOpenChange(openProp: boolean) {
    setOpen(openProp);

    // console.log("🚀 ~ handleOnOpenChange ~ open:", openProp);
    if (!openProp) {
      setCopySuccess(false);
      setInvitationLink("");
    }
  }

  return (
    <div className="relative flex min-h-full flex-col">
      <div className="sticky top-[53px] z-10 flex items-center gap-4 border-border/40 bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full">
          <Input
            placeholder={t("filterRecipes")}
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Dialog {...{ open, onOpenChange: handleOnOpenChange }}>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1"
              onClick={createInvitationLink}
            >
              <Share className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {t("share")}
              </span>
            </Button>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("shareTitle")}</DialogTitle>
                <DialogDescription>{t("shareDescription")}</DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    {invitationLink}
                  </Label>
                  <Input
                    id="link"
                    defaultValue={invitationLink} // Replace with your dynamic invitation link
                    readOnly
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="px-3"
                  onClick={() => copyToClipboard(invitationLink)} // Assuming share is a function that copies the link
                  disabled={copySuccess}
                >
                  <span className="sr-only">{t("copy")}</span>
                  {!copySuccess ? (
                    <Clipboard className="h-4 w-4" />
                  ) : (
                    <ClipboardCheck className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    {t("close")}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button size="sm" className="h-7 gap-1" onClick={add}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {t("add")}
            </span>
          </Button>
        </div>
      </div>

      <div className="flex-1 px-4 pb-8">
        <RecipeList />
      </div>
    </div>
  );
}
