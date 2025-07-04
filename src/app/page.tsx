"use client";

import { useState, useEffect, useMemo } from "react";
import { allContent } from "@/lib/data";
import type { Content } from "@/types";
import { Header } from "@/components/header";
import { ContentCard } from "@/components/content-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    type: string;
    genre: string;
    year: string;
  }>({
    type: "all",
    genre: "all",
    year: "all",
  });
  const [genres, setGenres] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setContent(allContent);
      
      const allGenres = [...new Set(allContent.flatMap((item) => item.genre))];
      const allYears = [...new Set(allContent.map((item) => item.year.toString()))].sort((a,b) => Number(b) - Number(a));
      
      setGenres(["all", ...allGenres]);
      setYears(["all", ...allYears]);
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      const searchMatch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const typeMatch =
        filters.type === "all" || item.type.toLowerCase() === filters.type;
      const genreMatch =
        filters.genre === "all" || item.genre.includes(filters.genre);
      const yearMatch =
        filters.year === "all" || item.year.toString() === filters.year;

      return searchMatch && typeMatch && genreMatch && yearMatch;
    });
  }, [content, searchQuery, filters]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        handleFilterChange={handleFilterChange}
        genres={genres}
        years={years}
      />
      <main className="flex-1">
        <section className="relative py-20 md:py-32 bg-background">
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[10px_10px] [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-slate-400/[0.05] dark:bg-[10px_10px] dark:[mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
          <div className="container mx-auto px-4 text-center relative">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground">
              Discover Your Next Favorite Binge
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Explore a world of trending movies and anime. Your next adventure is just a click away.
            </p>
            <div className="mt-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                Explore Collection
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-headline font-bold mb-8 text-foreground">
              Trending Now
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                : filteredContent.map((item) => (
                    <ContentCard key={item.id} content={item} />
                  ))}
            </div>
            {!isLoading && filteredContent.length === 0 && (
                <div className="col-span-full text-center py-16">
                    <p className="text-muted-foreground text-lg">No results found. Try adjusting your filters.</p>
                </div>
            )}
          </div>
        </section>
      </main>
      <footer className="py-6 bg-secondary/50">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} FrameFlux. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
}
