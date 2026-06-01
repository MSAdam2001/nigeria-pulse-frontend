import "./globals.css";

export const metadata = {
  title: "Nigeria Pulse — What Nigeria Is Thinking Right Now",
  description: "Real-time sentiment intelligence platform tracking Nigerian public discourse. Live data, Hausa & Yoruba language support, AI-powered analysis.",
  keywords: ["Nigeria", "news", "real-time", "intelligence", "Naira", "politics", "economy"],
  openGraph: {
    title: "Nigeria Pulse",
    description: "Real-time sentiment intelligence platform tracking Nigerian public discourse.",
    url: "https://nigeria-pulse-frontend.vercel.app",
    siteName: "Nigeria Pulse",
    locale: "en_NG",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🇳🇬</text></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#008751" />
      </head>
      <body>{children}</body>
    </html>
  );
}