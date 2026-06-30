import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Looper Todo",
  description: "A focused todo app for tracking active and completed work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
