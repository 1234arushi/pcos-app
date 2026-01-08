import type { Metadata } from "next";
import { Toaster } from "react-hot-toast"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-pink-200">
        <div className="w-full p-6">
          <Navbar/>
          {children}
          <Toaster position="top-right" />

        </div>
      </body>
    </html>
  );
}
