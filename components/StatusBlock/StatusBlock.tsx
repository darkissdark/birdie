import { useQuery } from '@tanstack/react-query';
import { getUserStats } from '@/lib/api/clientApi';
import React from 'react';
import css from './StatusBlock.module.css';

const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: getUserStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

const WeekStats = () => {
  const { data: stats, isLoading, error } = useUserStats();

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

  if (error) {
    return (
      <div className={css.container}>
        <div className={`${css.statItem} ${css.errorItem}`}>
          <div className={css.label}>Тиждень</div>
          <div className={`${css.value} ${css.errorValue}`}>--</div>
        </div>
        <div className={`${css.statItem} ${css.errorItem}`}>
          <div className={css.label}>Днів до зустрічі</div>
          <div className={`${css.value} ${css.errorValue}`}>--</div>
        </div>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <div className={css.statItem}>
        <div className={css.label}>Тиждень</div>
        <div className={css.value}>{stats?.currentWeek || 0}</div>
      </div>
      <div className={css.statItem}>
        <div className={css.label}>Днів до зустрічі</div>
        <div className={css.value}>~{stats?.daysUntilMeeting || 0}</div>
      </div>
    </div>
  );
};

export default WeekStats;