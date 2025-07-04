
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';

import type { Content } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, PlayCircle, Calendar } from 'lucide-react';

interface HeroSectionProps {
  content: Content[];
}

export function HeroSection({ content }: HeroSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  if (!content || content.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[50vh] md:h-[85vh] mb-8">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {content.map((item, index) => (
            <div key={item.id} className="flex-shrink-0 flex-grow-0 basis-full relative h-full">
              <Image
                src={item.imageUrl.replace('600x900', '1600x900')}
                alt={item.title}
                fill
                priority={index === 0}
                className="object-cover object-top"
                data-ai-hint={`hero ${item.genre[0].toLowerCase()}`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto max-w-screen-2xl px-4 md:px-12 text-white">
                  <div className="max-w-2xl">
                     <Badge variant={item.type === 'Anime' ? 'default' : 'secondary'} className={cn(
                        "bg-white/10 border-none backdrop-blur-sm mb-4",
                        selectedIndex === index
                            ? "opacity-0 animate-fade-in [animation-delay:200ms]"
                            : "opacity-0"
                    )}>
                        {item.type}
                    </Badge>
                    <h1 className={cn(
                        "text-4xl md:text-6xl font-bold font-headline mb-4",
                        selectedIndex === index
                            ? "opacity-0 animate-slide-in-from-left [animation-delay:300ms]"
                            : "opacity-0"
                    )}>
                      {item.title}
                    </h1>
                    <div className={cn(
                        "flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm md:text-base text-white/80",
                         selectedIndex === index
                            ? "opacity-0 animate-slide-in-from-left [animation-delay:400ms]"
                            : "opacity-0"
                    )}>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{item.year}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.genre.slice(0,2).map(g => <span key={g}>{g}</span>).reduce((prev, curr) => [prev, '·', curr] as any)}
                      </div>
                    </div>
                    <p className={cn(
                        "mb-6 text-base md:text-lg text-white/80 line-clamp-3",
                        selectedIndex === index
                            ? "opacity-0 animate-slide-in-from-left [animation-delay:500ms]"
                            : "opacity-0"
                    )}>
                      {item.description}
                    </p>
                    <Button 
                      asChild 
                      size="lg" 
                      variant="destructive"
                      className={cn(
                          selectedIndex === index
                              ? "opacity-0 animate-fade-in [animation-delay:600ms]"
                              : "opacity-0"
                      )}
                    >
                      <Link href={`/watch/${item.type.toLowerCase()}/${item.slug}`}>
                        <PlayCircle className="mr-2" />
                        Watch Now
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="flex gap-2">
          {content.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'w-8 h-1 rounded-full transition-all duration-300',
                selectedIndex === index ? 'bg-primary w-12' : 'bg-white/30 hover:bg-white/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
