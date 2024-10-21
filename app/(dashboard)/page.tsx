"use client";

import ButtonLoading from "@/components/ButtonLoading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import useInviteLinkStore from "@/stores/inviteLinkStore";
import useUserStore from "@/stores/userStore";
import { useAuth, useUser } from "@clerk/nextjs";
import { Album } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Loading from "./loading";
import { useGreeting } from "@/hooks/useGreeting";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const { user } = useUser();
  const { inviteLinksByUserId, fetchInviteLinksByUserId, loading, error } =
    useInviteLinkStore();
  const router = useRouter();
  const { saveUserData } = useUserStore();
  const t = useTranslations("HomePage");
  const greeting = useGreeting();

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

  if (!user || loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col gap-4 px-4 pb-8 pt-4">
      <div>
        <Typography variant={"p"}>
          {greeting}
          {", "}
          <Typography variant={"p"} className="font-bold">
            {user.firstName} {user.lastName}
          </Typography>
        </Typography>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("recipeTitle")}</CardTitle>
          <CardDescription>{t("recipeDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2"></div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <h4 className="text-sm font-medium">{t("theStoryTellers")}</h4>
            <div className="flex flex-col gap-6">
              {inviteLinksByUserId.length > 0 ? (
                inviteLinksByUserId.map((inviteLink, iui) => (
                  <div
                    key={["invited", "user", iui].join("-")}
                    className="flex w-full items-center justify-between space-x-4"
                  >
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <Avatar>
                        <AvatarImage src={inviteLink.creatorDetails?.avatar} />
                        <AvatarFallback>
                          {String(inviteLink.creatorDetails?.firstName)
                            .toUpperCase()
                            .charAt(0)}
                          {String(inviteLink.creatorDetails?.lastName)
                            .toUpperCase()
                            .charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium leading-none">
                          {inviteLink.creatorDetails?.firstName}{" "}
                          {inviteLink.creatorDetails?.lastName}
                        </p>
                        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
                          {inviteLink.creatorDetails?.email}
                        </p>
                      </div>
                    </div>
                    <ButtonLoading
                      icon={<Album className="size-4" />}
                      onClick={() => goToRecipe(inviteLink.recipeId)}
                    >
                      {t("view")}
                    </ButtonLoading>
                  </div>
                ))
              ) : (
                <p>{t("noInvitedUsersFound")}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
