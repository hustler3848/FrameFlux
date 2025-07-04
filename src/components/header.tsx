
"use client";

import * as React from "react";
import Link from "next/link";
import { Clapperboard } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-300 ease-in-out",
      isScrolled 
        ? "border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg"
        : "border-transparent bg-background"
    )}>
      <div className={cn(
        "container mx-auto flex max-w-screen-2xl items-center gap-4 px-4 transition-all duration-300 ease-in-out",
        isScrolled ? "h-20" : "h-16"
      )}>
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Clapperboard className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-xl">FrameFlux</span>
        </Link>
        <div className="flex-1" />
      </div>
    </header>
  );
}
