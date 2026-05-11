import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VLE From Scratch",
  description: "A 10-lesson companion course building a multi-tenant VLE.",
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
