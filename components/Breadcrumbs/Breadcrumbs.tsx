"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthStore from "@/lib/store/authStore";
import css from "./Breadcrumbs.module.css";
import { getWeekFromDueDate } from "@/lib/pregnancy/week";

const labelMap: Record<string, string> = {
  "/": "Мій день",
  "/journey": "Подорож",
  "/diary": "Щоденник",
  "/profile": "Профіль",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

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
        href = `/journey/${getWeekFromDueDate(user)}`;
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
              </Link>
              <span className={css.sep}> / </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
