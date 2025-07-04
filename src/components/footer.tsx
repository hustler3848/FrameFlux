export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 bg-secondary/50 mt-12">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {currentYear} FrameFlux. All rights reserved.</p>
      </div>
    </footer>
  );
}
