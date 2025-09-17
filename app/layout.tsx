import type { Metadata } from "next";
import { Roboto_Condensed, Comfortaa } from "next/font/google";
import "modern-normalize/modern-normalize.css";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import "./globals.css";
import LogoSprite from "@/components/Logo/LogoSprite";
import UiSprite from "@/components/Icon/UiSprite";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import "@/styles/theme-tokens.css";
import { Toaster } from "react-hot-toast";

const toastConfig = {
  position: "top-right" as const,
  toastOptions: {
    duration: 4000,
    style: { background: "#363636", color: "#fff" },
    success: {
      duration: 3000,
      iconTheme: { primary: "#4ade80", secondary: "#fff" },
    },
    error: {
      duration: 4000,
      iconTheme: { primary: "#ef4444", secondary: "#fff" },
    },
  },
};

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
  title: "Лелека - Твій помічник під час вагітності",
  description:
    "Отримуй щоденні поради, відстежуй розвиток малюка та плануй свій день разом з нами.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    images: [
      {
        url: "https://st2.depositphotos.com/3827765/5416/v/600/depositphotos_54165269-stock-illustration-stork-carrying-a-baby.jpg",
        width: 600,
        height: 446,
        alt: "Лелека - Твій помічник під час вагітності",
      },
    ],
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
            <Toaster {...toastConfig} />
          </body>
        </AuthProvider>
      </TanStackProvider>
    </html>
  );
}
