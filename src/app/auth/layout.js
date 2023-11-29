"use client";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "react-query";

export default function AuthLayout({ children }) {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="flex items-center min-h-screen lg:p-4 p-2 dark:bg-[#0c1317] bg-gray-100 lg:justify-center">
          <div className="flex flex-col overflow-hidden dark:bg-[#222e35] bg-white rounded-md shadow-lg md:flex-row md:flex-1 lg:max-w-screen-lg">
            {children}
          </div>
        </div>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
