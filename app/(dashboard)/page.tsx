"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useInviteLinkStore from "@/stores/inviteLinkStore";
import useUserStore from "@/stores/userStore";
import { useAuth, useUser } from "@clerk/nextjs";
import { Album } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const { user } = useUser();
  const { inviteLinksByUserId, fetchInviteLinksByUserId, loading, error } =
    useInviteLinkStore();
  const router = useRouter();
  const { saveUserData } = useUserStore();
  const t = useTranslations("HomePage");

  useEffect(() => {
    // Save user data when the user is signed in
    if (isSignedIn && userId) {
      saveUserData(); // Call to save user data
      fetchInviteLinksByUserId(userId);
    }
  }, [isSignedIn, userId, saveUserData, fetchInviteLinksByUserId]); // Dependencies to trigger useEffect

  function goToRecipe(recipeId: string) {
    router.push(`/${recipeId}/recipe`);
  }

  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    return null;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col gap-4 px-4 pb-8 pt-4">
      <Label className="text-base">
        {t("welcome")},{" "}
        <strong className="font-bold">
          {user.firstName} {user.lastName}!
        </strong>
      </Label>
      {inviteLinksByUserId.map((link) => (
        <Card key={link.id} className="w-full">
          <CardHeader className="flex flex-row items-center gap-2">
            <div className="flex space-x-2">
              <div className="flex flex-col justify-center">
                <Avatar>
                  <AvatarImage src={link.creatorDetails?.avatar} />
                  <AvatarFallback>
                    {String(link.creatorDetails?.firstName)
                      .toUpperCase()
                      .charAt(0)}
                    {String(link.creatorDetails?.lastName)
                      .toUpperCase()
                      .charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col justify-center">
                <CardTitle>
                  {link.creatorDetails?.firstName}{" "}
                  {link.creatorDetails?.lastName}
                </CardTitle>
                <CardDescription>{link.creatorDetails?.email}</CardDescription>
              </div>
            </div>
            <div className="ml-auto">
              <Button
                size="icon"
                className="gap-1"
                onClick={() => goToRecipe(link.recipeId)}
              >
                <Album className="size-4" />
                <span className="sr-only">Pen</span>
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
