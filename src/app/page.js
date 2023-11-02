"use client";
import { ThemeProvider, createTheme } from "@mui/material";
import Chat from "./chat/page";

export default function Home() {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Chat />
    </ThemeProvider>
  );
}
