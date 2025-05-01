import type { Metadata } from "next";
import "./globals.css";
import { Outfit, Manrope } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '500', '800'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '600', '800'],
});

export const metadata: Metadata = {
  title: "slashest",
  description: "Discord Content Creator",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/slashestpfp.jpg', type: 'image/jpeg' }
    ],
  },
  openGraph: {
    title: "slashest",
    description: "Discord Content Creator",
    url: "https://slashest.com",
    siteName: "slashest",
    images: [
      {
        url: "/slashestpfp.jpg",
        width: 120,
        height: 120,
        alt: "slashest",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "slashest",
    description: "Discord Content Creator",
    creator: "@Slashestt",
    images: ["/slashestpfp.jpg"],
  },
  other: {
    "theme-color": "#00ff66",
    "msapplication-TileColor": "#00ff66"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${manrope.variable}`}>
      <head>
        <link rel="icon" href="/slashestpfp.jpg" type="image/jpeg" />
        <meta property="og:image:width" content="120" />
        <meta property="og:image:height" content="120" />
        <meta property="og:image" content="https://slashest.com/slashestpfp.jpg" />
        <meta property="og:image:alt" content="slashest" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:image" content="https://slashest.com/slashestpfp.jpg" />
        <meta name="twitter:image:alt" content="slashest" />
      </head>
      <body className="bg-[#111111] text-white">
        <Navbar />
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
