"use client";

import { useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import React from "react";

export default function Page() {
  const { isLoaded, userId, sessionId } = useAuth();
  const t = useTranslations("HomePage");

  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <div>
      Hello, {userId} your current active session is {sessionId}
      <h1>{t("title")}</h1>
    </div>
  );
}
