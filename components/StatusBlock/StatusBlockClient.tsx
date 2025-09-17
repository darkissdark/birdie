"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import css from "./StatusBlock.module.css";
import { getUserStats, checkSession } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";

interface UserStats {
  curWeekToPregnant: number;
  daysBeforePregnant: number;
}

const StatusBlockClient = () => {
  const { isAuthenticated } = useAuthStore();
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
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  if (isLoading && isAuthenticated) {
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

  if (isError || !stats || !isAuthenticated) {
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
