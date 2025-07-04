import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-auto w-full aspect-[2/3] rounded-2xl" />
      <Skeleton className="h-5 w-4/5 rounded-md" />
      <Skeleton className="h-4 w-1/4 rounded-md" />
    </div>
  );
}
