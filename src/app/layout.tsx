import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { FilterProvider } from "@/lib/FilterContext";

export const metadata: Metadata = {
  title: "Apex Sports Hub – Management Platform",
  description:
    "Comprehensive sports facility management: bookings, payments, coaches, athletes, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FilterProvider>
          {children}
        </FilterProvider>
      </body>
    </html>
  );
}
