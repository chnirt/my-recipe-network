"use client";

import ButtonLoading from "@/components/ButtonLoading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
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
          {greeting}{", "}
          <Typography variant={"p"} className="font-bold">
            {user.firstName} {user.lastName}
          </Typography>
        </Typography>
      </div>
      <div>
        <Typography variant={"h4"}>{t("bartenderBaristaRecipe")}</Typography>
      </div>

      {inviteLinksByUserId.map((link) => (
        <Card key={link.id}>
          <CardHeader className="flex flex-row">
            <div className="flex w-full flex-1 gap-2">
              <div className="flex-col justify-center">
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
              <div className="flex flex-col justify-center overflow-hidden">
                <CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {link.creatorDetails?.firstName}{" "}
                  {link.creatorDetails?.lastName}
                </CardTitle>
                <CardDescription className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {link.creatorDetails?.email}
                </CardDescription>
              </div>

              <div className="ml-auto">
                <ButtonLoading
                  icon={<Album className="size-4" />}
                  onClick={() => goToRecipe(link.recipeId)}
                >
                  {t("view")}
                </ButtonLoading>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
