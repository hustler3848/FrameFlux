
"use client";

import * as React from "react";
import Link from "next/link";
import { Clapperboard, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: {
    type: string;
    genre: string;
    year: string;
  };
  handleFilterChange: (filterType: string, value: string) => void;
  genres: string[];
  years: string[];
}

export function Header({
  searchQuery,
  setSearchQuery,
  filters,
  handleFilterChange,
  genres,
  years,
}: HeaderProps) {
  const [typeOpen, setTypeOpen] = React.useState(false);
  const [genreOpen, setGenreOpen] = React.useState(false);
  const [yearOpen, setYearOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const getFilterTypeLabel = (value: string) => {
    switch (value) {
      case 'all':
        return 'All Types';
      case 'movie':
        return 'Movies';
      case 'anime':
        return 'Anime';
      default:
        return value;
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-300 ease-in-out",
      isScrolled 
        ? "border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg"
        : "border-transparent"
    )}>
      <div className={cn(
        "container mx-auto flex max-w-7xl items-center gap-4 px-4 transition-all duration-300 ease-in-out",
        isScrolled ? "h-20" : "h-16"
      )}>
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Clapperboard className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-xl">FrameFlux</span>
        </Link>

        <div className="flex-1 items-center gap-4 hidden md:flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search movies & anime..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <nav className="flex items-center gap-1">
            <DropdownMenu open={typeOpen} onOpenChange={setTypeOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" onMouseEnter={() => setTypeOpen(true)} className="px-3">
                  {getFilterTypeLabel(filters.type)}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 shrink-0 transition-transform duration-200 ${
                      typeOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={-1}
                onMouseLeave={() => setTypeOpen(false)}
                className="w-40"
              >
                <DropdownMenuRadioGroup
                  value={filters.type}
                  onValueChange={(value) => {
                    handleFilterChange("type", value);
                    setTypeOpen(false);
                  }}
                >
                  <DropdownMenuRadioItem value="all">All Types</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="movie">Movies</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="anime">Anime</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu open={genreOpen} onOpenChange={setGenreOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" onMouseEnter={() => setGenreOpen(true)} className="px-3">
                  {filters.genre === "all" ? "All Genres" : filters.genre}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 shrink-0 transition-transform duration-200 ${
                      genreOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={-1}
                onMouseLeave={() => setGenreOpen(false)}
                className="w-48 max-h-80 overflow-y-auto custom-scrollbar"
              >
                <DropdownMenuRadioGroup
                  value={filters.genre}
                  onValueChange={(value) => {
                    handleFilterChange("genre", value);
                    setGenreOpen(false);
                  }}
                >
                  {genres.map((genre) => (
                    <DropdownMenuRadioItem key={genre} value={genre}>
                      {genre === "all" ? "All Genres" : genre}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu open={yearOpen} onOpenChange={setYearOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" onMouseEnter={() => setYearOpen(true)} className="px-3">
                  {filters.year === "all" ? "All Years" : filters.year}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 shrink-0 transition-transform duration-200 ${
                      yearOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={-1}
                onMouseLeave={() => setYearOpen(false)}
                className="w-40 max-h-80 overflow-y-auto custom-scrollbar"
              >
                <DropdownMenuRadioGroup
                  value={filters.year}
                  onValueChange={(value) => {
                    handleFilterChange("year", value);
                    setYearOpen(false);
                  }}
                >
                  {years.map((year) => (
                    <DropdownMenuRadioItem key={year} value={year}>
                      {year === "all" ? "All Years" : year}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
