import { useQuery } from "@tanstack/react-query";
import React from "react";
import css from "./StatusBlock.module.css";
import { getMe, getUserStats, checkServerSession } from "@/lib/api/serverApi";

// const useUserStats = () => {
//   return
//   useQuery({
//     queryKey: ['userStats'],
//     queryFn: getUserStats,
//     staleTime: 5 * 60 * 1000,
//     retry: 2,
//   });
// };

const WeekStats = async () => {
  try {
    const isAuth = await checkServerSession();
    const user = isAuth?.data?.success ? await getMe() : null;

    if (!user) {
      // Якщо користувач не залогінений
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

    // Якщо юзер є – тягнемо статистику
    const data = await getUserStats();

    if (!data) {
      // fallback якщо з бекенду вернеться null
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
          <div className={css.value}>{data.curWeekToPregnant}</div>
        </div>
        <div className={css.statItem}>
          <div className={css.label}>Днів до зустрічі</div>
          <div className={css.value}>{data.daysBeforePregnant}</div>
        </div>
      </div>
    );
  } catch (err) {
    console.error("Помилка завантаження статистики:", err);
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
};

export default WeekStats;
