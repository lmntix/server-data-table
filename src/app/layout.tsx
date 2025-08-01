import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "Server Data Table",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <NuqsAdapter>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
              enableSystem
            >
              {children}{" "}
            </ThemeProvider>
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
