
"use client";

import * as React from "react";
import Link from "next/link";
import { Clapperboard, Search, Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
    { href: "/?type=movie", label: "Movies" },
    { href: "/?type=anime", label: "Anime" },
];


export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [openMobileMenu, setOpenMobileMenu] = React.useState(false);

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
        <div className="flex items-center gap-4 md:gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Clapperboard className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline text-xl hidden sm:inline-block">FrameFlux</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                    <Link key={link.label} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>


        <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <Link href="/search" passHref>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
              </Button>
            </Link>
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <div className="flex flex-col items-start">
                        <p className="font-medium">New release: The Matrix 4</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                       <div className="flex flex-col items-start">
                        <p className="font-medium">Your download is complete</p>
                        <p className="text-xs text-muted-foreground">Yesterday</p>
                      </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="flex flex-col gap-6 pt-10">
                        <Link href="/" className="flex items-center gap-2 mb-4" onClick={() => setOpenMobileMenu(false)}>
                            <Clapperboard className="h-6 w-6 text-primary" />
                            <span className="font-bold font-headline text-xl">FrameFlux</span>
                        </Link>
                        {navLinks.map((link) => (
                            <Link key={link.label} href={link.href} className="text-lg font-medium text-foreground transition-colors hover:text-primary" onClick={() => setOpenMobileMenu(false)}>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
