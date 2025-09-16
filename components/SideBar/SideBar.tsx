"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon/Icon";
import BrandLogo from "@/components/Logo/BrandLogo";
import { useUIStore } from "@/lib/store/uiStore";
import useAuthStore from "@/lib/store/authStore";
import { getWeekFromDueDate } from "@/lib/pregnancy/week";
import api from "@/lib/axios";
import { ConfirmationModal } from "@/components/ConfirmationModal/ConfirmationModal";
import css from "./SideBar.module.css";

export default function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isOpen = useUIStore((s) => s.isSidebarOpen);
  const close = useUIStore((s) => s.closeSidebar);
  const me = useAuthStore((s) => s.user);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);
  const isAuthed = !!me;
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev || "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const week = useMemo(() => getWeekFromDueDate(me) ?? 1, [me]);
  const nav = isAuthed
    ? ([
        { href: "/", text: "Мій день", icon: "myDay_icon" as const },
        {
          href: `/journey/${week}`,
          text: "Подорож",
          icon: "journey_icon" as const,
        },
        { href: "/diary", text: "Щоденник", icon: "diary_icon" as const },
        { href: "/profile", text: "Профіль", icon: "profile_icon" as const },
      ] as const)
    : ([
        {
          href: "/",
          text: "Мій день",
          icon: "myDay_icon" as const,
        },
        {
          href: "/auth/register",
          text: "Подорож",
          icon: "journey_icon" as const,
        },
        {
          href: "/auth/register",
          text: "Щоденник",
          icon: "diary_icon" as const,
        },
        {
          href: "/auth/register",
          text: "Профіль",
          icon: "profile_icon" as const,
        },
      ] as const);

  const onLogoutConfirm = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
    } finally {
      setShowConfirm(false);
      clearIsAuthenticated();
      close();
      router.push("/auth/login");
    }
  };

  const Nav = (
    <nav aria-label="Головна навігація" className={css.nav}>
      {nav.map((l) => {
        const isActive =
          (pathname === "/" && l.href === "/") ||
          (l.href !== "/" &&
            (pathname?.startsWith(l.href.split("?")[0]) ?? false));

        return (
          <Link
            key={l.text}
            href={l.href}
            onClick={close}
            className={`${css.link} ${isActive ? css.active : ""}`}
          >
            <Icon id={l.icon} size={24} className={css.linkIcon} aria-hidden />
            <span className={css.linkText}>{l.text}</span>
          </Link>
        );
      })}
    </nav>
  );

  const Footer = isAuthed ? (
    <div className={css.userRow}>
      <Image
        src={
          me?.avatarUrl ||
          "https://ftp.goit.study/img/common/women-default-avatar.jpg"
        }
        alt={me?.name || "User avatar"}
        width={40}
        height={40}
        className={css.avatar}
      />
      <div className={css.userName}>
        <span>{me?.name}</span>
        <small>{me?.email}</small>
      </div>
      <button
        type="button"
        className={css.logoutInline}
        onClick={() => setShowConfirm(true)}
        aria-label="Вийти"
      >
        <Icon id="logout_icon" size={24} aria-hidden />
      </button>
    </div>
  ) : (
    <div className={css.userRow} role="navigation" aria-label="Авторизація">
      <Link href="/auth/login" className={css.link} onClick={close}>
        <span>Увійти</span>
      </Link>
      <Link href="/auth/register" className={css.link} onClick={close}>
        <span>Зареєструватися</span>
      </Link>
    </div>
  );

  return (
    <>
      <div
        className={`${css.overlay} ${isOpen ? css.overlayOpen : ""}`}
        onClick={close}
      />

      <aside
        id="sidebar-drawer"
        className={`${css.sidebar} ${isOpen ? css.open : ""}`}
        aria-hidden={!isOpen}
      >
        <div className={css.inner}>
          <div className={css.brand}>
            <Link href="/" className={css.logoWrapper} aria-label="На головну">
              <BrandLogo className={css.logoFull} variant="white" />
            </Link>
            <button
              type="button"
              className={css.closeBtn}
              onClick={close}
              aria-label="Закрити меню"
            >
              <Icon id="close_icon" size={32} aria-hidden />
            </button>
          </div>

          {Nav}

          <div className={css.footer}>{Footer}</div>
        </div>
      </aside>

      {showConfirm && (
        <ConfirmationModal
          title="Ви впевнені, що хочете вийти?"
          confirmButtonText="Так"
          cancelButtonText="Скасувати"
          onConfirm={onLogoutConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
