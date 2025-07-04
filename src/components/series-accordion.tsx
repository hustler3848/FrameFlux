
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { Content } from "@/types";
import { Clock, Download, Play } from "lucide-react";
import Link from "next/link";

interface SeriesAccordionProps {
  item: Content;
}

export function SeriesAccordion({ item }: SeriesAccordionProps) {
  if (!item.seasons || item.seasons.length === 0) {
    return null;
  }

  return (
    <Accordion type="single" collapsible className="w-full rounded-lg overflow-hidden border">
      <AccordionItem value="seasons" className="border-b-0">
        <AccordionTrigger className="text-xl font-headline font-bold hover:no-underline px-6 py-4 bg-secondary/50">
          <div className="flex items-baseline gap-3">
            <span>Seasons & Episodes</span>
            <span className="text-base font-normal text-muted-foreground">({item.totalSeasons} Season{item.totalSeasons && item.totalSeasons > 1 ? 's' : ''})</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            {item.seasons.map((season) => (
              <AccordionItem key={season.season_number} value={`season-${season.season_number}`} className="border-t last:border-b-0 border-border">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline px-6 py-4">
                  <div className="flex items-baseline gap-3">
                    <span>{season.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">({season.episode_count} Episodes)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3 px-6 pb-4 bg-black/10">
                    {season.episodes.map((episode) => (
                      <div key={episode.episode_number} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 rounded-md bg-background/70">
                        <div className="flex justify-between items-baseline">
                          <p className="font-semibold text-foreground">Episode {episode.episode_number}: {episode.name}</p>
                          {episode.runtime > 0 && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 ml-4 shrink-0">
                              <Clock className="w-3.5 h-3.5" />
                              {episode.runtime} min
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button size="sm" variant="outline" className="h-9 flex-1 sm:flex-none">
                            <Download className="mr-2 h-4 w-4" /> Download
                          </Button>
                          <Button size="sm" className="h-9 flex-1 sm:flex-none" asChild>
                            <Link href={`/watch/${item.type.toLowerCase()}/${item.slug}?season=${season.season_number}&episode=${episode.episode_number}`}>
                              <Play className="mr-2 h-4 w-4" /> Watch
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
