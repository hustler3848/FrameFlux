import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";
import { getContentBySlug, getInitialContent } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Clock, Tv, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/content-card";
import { Header } from "@/components/header";
import type { Content } from "@/types";

type Props = {
  params: { type: string; slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  const item = await getContentBySlug(slug);

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
      type: "video.movie", 
      images: [item.imageUrl, ...previousImages],
      url: `/${item.type.toLowerCase()}/${item.slug}`,
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
    const initialContent = await getInitialContent();
    return initialContent.map((item) => ({
      type: item.type.toLowerCase(),
      slug: item.slug,
    }));
}


export default async function ContentPage({ params }: Props) {
  const { type, slug } = params;
  const item = await getContentBySlug(slug);

  if (!item) {
    notFound();
  }

  const recommendedContent = (await getInitialContent())
    .filter((content) => content.type === item.type && content.id !== item.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  const formatDurationISO = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let isoString = 'PT';
    if (hours > 0) isoString += `${hours}H`;
    if (mins > 0) isoString += `${mins}M`;
    return isoString;
  };
  const isoDuration = formatDurationISO(item.duration);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": item.type === 'Movie' ? "Movie" : "TVEpisode",
    "name": item.title,
    "description": item.description,
    "image": item.imageUrl,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (item.rating * 2).toString(), // OMDb is 0-10, we convert to 0-5. Schema needs 0-10.
      "bestRating": "10",
      "ratingCount": Math.floor(Math.random() * 1000) + 50 // Random count
    },
    "genre": item.genre,
    ...(item.type === 'Movie' 
        ? { "datePublished": item.year.toString(), "duration": isoDuration } 
        : { "partOfSeries": { "@type": "TVSeries", "name": item.title }, "timeRequired": isoDuration })
  };

  return (
    <>
     <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto max-w-7xl px-2 sm:px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="aspect-[2/3] relative w-full rounded-2xl shadow-lg overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  priority
                  data-ai-hint={`${item.type.toLowerCase()} ${item.genre[0]?.toLowerCase()}`}
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
                  <span className="font-bold text-lg text-foreground">{item.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                    {item.type === 'Movie' ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-film"><path d="M4.5 10H3a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1.5"/><path d="M19.5 10h1.5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H18"/><path d="M7 10v10"/><path d="M17 4v10"/><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M2 8h20"/><path d="M2 16h20"/></svg> : <Tv className="w-5 h-5" />}
                    <span>{item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{item.year}</span>
                </div>
                 {item.duration > 0 && (
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>{item.duration} min</span>
                    </div>
                 )}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {item.genre.map((g) => (
                  <Badge key={g} variant="secondary">{g}</Badge>
                ))}
              </div>
              
              <p className="mt-8 text-lg text-foreground/80 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" className="flex-1 sm:flex-none">
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </Button>
                <Link href={`/watch/${item.type.toLowerCase()}/${item.slug}`} asChild>
                  <Button size="lg" variant="secondary" className="flex-1 sm:flex-none">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Now
                  </Button>
                </Link>
              </div>

              <div className="my-8 h-40 md:h-60 w-full rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground border border-dashed">
                ADVERTISEMENT
              </div>
            </div>
          </div>
        </main>

        <section className="py-12 border-t border-border bg-secondary/20">
          <div className="container mx-auto max-w-7xl px-2 sm:px-4">
            <h2 className="text-3xl font-headline font-bold mb-8 text-foreground">
              You Might Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {recommendedContent.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
