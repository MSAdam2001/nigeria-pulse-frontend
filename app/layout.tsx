import "./globals.css";

export const metadata = {
  title: "Nigeria Pulse — What Nigeria Is Thinking Right Now",
  description: "Real-time sentiment intelligence platform tracking Nigerian public discourse across news, social media and search trends.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}