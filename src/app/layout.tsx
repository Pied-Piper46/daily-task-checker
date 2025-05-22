import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Google Fonts
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// Application metadata (Optional)
export const metadata: Metadata = {
  title: "Daily Task Checker Dashboard",
  description: "A web application to register, monitor, and manage IoT devices, displaying their task status and history. Designed for ESP32-based devices with LED matrix displays.",
};


// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
