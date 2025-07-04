import { HomePageClient } from '@/components/home-page-client';

// This page becomes a Dynamic Server Component by accessing searchParams.
// This allows us to avoid using the useSearchParams hook on the client
// and solve potential build errors.
export default function Home({
  searchParams,
}: {
  searchParams?: { type?: string; genre?: string };
}) {
  return <HomePageClient typeFromUrl={searchParams?.type} genreFromUrl={searchParams?.genre} />;
}
