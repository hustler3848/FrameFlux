"use client";

import { useState, useEffect, useMemo } from "react";
import { allContent } from "@/lib/data";
import type { Content } from "@/types";
import { Header } from "@/components/header";
import { ContentCard } from "@/components/content-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Film, Tv } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ContentSection = ({
  title,
  items,
  isLoading,
}: {
  title: string;
  items: Content[];
  isLoading: boolean;
}) => (
  <section className="mb-12">
    <h2 className="text-3xl font-headline font-bold mb-8 text-foreground">
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        : items.map((item) => (
            <ContentCard key={`${title}-${item.id}`} content={item} />
          ))}
    </div>
  </section>
);

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

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setContent(allContent);
      setIsLoading(false);
    }, 1000);
  }, []);

  const genresWithCount = useMemo(() => {
    if (!content.length) return [];
    const counts: Record<string, number> = {};
    content.forEach((item) => {
      item.genre.forEach((g) => {
        counts[g] = (counts[g] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [content]);

  const years = useMemo(() => {
    if (!content.length) return [];
    return ["all", ...[...new Set(content.map((item) => item.year.toString()))].sort(
      (a, b) => Number(b) - Number(a)
    )];
  }, [content]);

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

  const isFiltering = useMemo(
    () =>
      searchQuery !== "" ||
      filters.type !== "all" ||
      filters.genre !== "all" ||
      filters.year !== "all",
    [searchQuery, filters]
  );
  
  const latestContent = useMemo(() => [...content].sort((a,b) => b.year - a.year).slice(0, 8), [content]);
  const popularContent = useMemo(() => [...content].sort((a,b) => b.rating - a.rating).slice(0, 8), [content]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="container mx-auto max-w-screen-2xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
          
          <main className="lg:col-span-3">
            {isFiltering ? (
              <section>
                <h2 className="text-3xl font-headline font-bold mb-8 text-foreground">
                  Results
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {isLoading
                    ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                    : filteredContent.map((item) => <ContentCard key={item.id} content={item} />)}
                </div>
                {!isLoading && filteredContent.length === 0 && (
                    <div className="col-span-full text-center py-16">
                        <p className="text-muted-foreground text-lg">No results found. Try adjusting your search or filters.</p>
                    </div>
                )}
              </section>
            ) : (
              <>
                <ContentSection title="Latest Releases" items={latestContent} isLoading={isLoading}/>
                <ContentSection title="Most Popular" items={popularContent} isLoading={isLoading}/>
              </>
            )}
          </main>

          <aside className="lg:col-span-1 mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-lg font-headline font-semibold mb-4 text-foreground">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                 <h3 className="text-lg font-headline font-semibold mb-4 text-foreground">Type</h3>
                 <div className="flex flex-col space-y-2">
                    <Button variant={filters.type === 'all' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => handleFilterChange('type', 'all')}>All Types</Button>
                    <Button variant={filters.type === 'movie' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => handleFilterChange('type', 'movie')}><Film className="mr-2 h-4 w-4"/>Movies</Button>
                    <Button variant={filters.type === 'anime' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => handleFilterChange('type', 'anime')}><Tv className="mr-2 h-4 w-4"/>Anime</Button>
                 </div>
              </div>
              
              <div>
                <h3 className="text-lg font-headline font-semibold mb-4 text-foreground">Year</h3>
                <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                        <SelectItem key={year} value={year}>{year === 'all' ? 'All Years' : year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-lg font-headline font-semibold mb-4 text-foreground">Genres</h3>
                <div className="flex flex-col items-start space-y-2">
                  <Button variant={filters.genre === 'all' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => handleFilterChange('genre', 'all')}>All Genres</Button>
                  {genresWithCount.map(({name, count}) => (
                      <Button key={name} variant={filters.genre === name ? 'secondary' : 'ghost'} className="w-full justify-between" onClick={() => handleFilterChange('genre', name)}>
                        <span>{name}</span>
                        <Badge variant="outline">{count}</Badge>
                      </Button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <footer className="py-6 bg-secondary/50 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FrameFlux. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
