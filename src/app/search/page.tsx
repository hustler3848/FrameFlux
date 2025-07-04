
import { notFound } from 'next/navigation';

export default function SearchPage() {
  // This page is no longer used. Search is now handled by a modal dialog.
  // We'll call notFound() to prevent users from accessing it directly.
  notFound();
}
