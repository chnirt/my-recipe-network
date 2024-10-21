"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useInviteLinkStore from "@/stores/inviteLinkStore";
import { useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useState } from "react";
import Loading from "./loading";

export default function Page() {
  const {
    inviteLink,
    loading,
    error,
    fetchInviteLink,
    revokeAccess,
    restoreAccess,
    addInviteLink,
  } = useInviteLinkStore();
  const { userId } = useAuth();
  const [inviteLinkText, setInviteLinkText] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const t = useTranslations("LinkPage");

  const createInviteLink = useCallback(async () => {
    const recipeId = userId;
    if (recipeId) {
      const result = await addInviteLink(recipeId);
      const inviteLinkId = result;
      const generatedInviteLink: string = `${window.location.origin}/accept-invite/${inviteLinkId}`;
      if (result) {
        setInviteLinkText(generatedInviteLink);
        if (inviteLinkId) {
          fetchInviteLink(inviteLinkId);
        }
      }
    }
  }, [addInviteLink, fetchInviteLink, userId]);

  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true); // Set flag to true on success
    } catch (error: unknown) {
      console.log(error);
      setCopySuccess(false); // Set flag to false on failure
    }
  }, []);

  useEffect(() => {
    createInviteLink();
  }, [createInviteLink]);

  const handleRevokeAccess = useCallback(
    async (inviteLinkId: string, userId: string) => {
      await revokeAccess(inviteLinkId, userId);
    },
    [revokeAccess],
  );

  const handleRestoreAccess = useCallback(
    async (inviteLinkId: string, userId: string) => {
      await restoreAccess(inviteLinkId, userId);
    },
    [restoreAccess],
  );

  const handlePermissionChange = useCallback(
    async (newPermission: string, inviteLinkId: string, userId: string) => {
      switch (newPermission) {
        case "revoke": {
          handleRevokeAccess(inviteLinkId, userId);
          break;
        }
        case "restore": {
          handleRestoreAccess(inviteLinkId, userId);
          break;
        }
        default:
          break;
      }
    },
    [handleRestoreAccess, handleRevokeAccess],
  );

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="gap-4 px-4 pb-8 pt-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("linkTitle")}</CardTitle>
          <CardDescription>{t("linkDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input value={inviteLinkText} readOnly />
            <Button
              variant="secondary"
              className="shrink-0"
              onClick={() => copyToClipboard(inviteLinkText)}
            >
              {t(copySuccess ? "copied" : "copyLink")}
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <h4 className="text-sm font-medium">{t("peopleWithAccess")}</h4>
            <div className="flex flex-col gap-6">
              {inviteLink?.invitedUsers &&
              inviteLink.invitedUsers.length > 0 ? (
                inviteLink.invitedUsers.map((invitedUser, iui) => (
                  <div
                    key={["invited", "user", iui].join("-")}
                    className="flex w-full items-center justify-between space-x-4"
                  >
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <Avatar>
                        <AvatarImage src={invitedUser.inviterDetails?.avatar} />
                        <AvatarFallback>
                          {String(invitedUser.inviterDetails?.firstName)
                            .toUpperCase()
                            .charAt(0)}
                          {String(invitedUser.inviterDetails?.lastName)
                            .toUpperCase()
                            .charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium leading-none">
                          {invitedUser.inviterDetails?.firstName}{" "}
                          {invitedUser.inviterDetails?.lastName}
                        </p>
                        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
                          {invitedUser.inviterDetails?.email}
                        </p>
                      </div>
                    </div>
                    <Select
                      defaultValue={
                        invitedUser.accessRevoked ? "revoke" : "restore"
                      }
                      onValueChange={(value) =>
                        handlePermissionChange(
                          value,
                          inviteLink.id,
                          invitedUser.userId,
                        )
                      }
                    >
                      <SelectTrigger className="ml-auto w-28 sm:w-48">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revoke">
                          {t("removeDirectAccess")}
                        </SelectItem>
                        <SelectItem value="restore">{t("canView")}</SelectItem>
                      </SelectContent>
                    </Select>
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
