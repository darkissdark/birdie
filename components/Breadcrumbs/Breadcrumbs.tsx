"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/lib/store/authStore";
import { checkSession, getUserStats } from "@/lib/api/clientApi";
import css from "./Breadcrumbs.module.css";

type UserStats = { curWeekToPregnant: number };

const labelMap: Record<string, string> = {
  "/": "Мій день",
  "/journey": "Подорож",
  "/diary": "Щоденник",
  "/profile": "Профіль",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  const { data: stats } = useQuery<UserStats | null>({
    queryKey: ["userStats"],
    queryFn: async () => {
      const ok = await checkSession();
      if (!ok) return null;
      try {
        return await getUserStats();
      } catch {
        return null;
      }
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (!pathname || pathname.startsWith("/auth")) return null;

  const parts = pathname.split("/").filter(Boolean);
  const segments: { href: string; label: string }[] = [];

  segments.push({ href: "/", label: labelMap["/"] });

  if (parts.length > 0) {
    let acc = "";
    parts.forEach((p, idx) => {
      acc += "/" + p;

      let href = acc;
      let label = labelMap[acc] ?? decodeURIComponent(p);

      if (parts[0] === "journey" && idx === 0) {
        label = labelMap["/journey"];
        const week = stats?.curWeekToPregnant ?? Number(parts[1] || 1);
        href = `/journey/${week}`;
      }
      if (parts[0] === "journey" && idx === 1) {
        label = `Тиждень ${p}`;
      }

      segments.push({ href, label });
    });
  }

  return (
    <div className={css.wrap} role="navigation" aria-label="Breadcrumb">
      <ul className={css.list}>
        {segments.map((s, i) => {
          const isLast = i === segments.length - 1;
          return isLast ? (
            <li key={i} className={css.item} aria-current="page">
              {s.label}
            </li>
          ) : (
            <li key={i} className={css.item}>
              <Link className={css.link} href={s.href}>
                {s.label}
              </Link>{" "}
              <span className={css.sep}>/</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
