import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-4 px-4 pb-8 pt-4">
      <Skeleton className="h-7 w-60" />
      <Skeleton className="h-7 w-full sm:w-96" />

      {Array(3)
        .fill(null)
        .map((_, i) => (
          <Skeleton
            key={["inviteLinksByUserId", i].join("-")}
            className="h-20 w-full"
          />
        ))}
    </div>
  );
}
