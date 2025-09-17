"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import css from "./StatusBlock.module.css";
import { getUserStats, checkSession } from "@/lib/api/clientApi";

interface UserStats {
  curWeekToPregnant: number;
  daysBeforePregnant: number;
}

interface StatusBlockClientProps {
  initialData?: UserStats | null;
}

const StatusBlockClient = ({ initialData }: StatusBlockClientProps) => {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery<UserStats | null>({
    queryKey: ["userStats"],
    queryFn: async () => {
      const isAuth = await checkSession();
      if (!isAuth) return null;

      try {
        return await getUserStats();
      } catch (error) {
        console.error("Error fetching user stats:", error);
        return null;
      }
    },
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className={css.container}>
        <div className={css.statItem}>
          <div className={css.label}>Тиждень</div>
          <div className={css.value}>...</div>
        </div>
        <div className={css.statItem}>
          <div className={css.label}>Днів до зустрічі</div>
          <div className={css.value}>...</div>
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className={css.container}>
        <div className={css.statItem}>
          <div className={css.label}>Тиждень</div>
          <div className={css.value}>---</div>
        </div>
        <div className={css.statItem}>
          <div className={css.label}>Днів до зустрічі</div>
          <div className={css.value}>---</div>
        </div>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <div className={css.statItem}>
        <div className={css.label}>Тиждень</div>
        <div className={css.value}>{stats.curWeekToPregnant}</div>
      </div>
      <div className={css.statItem}>
        <div className={css.label}>Днів до зустрічі</div>
        <div className={css.value}>{stats.daysBeforePregnant}</div>
      </div>
    </div>
  );
};

export default StatusBlockClient;
