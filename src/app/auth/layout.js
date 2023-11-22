"use client";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "react-query";

export default function AuthLayout({ children }) {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <SnackbarProvider>
        <div class="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
          <div class="flex flex-col overflow-hidden bg-white rounded-md shadow-lg md:flex-row md:flex-1 lg:max-w-screen-lg">
            {children}
          </div>
        </div>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
