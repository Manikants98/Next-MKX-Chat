"use client";
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <title>Desi Chat™</title>
      <body>{children}</body>
    </html>
  );
}
