import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { allContent } from "@/lib/data";
import { ContentCard } from "@/components/content-card";

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q?.trim() || "";

  const searchResults = query
    ? allContent.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.genre.some((g) => g.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto max-w-screen-2xl px-2 sm:px-4 pt-8 flex-1">
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
