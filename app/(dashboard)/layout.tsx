"use client";

import { SignedIn, useAuth, UserButton } from "@clerk/nextjs";
import React, { useCallback, useEffect } from "react";
import { GlassWater, Settings2, Triangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { useTranslations } from "next-intl";

function Navbar() {
  const t = useTranslations("Navbar");
  const router = useRouter();
  const { userId } = useAuth();
  const pathname = usePathname();

  useEffect(() => {}, []);

  const goToHome = useCallback(() => router.push("/"), [router]);

  const goToMyRecipe = useCallback(
    () => router.push(`/${userId}/recipe/`),
    [router, userId],
  );

  const goToSettings = useCallback(() => router.push("/settings"), [router]);

  return (
    <aside className="inset-y fixed left-0 z-30 flex h-full flex-col border-r">
      <div className="border-b p-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Home"
          onClick={goToHome}
        >
          <Triangle className="size-5 fill-foreground" />
        </Button>
      </div>
      <nav className="grid gap-1 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-lg",
                pathname.includes("/recipe") && "bg-muted",
              )}
              aria-label="Models"
              onClick={goToMyRecipe}
            >
              <GlassWater className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            {t("myRecipe")}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-lg",
                pathname.includes("/settings") && "bg-muted",
              )}
              aria-label="Settings"
              onClick={goToSettings}
            >
              <Settings2 className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            {t("settings")}
          </TooltipContent>
        </Tooltip>
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
        <LocaleSwitcher />
        <div className="flex items-center justify-center">
          <SignedIn>
            {/* Mount the UserButton component */}
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </aside>
  );
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid h-screen w-full pl-[57px]">
      <Navbar />
      <div className="flex flex-col">
        <header className="sticky top-0 z-20 flex h-[53px] items-center gap-1 border-b bg-background px-4">
          {/* <h1 className="text-xl font-semibold">Recipe Network</h1> */}
        </header>

        <main className="grid flex-1 items-start">{children}</main>
      </div>
    </div>
  );
}
