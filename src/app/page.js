"use client";
import { ThemeProvider, createTheme } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "react-query";
import Chat from "./chat/page";

export default function Home() {
  const client = new QueryClient();

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={client}>
          <SnackbarProvider
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Chat />
          </SnackbarProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
