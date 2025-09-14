import { ReactNode } from "react";
import css from "./layout.module.css";
import SideBar from "@/components/SideBar/SideBar";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Header from "@/components/Header/Header";
import { GeminiAssistant } from "@/components/GeminiAssistant/GeminiAssistant";
import { AddDiaryEntryModal } from "@/components/AddDiaryEntryModal/AddDiaryEntryModal";

interface NotesLayoutProps {
  children: ReactNode;
}

export default function NotesLayout({ children }: NotesLayoutProps) {
  return (
    <div className={css.pageLayout}>
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
