import { ReactNode } from "react";
import css from "./layout.module.css";
import SideBar from "@/components/SideBar/SideBar";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Header from "@/components/Header/Header";

interface NotesLayoutProps {
  children: ReactNode;
}

export default function NotesLayout({ children }: NotesLayoutProps) {
  return (
    <div className={css.pageLayout}>
      <SideBar />
      <div className={css.pageWrapper}>
        <Breadcrumbs />
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
