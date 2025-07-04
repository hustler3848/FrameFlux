import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata, ResolvingMetadata } from "next";
import { allContent } from "@/lib/data";
import { slugify } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Film, Tv } from "lucide-react";

type Props = {
  params: { type: string; slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { type, slug } = params;
  const item = allContent.find(
    (c) => c.type.toLowerCase() === type && c.slug === slug
  );

  if (!item) {
    return {
      title: "Not Found",
      description: "The content you are looking for does not exist.",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${item.title} | FrameFlux`,
    description: item.description,
    openGraph: {
      title: `${item.title} | FrameFlux`,
      description: item.description,
      type: "video.movie", // or video.tv_show based on item.type
      images: [item.imageUrl, ...previousImages],
      url: `/${type}/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} | FrameFlux`,
      description: item.description,
      images: [item.imageUrl],
    },
  };
}

export async function generateStaticParams() {
    return allContent.map((item) => ({
      type: item.type.toLowerCase(),
      slug: item.slug,
    }));
}


export default function ContentPage({ params }: Props) {
  const { type, slug } = params;
  const item = allContent.find(
    (c) => c.type.toLowerCase() === type && c.slug === slug
  );

  if (!item) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": item.type === 'Movie' ? "Movie" : "TVEpisode",
    "name": item.title,
    "description": item.description,
    "image": item.imageUrl,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": item.rating.toString(),
      "bestRating": "5",
      "ratingCount": Math.floor(Math.random() * 1000) + 50 // Random count
    },
    "genre": item.genre,
    ...(item.type === 'Movie' ? { "datePublished": item.year.toString() } : { "partOfSeries": { "@type": "TVSeries", "name": item.title } })
  };

  return (
    <>
     <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-secondary/20">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
                <a href="/" className="flex items-center gap-2 mr-6">
                <Film className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline text-xl">FrameFlux</span>
                </a>
            </div>
        </header>

        <main className="container mx-auto px-4 py-8 md:py-16">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="md:col-span-1">
              <div className="aspect-[2/3] relative w-full rounded-2xl shadow-lg overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  priority
                  data-ai-hint={`${item.type.toLowerCase()} ${item.genre[0].toLowerCase()}`}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <Badge className="mb-2 bg-accent text-accent-foreground font-poppins">{item.type}</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold font-headline text-foreground">
                {item.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-lg text-foreground">{item.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                    {item.type === 'Movie' ? <Film className="w-5 h-5"/> : <Tv className="w-5 h-5" />}
                    <span>{item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{item.year}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {item.genre.map((g) => (
                  <Badge key={g} variant="secondary">{g}</Badge>
                ))}
              </div>
              
              <p className="mt-8 text-lg text-foreground/80 leading-relaxed">
                {item.description}
              </p>

              <div className="my-8 h-40 md:h-60 w-full rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground border border-dashed">
                ADVERTISEMENT
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
