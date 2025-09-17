"use client";

import { useQuery } from "@tanstack/react-query";
import css from "./GreetingBlock.module.css";
import { getMe, checkSession } from "@/lib/api/clientApi";
import { User } from "@/types/user";
import useAuthStore from "@/lib/store/authStore";

const GreetingBlockClient = () => {
  const { isAuthenticated } = useAuthStore();

  const { data: user, isLoading } = useQuery<User | null>({
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
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const generateGreeting = (userName?: string) => {
    if (!userName) {
      return "Вітаю! Увійдіть для персоналізації";
    }

    const currentHour = new Date().getHours();
    let timeGreeting = "Доброго ранку";

    if (currentHour >= 12 && currentHour < 17) {
      timeGreeting = "Доброго дня";
    } else if (currentHour >= 17) {
      timeGreeting = "Доброго вечора";
    }

    return `${timeGreeting}, ${userName}`;
  };

  if (isLoading && isAuthenticated) {
    return (
      <div className={css.greetingContainer}>
        <h2 className={css.greetingText}>Завантаження...</h2>
      </div>
    );
  }

  const greetingMessage = generateGreeting(user?.name);

  return (
    <div className={css.greetingContainer}>
      <h2 className={css.greetingText}>{greetingMessage}</h2>
    </div>
  );
};

export default GreetingBlockClient;
