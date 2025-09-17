"use client";

import { useQuery } from "@tanstack/react-query";
import css from "./GreetingBlock.module.css";
import { getMe, checkSession } from "@/lib/api/clientApi";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

export interface WhoTimeProps {
  currentHour: number;
}

function GreetingTime(): WhoTimeProps {
  return { currentHour: new Date().getHours() };
}

interface GreetingBlockClientProps {
  initialUser?: User | null;
}

const GreetingBlockClient = ({ initialUser }: GreetingBlockClientProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const isAuth = await checkSession();
      if (!isAuth) return null;
      
      try {
        return await getMe();
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },
    initialData: initialUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  if (!isClient) {
    // Server-side fallback
    if (initialUser) {
      const whoTime = GreetingTime();
      let timeGreeting = "Доброго ранку";
      if (whoTime.currentHour >= 12 && whoTime.currentHour < 17)
        timeGreeting = "Доброго дня";
      if (whoTime.currentHour >= 17) timeGreeting = "Доброго вечора";

      return (
        <div className={css.greetingContainer}>
          <h2 className={css.greetingText}>
            {`${timeGreeting}
            ${initialUser.name}`}
          </h2>
        </div>
      );
    }
    
    return (
      <div className={css.greetingContainer}>
        <h2 className={css.greetingText}>
          Вітаю! Увійдіть для персоналізації
        </h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={css.greetingContainer}>
        <h2 className={css.greetingText}>
          Завантаження...
        </h2>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className={css.greetingContainer}>
        <h2 className={css.greetingText}>
          Вітаю! Увійдіть для персоналізації
        </h2>
      </div>
    );
  }

  const whoTime = GreetingTime();
  let timeGreeting = "Доброго ранку";
  if (whoTime.currentHour >= 12 && whoTime.currentHour < 17)
    timeGreeting = "Доброго дня";
  if (whoTime.currentHour >= 17) timeGreeting = "Доброго вечора";

  return (
    <div className={css.greetingContainer}>
      <h2 className={css.greetingText}>
        {`${timeGreeting}
        ${user.name}`}
      </h2>
    </div>
  );
};

export default GreetingBlockClient;
