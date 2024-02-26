import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task tracker",
  description: "Made by Kunga Tashi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  /* redirect logic */

  return (
    <html lang="en">
      <body className={inter.className}>
        
        {/* Navigation bar */}
        {children}
      </body>
    </html>
  );
}
