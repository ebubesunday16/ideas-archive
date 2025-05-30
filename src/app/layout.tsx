import AuthProvider from "@/components/AuthProvider";
import UserCreationHandler from "@/components/UserCreationHandler";
import Footer from "@/components/sections/Footer";
import Header from "@/components/sections/Header";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Outgenerate",
  description: "Your Next Idea is Here",
  // Open Graph tags for social media sharing
  openGraph: {
    title: "Outgenerate",
    description: "Your Next Idea is Here",
    url: "https://outgenerate.com", // Replace with your actual domain
    siteName: "Outgenerate",
    images: [
      {
        url: "/twitter.png", // Replace with your actual image URL
        width: 1200,
        height: 675,
        alt: "Outgenerate - Your Next Idea is Here",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  // Twitter Card tags
  twitter: {
    card: "summary_large_image",
    title: "Outgenerate",
    description: "Your Next Idea is Here",
    site: "@emannsunday", // Replace with your Twitter handle
    creator: "@emannsunday", // Replace with your Twitter handle
    images: ["/twitter.png"], // Replace with your actual image URL
  },
  // Additional meta tags
  keywords: ["ideas", "innovation", "creativity"], // Add relevant keywords
  authors: [{ name: "Emmanuel Sunday" }], // Replace with your name
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags that can't be set in metadata */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <link rel="canonical" href="https://yoursite.com" />
      </head>
      <body
        className={` ${bricolageGrotesque.className} antialiased  mx-auto px-2 sm:px-4 md:px-0 max-w-6xl min-h-screen bg-black text-white overflow-x-hidden`}
      >
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 -z-10"></div>
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] -z-10"></div>
        
        <AuthProvider>
        <UserCreationHandler />
        <Header className=""/>
        {children}
        <Footer />
        <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}