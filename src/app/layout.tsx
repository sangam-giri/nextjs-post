import type { Metadata } from "next";
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: "My App",
  description: "Next.js App with Clean Architecture",
  icons: {
    icon: "/favicon/favicon.ico",         // Default favicon
    shortcut: "/favicon/favicon.png",     // Optional
    apple: "/favicon/favicon.png",        // For iOS Safari
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
