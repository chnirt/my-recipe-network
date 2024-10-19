"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useInviteLinkStore from "@/stores/inviteLinkStore";
import { useAuth } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const { isLoaded, userId } = useAuth();
  const { inviteLinksByUserId, fetchInviteLinksByUserId, loading, error } =
    useInviteLinkStore();
  const router = useRouter();

  useEffect(() => {
    // Fetch invite links when the component mounts
    if (userId) {
      fetchInviteLinksByUserId(userId);
    }
  }, [fetchInviteLinksByUserId, userId]);
  // const t = useTranslations("HomePage");

  function goToRecipe(recipeId: string) {
    router.push(`/${recipeId}/recipe`);
  }

  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col gap-4 px-4 pb-8 pt-4">
      {inviteLinksByUserId.map((link) => (
        <Card key={link.id} className="w-full">
          <div className="flex items-start gap-4 p-4">
            <div className="flex items-center justify-center">
              <Avatar className="h-16 w-16">
                <AvatarImage src={link.createdBy} alt={link.createdBy} />
                <AvatarFallback>
                  {String(link.createdBy).charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex-1">
                <Label className="font-semibold">{link.createdBy}</Label>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    {/* {post.user.bio} */}
                  </Label>
                </div>
                <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                  {/* <Label>{post.user.recipeCount} công thức</Label>
                  <span>•</span>
                  <Label>{post.user.expertise}</Label> */}
                </div>
              </div>
              <div className="flex-1">
                <Label className="mb-2 font-medium">Công thức mới nhất:</Label>
                {/* <Label className="font-semibold">{post.recipe.title}</Label> */}
                <Label className="line-clamp-2 text-sm text-muted-foreground">
                  {/* {post.recipe.description} */}
                </Label>
              </div>
            </div>
          </div>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => goToRecipe(link.recipeId)}
            >
              <CheckIcon /> View
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
