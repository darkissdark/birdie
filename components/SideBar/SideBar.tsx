"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon/Icon";
import { useUIStore } from "@/lib/store/uiStore";
import api from "@/lib/axios";
import { getWeekFromDueDate } from "@/lib/pregnancy/week";
import BrandLogo from "@/components/Logo/BrandLogo";
import css from "./SideBar.module.css";
import { User } from "@/types/user";
import { ConfirmationModal } from "@/components/ConfirmationModal/ConfirmationModal";

function isUser(v: unknown): v is User {
  return (
    !!v && typeof v === "object" && "_id" in v && "email" in v && "name" in v
  );
}

export default function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarOpen, closeSidebar } = useUIStore();

  useEffect(() => {
    const body = document.body;
    const prev = body.style.overflow;
    if (isSidebarOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = prev || "";
    }
    return () => {
      body.style.overflow = prev || "";
    };
  }, [isSidebarOpen]);

  const [me, setMe] = useState<User | null>(null);
  const isAuthed = !!me;

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let canceled = false;

    (async () => {
      try {
        const res = await api.get("/users/current");
        if (!canceled && res.status === 200 && isUser(res.data)) {
          setMe(res.data);
        } else if (!canceled) {
          setMe(null);
        }
      } catch {
        if (!canceled) setMe(null);
      }
    })();

    return () => {
      canceled = true;
    };
  }, []);

  const week = useMemo(() => getWeekFromDueDate(me), [me]);

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
          href: "/auth/register",
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

  const confirmLogout = async () => {
    try {
      await api.post("/auth/logout");
      setShowConfirm(false);
      setMe(null);
      closeSidebar();
      router.push("/auth/login");
    } catch {
      setShowConfirm(false);
    }
  };

  const NavList = (
    <nav aria-label="Головна навігація" className={css.nav}>
      {nav.map((l) => {
        const isActive =
          (pathname === "/" && l.href === "/") ||
          (l.href !== "/" && pathname?.startsWith(l.href.split("?")[0]));
        return (
          <Link
            key={l.text}
            href={l.href}
            className={`${css.link} ${isActive ? css.active : ""}`}
            onClick={closeSidebar}
          >
            <Icon id={l.icon} size={24} aria-hidden />
            <span>{l.text}</span>
          </Link>
        );
      })}
    </nav>
  );

  const FooterArea = isAuthed ? (
    <div className={css.userRow}>
      <div className={css.avatar}>
        <Image
          src={
            me?.avatarUrl ||
            "https://ftp.goit.study/img/common/women-default-avatar.jpg"
          }
          alt="Аватар користувача"
          fill
          sizes="48px"
          style={{ objectFit: "cover" }}
        />
      </div>
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
      <Link href="/auth/login" className={css.link} onClick={closeSidebar}>
        <span>Увійти</span>
      </Link>
      <Link href="/auth/register" className={css.link} onClick={closeSidebar}>
        <span>Зареєструватися</span>
      </Link>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={css.sidebar}>
        <div className={css.inner}>
          <div className={css.brand}>
            <Link href="/" className={css.logoWrapper} aria-label="На головну">
              <BrandLogo className={css.logoFull} variant="white" />
            </Link>
          </div>

          {NavList}
          <div className={css.footer}>{FooterArea}</div>
        </div>
      </aside>

      {/* Overlay + Drawer for mobile/tablet*/}
      <div
        className={`${css.overlay} ${isSidebarOpen ? css.overlayOpen : ""}`}
        onClick={closeSidebar}
      />
      <aside
        id="sidebar-drawer"
        className={`${css.drawer} ${isSidebarOpen ? css.drawerOpen : ""}`}
        aria-hidden={!isSidebarOpen}
      >
        <div className={css.drawerHeader}>
          <button
            type="button"
            className={css.closeBtn}
            onClick={closeSidebar}
            aria-label="Закрити меню"
          >
            <Icon id="close_icon" size={24} aria-hidden />
          </button>
          <Link href="/" className={css.logoWrapper} aria-label="На головну">
            <BrandLogo className={css.logoFull} variant="white" />
          </Link>
        </div>

        {NavList}
        <div className={css.footer}>{FooterArea}</div>
      </aside>

      {showConfirm && (
        <ConfirmationModal
          title="Ви впевнені, що хочете вийти?"
          confirmButtonText="Так"
          cancelButtonText="Скасувати"
          onConfirm={confirmLogout}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
