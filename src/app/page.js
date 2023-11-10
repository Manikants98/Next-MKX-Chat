"use client";
import { ThemeProvider, createTheme } from "@mui/material";
import Chat from "./chat/page";
import { QueryClient, QueryClientProvider } from "react-query";
import { SnackbarProvider } from "notistack";

export default function Home() {
  const client = new QueryClient();

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <>
      {/* ThemeProvider for MUI theming */}
      <ThemeProvider theme={theme}>
        {/* SnackbarProvider for displaying snackbars */}
        <SnackbarProvider>
          {/* QueryClientProvider for React Query */}
          {/* <QueryClientProvider client={client}> */}
          {/* Your main component */}
          <Chat />
          {/* </QueryClientProvider> */}
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}
