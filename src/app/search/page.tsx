
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { allContent } from "@/lib/data";
import { ContentCard } from "@/components/content-card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('q')?.trim() || "");
  const [searchInputValue, setSearchInputValue] = useState(query);

  const searchResults = query
    ? allContent.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.genre.some((g) => g.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchInputValue.trim();
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  useEffect(() => {
    const newQuery = searchParams.get('q')?.trim() || "";
    if (newQuery !== query) {
      setQuery(newQuery);
      setSearchInputValue(newQuery);
    }
  }, [searchParams, query]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto max-w-screen-2xl px-2 sm:px-4 pt-8 flex-1">
        
        <section className="w-full py-6 md:py-8">
            <div className="container mx-auto max-w-4xl px-2 sm:px-4">
            <form onSubmit={handleSearchSubmit} className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search movies, anime..."
                className="w-full rounded-full bg-muted h-14 pl-12 pr-32 text-base shadow-inner focus:bg-background"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                autoFocus
                />
                <Button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full h-10 px-6">
                    Search
                </Button>
            </form>
            </div>
        </section>

        {query ? (
          <>
            <h1 className="text-3xl font-headline font-bold mb-8 text-foreground">
              Results for: <span className="text-primary">"{query}"</span>
            </h1>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {searchResults.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No results found for "{query}".
                </p>
                <p className="text-muted-foreground text-sm">
                  Try searching for something else.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Please enter a search term to begin.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
