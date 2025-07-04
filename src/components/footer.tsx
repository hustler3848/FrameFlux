import Link from 'next/link';
import { Clapperboard, Twitter, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t border-border mt-16">
      <div className="container mx-auto max-w-screen-2xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-center md:text-left">
          {/* Branding */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Clapperboard className="h-7 w-7 text-primary" />
              <span className="font-bold font-headline text-2xl">FrameFlux</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Discover and explore the latest movies, anime, and webseries.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4 font-headline">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/?type=movie" className="text-muted-foreground hover:text-primary transition-colors">Movies</Link></li>
              <li><Link href="/?type=anime" className="text-muted-foreground hover:text-primary transition-colors">Anime</Link></li>
              <li><Link href="/?type=webseries" className="text-muted-foreground hover:text-primary transition-colors">Webseries</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4 font-headline">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">DMCA</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-1 flex flex-col items-center md:items-start">
             <h3 className="font-semibold text-foreground mb-4 font-headline">Follow Us</h3>
             <div className="flex gap-4">
                <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="h-6 w-6" />
                </Link>
                <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram className="h-6 w-6" />
                </Link>
                 <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                    <Facebook className="h-6 w-6" />
                </Link>
             </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm space-y-2">
            <p>
                <strong>Disclaimer:</strong> This site does not store any files on its server. All contents are provided by non-affiliated third parties.
            </p>
            <p>&copy; {currentYear} Darshan Lamichhane. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
