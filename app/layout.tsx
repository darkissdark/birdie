import type { Metadata } from "next";
import { Lato, Comfortaa } from "next/font/google";
import "./globals.css";
import "modern-normalize/modern-normalize.css";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import { ClientLayout } from "@/components/ClientLayout/ClientLayout";

const lato = Lato({
  variable: "--font-lato",
  display: "swap",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  display: "swap",
  weight: ["700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diary App",
  description: "Personal diary application",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <AuthProvider>
        <body className={`${lato.variable} ${comfortaa.variable}`}>
          <ClientLayout>{children}</ClientLayout>
        </body>
      </AuthProvider>
    </html>
  );
}
