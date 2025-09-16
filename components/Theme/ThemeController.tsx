"use client";

import { useEffect } from "react";
import useAuthStore from "@/lib/store/authStore";

function resolveTheme(babyGender?: string, themeFromUser?: string) {
  const override =
    typeof window !== "undefined"
      ? window.localStorage.getItem("appThemeOverride") || undefined
      : undefined;

  if (override) return override;

  if (themeFromUser && ["light", "pink", "blue"].includes(themeFromUser)) {
    return themeFromUser === "light" ? "neutral" : themeFromUser;
  }

  switch (babyGender) {
    case "girl":
      return "pink";
    case "boy":
      return "blue";
    default:
      return "neutral";
  }
}

export default function ThemeController() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const theme = resolveTheme(user?.babyGender, user?.theme);
    const root = document.documentElement;

    root.setAttribute("data-theme", theme);

    const compatClass =
      theme === "pink"
        ? "theme--girl"
        : theme === "blue"
          ? "theme--boy"
          : "theme--neutral";
    root.classList.remove(
      "theme--girl",
      "theme--boy",
      "theme--neutral",
      "theme--unknown"
    );
    root.classList.add(compatClass);
  }, [user?.babyGender, user?.theme]);

  return null;
}
