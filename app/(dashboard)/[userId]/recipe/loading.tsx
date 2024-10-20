import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div>
      <div className="p-4">
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="px-4 pb-8">
        <div className="flex flex-col gap-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton
                key={["recipe", "item", i].join("-")}
                className="h-56 w-full"
              />
            ))}
        </div>
      </div>
    </div>
  );
}
