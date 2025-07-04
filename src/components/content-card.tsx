import Link from "next/link";
import Image from "next/image";
import type { Content } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <Link
      href={`/${content.type.toLowerCase()}/${content.slug}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:scale-105">
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={content.imageUrl}
            alt={content.title}
            fill
            className="object-cover"
            data-ai-hint={`${content.type.toLowerCase()} ${content.genre[0].toLowerCase()}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <Badge 
              className={cn("text-xs", content.type === 'Anime' ? 'bg-accent text-accent-foreground font-poppins' : 'bg-primary text-primary-foreground')}
            >
              {content.type}
            </Badge>
            <div className="flex items-center gap-1 text-white text-sm font-bold">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{content.rating}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 px-1">
        <h3 className="font-headline text-base font-semibold text-foreground truncate group-hover:text-primary">
          {content.title}
        </h3>
        <p className="text-sm text-muted-foreground">{content.year}</p>
      </div>
    </Link>
  );
}
