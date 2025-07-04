'use client';

import * as React from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchContent } from '@/lib/data';
import type { Content } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import Link from 'next/link';
import Image from 'next/image';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Content[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    const search = async () => {
        if (debouncedQuery.length > 2) {
            setIsLoading(true);
            const searchResults = await searchContent(debouncedQuery);
            setResults(searchResults);
            setIsLoading(false);
        } else {
            setResults([]);
        }
    }
    search();
  }, [debouncedQuery]);
  
  React.useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <SearchIcon className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] p-0 gap-0">
        <div className="p-6 pb-4 border-b">
          <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search movies, anime, genres..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
              {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
          </div>
        </div>
        
        <ScrollArea className="h-[400px]">
          <div className="p-6 pt-2">
            {results.length > 0 ? (
              <div className="grid gap-4">
                <p className="text-sm text-muted-foreground">{results.length} results found</p>
                {results.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${item.type.toLowerCase()}/${item.slug}`}
                    className="group flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <div className="relative w-16 h-24 rounded-md overflow-hidden flex-shrink-0 shadow-md">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" data-ai-hint={`${item.type.toLowerCase()} genre`} sizes="64px" />
                    </div>
                    <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.year} &middot; {item.type}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
                debouncedQuery.length > 2 && !isLoading && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No results found for "{debouncedQuery}".</p>
                    </div>
                )
            )}
             {debouncedQuery.length <= 2 && !isLoading && (
                <div className="text-center py-10 text-muted-foreground">
                    <p>Start typing to search for content.</p>
                </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
