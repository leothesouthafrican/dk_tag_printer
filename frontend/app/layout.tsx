import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DasKasas Tag Tool",
  description: "Generate custom price tags from DEAR Inventory CSV exports",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
