"use client";
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=0.0, maximum-scale=0.0, user-scalable=0"
      />
      <title>Desi Chat™</title>
      <body className="dark">{children}</body>
    </html>
  );
}
