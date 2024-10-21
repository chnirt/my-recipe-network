import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="px-4 pb-8 pt-4">
      <Skeleton className="h-80 w-full" />
    </div>
  );
}
