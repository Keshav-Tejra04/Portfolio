import type { Metadata } from "next";
import { JetBrains_Mono, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keshav OS | Terminal Portfolio",
  description: "Interactive terminal-based portfolio for Keshav Tejra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} ${geistMono.variable} h-full overflow-hidden antialiased`}
    >
      <body 
        className="h-full overflow-hidden flex flex-col font-mono text-terminal-body selection:bg-terminal-primary/30"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="gui-inspired"
          themes={["gui-inspired", "hacker-green", "cyberpunk-blue", "github-dark", "vercel-black"]}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

