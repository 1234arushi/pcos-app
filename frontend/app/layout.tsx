import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PCOS App",
  description: "PCOS app frontend",
};

export default function RootLayout({//wrapper for every page
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      {/*
        body = main page container
        min-h-screen → full height of browser
        items-center → vertical center
        justify-center → horizontal center
        flex -> enables layout control
      */}
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased
        `}
      >
        <div className="min-h-screen w-full bg-pink-200 flex items-center justify-center">   {/* because 'body' tag next.js gets overridden */}
          {children}   {/* whatever page is currently open! */}
        </div>

      </body>
    </html>
  );
}
