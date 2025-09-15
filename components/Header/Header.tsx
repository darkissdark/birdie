"use client";

import Link from "next/link";
import { useUIStore } from "@/lib/store/uiStore";
import BrandLogo from "@/components/Logo/BrandLogo";
import Icon from "@/components/Icon/Icon";
import css from "./Header.module.css";

export default function Header() {
  const openSidebar = useUIStore((s) => s.openSidebar);
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);

  return (
    <header className={css.header}>
      <Link href="/" className={css.logoWrapper} aria-label="На головну">
        <BrandLogo className={css.logoFull} variant="white" />
      </Link>

      <button
        type="button"
        className={css.burgerBtn}
        aria-label={isSidebarOpen ? "Закрити меню" : "Відкрити меню"}
        aria-expanded={isSidebarOpen}
        aria-controls="sidebar-drawer"
        onClick={openSidebar}
      >
        <Icon id="burger_icon" size={32} />
      </button>
    </header>
  );
}
