"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import Sidebar from "./shared/sidebar";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createTheme } from "@mui/material";

export default function AdminLayout({ children }) {
  const client = new QueryClient();
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider className="!capitalize">
          <div className="flex gap-1 overflow-auto h-screen w-screen bg-zinc-200 dark:bg-zinc-700 p-1">
            <Sidebar />
            <div className="flex flex-col rounded bg-white dark:bg-zinc-800 w-full">
              {children}
            </div>
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
