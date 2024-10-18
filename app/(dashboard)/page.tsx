"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  // CardContent, CardHeader
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// import { useAuth } from "@clerk/nextjs";
// import { BellIcon } from "lucide-react";
// import { useTranslations } from "next-intl";
import React from "react";

const posts = [
  {
    id: 1,
    user: {
      name: "Alice Nguyen",
      avatar: "/placeholder.svg?height=50&width=50",
      bio: "Đam mê ẩm thực Việt Nam",
      recipeCount: 45,
      expertise: "Món ăn truyền thống",
    },
    recipe: {
      title: "Phở Gà Truyền Thống",
      description:
        "Công thức nấu phở gà ngon đúng vị Hà Nội, nước dùng trong và ngọt tự nhiên.",
      image: "/placeholder.svg?height=200&width=300",
    },
  },
  {
    id: 2,
    user: {
      name: "Bob Tran",
      avatar: "/placeholder.svg?height=50&width=50",
      bio: "Yêu thích fusion cuisine",
      recipeCount: 32,
      expertise: "Món ăn fusion",
    },
    recipe: {
      title: "Bánh Mì Thịt Nướng Fusion",
      description:
        "Bánh mì kết hợp giữa hương vị truyền thống và hiện đại, với thịt nướng kiểu Hàn Quốc.",
      image: "/placeholder.svg?height=200&width=300",
    },
  },
];

export default function Page() {
  // const { isLoaded, userId, sessionId } = useAuth();
  // const t = useTranslations("HomePage");

  // // In case the user signs out while on the page.
  // if (!isLoaded || !userId) {
  //   return null;
  // }

  // return (
  //   <div>
  //     Hello, {userId} your current active session is {sessionId}
  //     <h1>{t("title")}</h1>
  //   </div>
  // );

  return (
    <div className="flex flex-col gap-4 px-4 pb-8 pt-4">
      {posts.map((post) => (
        <Card key={post.id} className="w-full">
          <div className="flex items-start gap-4 p-4">
            <div className="flex items-center justify-center">
              <Avatar className="h-16 w-16">
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex-1">
                <Label className="font-semibold">{post.user.name}</Label>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    {post.user.bio}
                  </Label>
                </div>
                <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                  <Label>{post.user.recipeCount} công thức</Label>
                  <span>•</span>
                  <Label>{post.user.expertise}</Label>
                </div>
              </div>
              <div className="flex-1">
                <Label className="mb-2 font-medium">Công thức mới nhất:</Label>
                <Label className="font-semibold">{post.recipe.title}</Label>
                <Label className="line-clamp-2 text-sm text-muted-foreground">
                  {post.recipe.description}
                </Label>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
