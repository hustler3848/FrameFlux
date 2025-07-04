import { HomePageClient } from '@/components/home-page-client';
import { Suspense } from 'react';
import { SkeletonCard } from '@/components/skeleton-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Footer } from '@/components/footer';

function HomePageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-transparent bg-background">
        <div className="container mx-auto flex max-w-screen-2xl items-center gap-4 px-4 h-16">
          <div className="flex items-center gap-4 md:gap-6">
            <Skeleton className="h-6 w-32" />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-md md:hidden" />
          </div>
        </div>
      </header>

      <Skeleton className="w-full h-[50vh] md:h-[85vh] mb-8" />
      
      <section className="w-full py-6 md:py-8 bg-background border-b border-border">
        <div className="container mx-auto max-w-screen-2xl px-2 sm:px-4">
          <Skeleton className="h-14 w-full rounded-full" />
        </div>
      </section>

      <div className="container mx-auto max-w-screen-2xl px-2 sm:px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
          <main className="lg:col-span-3">
            <div className="mb-12">
              <Skeleton className="h-8 w-48 mb-8" />
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </div>
            <div>
              <Skeleton className="h-8 w-48 mb-8" />
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </div>
          </main>
          <aside className="lg:col-span-1 mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-8">
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/4 mb-4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/4 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/4 mb-4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams?: { type?: string; genre?: string };
}) {
  // Wrap the client component in Suspense to allow streaming
  // and prevent build errors related to `useSearchParams`.
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageClient typeFromUrl={searchParams?.type} genreFromUrl={searchParams?.genre} />
    </Suspense>
  );
}
