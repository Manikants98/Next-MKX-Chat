"use client";
import { useEffect, useState } from "react";
import "./globals.css";
export default function RootLayout({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("token")) {
        setIsLogin(true);
      } else {
        router.push("/auth/signin");
      }
    }
  }, []);
  return (
    <html lang="en">
      <title>Desi Chat™</title>
      <body>{children}</body>
    </html>
  );
}
