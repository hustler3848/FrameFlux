
import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/skeleton-card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-7xl px-2 sm:px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
          </div>

          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-12 w-3/4" />
            
            <div className="flex flex-wrap items-center gap-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            <div className="space-y-2 pt-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
                <Skeleton className="h-12 w-40 rounded-lg" />
                <Skeleton className="h-12 w-40 rounded-lg" />
            </div>

            <Skeleton className="my-8 h-40 md:h-60 w-full rounded-lg" />
          </div>
        </div>
      </main>

      <section className="py-12 border-t border-border bg-secondary/20">
        <div className="container mx-auto max-w-7xl px-2 sm:px-4">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
            </div>
        </div>
      </section>
    </div>
  );
}
