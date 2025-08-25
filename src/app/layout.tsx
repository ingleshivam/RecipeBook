import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/MobileMenu";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "RecipeShare | Share & Discover Delicious Recipes",
  description:
    "RecipeShare is a platform to explore, share, and save recipes from around the world. Discover new dishes, create your own recipes, and connect with food lovers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="hidden md:block">
            <Navbar />
            {children} <Toaster richColors />
          </div>
          <div className="grid grid-rows-12 h-screen  md:hidden">
            {/* <ScrollArea className="row-span-11 ">
              {children} <Toaster richColors />
            </ScrollArea>
            <div className="row-span-1">
              {" "}
              <MobileMenu />
            </div> */}
            <div className=" row-span-11">
              {children} <Toaster richColors />
            </div>
            <div className="bg-white row-span-1 fixed bottom-0 left-0 w-full z-50">
              <MobileMenu />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
