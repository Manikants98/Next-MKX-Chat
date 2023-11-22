"use client";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }) {
  const router = useRouter();
  if (typeof window !== "undefined") {
    const isLogin = localStorage.getItem("mkx");
    if (isLogin) {
      router.push("/auth/signup");
    }
  }

  return (
    <html lang="en">
      <title>Desi Chat</title>
      <body>{children}</body>
    </html>
  );
}
