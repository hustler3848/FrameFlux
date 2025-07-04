import { Suspense } from 'react';
import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import { HomePageClient } from '@/components/home-page-client';
import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonCard } from '@/components/skeleton-card';
import { Footer } from '@/components/footer';


// Since the page that uses useSearchParams is now dynamic, we need a static shell.
// This is the new page.tsx, a Server Component.
export default function Home() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageClient />
    </Suspense>
  );
}

// A skeleton component to show while the client component is loading.
// This avoids layout shifts and provides a better user experience.
function HomePageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Skeleton for Header */}
       <header className="sticky top-0 z-50 w-full border-b border-transparent bg-background">
         <div className="container mx-auto flex max-w-screen-2xl items-center gap-4 px-4 h-16">
            <div className="flex items-center gap-4 md:gap-6">
              <Link href="/" className="flex items-center gap-2">
                <Clapperboard className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline text-xl hidden sm:inline-block">FrameFlux</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </nav>
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
         </div>
       </header>

      {/* Skeleton for Hero Section */}
      <Skeleton className="w-full h-[50vh] md:h-[85vh] mb-8" />
      
      {/* Skeleton for Search Bar */}
      <section className="w-full py-6 md:py-8 bg-background border-b border-border">
        <div className="container mx-auto max-w-screen-2xl px-2 sm:px-4">
          <Skeleton className="w-full rounded-full h-14" />
        </div>
      </section>

      <div className="container mx-auto max-w-screen-2xl px-2 sm:px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
          
          {/* Skeleton for Main Content */}
          <main className="lg:col-span-3">
            <section className="mb-12">
              <Skeleton className="h-8 w-48 mb-8" />
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </section>
            <section className="mb-12">
               <Skeleton className="h-8 w-48 mb-8" />
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </section>
          </main>

          {/* Skeleton for Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <Skeleton className="h-6 w-16 mb-4" />
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div>
                <Skeleton className="h-6 w-12 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                 <Skeleton className="h-6 w-20 mb-4" />
                 <div className="flex flex-col items-start space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                 </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}