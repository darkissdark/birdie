import { ReactNode } from "react";
import css from "./LayoutNotes.module.css";

interface NotesLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export default function NotesLayout({ children, sidebar }: NotesLayoutProps) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div>
        <header>
          <div>breadCrumbs</div>
          <div>Title</div>
        </header>
        <main className={css.pageWrapper}>{children}</main>
      </div>
    </div>
  );
}
