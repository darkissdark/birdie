"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe, checkSession } from "@/lib/api/clientApi";
import css from "./GreetingBlock.module.css";

const useCurrentUser = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResult = await checkSession();
        setIsAuthenticated(authResult);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
    staleTime: 10 * 60 * 1000,
    retry: 1,
    enabled: isAuthenticated && !isCheckingAuth,
  });
};

const Greeting = () => {
  const { data: user, isLoading } = useCurrentUser();
  const [currentHour, setCurrentHour] = useState<number | null>(null);

  useEffect(() => {
    setCurrentHour(new Date().getHours());
  }, []);

  const getGreeting = () => {
    if (isLoading) return "Завантаження...";

    if (currentHour === null) {
      return "Доброго дня! Увійдіть для персоналізації";
    }

    let timeGreeting = "Доброго ранку";
    if (currentHour >= 12 && currentHour < 17) timeGreeting = "Доброго дня";
    if (currentHour >= 17) timeGreeting = "Доброго вечора";

    if (!user || !user.name) {
      return `${timeGreeting}! Увійдіть для персоналізації`;
    }

    return `${timeGreeting}, ${user.name}!`;
  };

  return (
    <div className={css.greetingContainer}>
      <h2 className={css.greetingText}>{getGreeting()}</h2>
    </div>
  );
};

export default Greeting;
