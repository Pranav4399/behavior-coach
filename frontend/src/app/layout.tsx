import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/api/query-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from '@/hooks/useAuth';
import { LoadingProvider } from '@/hooks/useLoading';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Behavior Coach",
  description: "Behavior coaching application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light" style={{ colorScheme: 'light' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingProvider>
            <ReactQueryProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ReactQueryProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
