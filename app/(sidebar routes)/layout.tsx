import { ReactNode } from "react";
import css from "./layout.module.css";
import SideBar from "@/components/SideBar/SideBar";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Header from "@/components/Header/Header";
import { GeminiAssistant } from "@/components/GeminiAssistant/GeminiAssistant";
import { Lato, Comfortaa } from "next/font/google";
import ThemeController from "@/components/Theme/ThemeController";
import "@/styles/theme-tokens.css";
import AuthHydration from "@/components/AuthHydration/AuthHydration";
import { getMe } from "@/lib/api/serverApi";

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
  subsets: ["latin", "cyrillic"],
});

interface NotesLayoutProps {
  children: ReactNode;
}

export default async function NotesLayout({ children }: NotesLayoutProps) {
  let user = null;
  try {
    user = await getMe();
  } catch {
    user = null;
  }

  return (
    <div className={`${css.pageLayout} ${lato.variable} ${comfortaa.variable}`}>
      {user && <AuthHydration user={user} />}
      <ThemeController />
      <SideBar />
      <div className={css.pageWrapper}>
        <Header />
        <Breadcrumbs />
        <main id="content" role="main" className={css.main}>
          {children}
        </main>
      </div>
      <GeminiAssistant />
    </div>
  );
}
