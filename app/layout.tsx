import type { Metadata } from "next";
import { Roboto_Condensed, Comfortaa } from "next/font/google";
import "modern-normalize/modern-normalize.css";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import "./globals.css";
import LogoSprite from "@/components/Logo/LogoSprite";
import UiSprite from "@/components/Icon/UiSprite";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

const lato = Roboto_Condensed({
  variable: "--font-lato",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  display: "swap",
  weight: ["700"],
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: "Лелека - Твій помічник під час вагітності",
  description:
    "Отримуй щоденні поради, відстежуй розвиток малюка та плануй свій день разом з нами.",
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
    <html lang="en">
      <TanStackProvider>
        <AuthProvider>
          <body className={`${lato.variable} ${comfortaa.variable}`}>
            <LogoSprite />
            <UiSprite />
            {children}
          </body>
        </AuthProvider>
      </TanStackProvider>
    </html>
  );
}
