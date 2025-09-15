'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/lib/api/clientApi'; 
import css from './GreetingBlock.module.css';

const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getMe,
    staleTime: 10 * 60 * 1000, 
    retry: 1,
  });
};

const Greeting = () => {
  const { data: user, isLoading } = useCurrentUser();

  const getGreeting = () => {
    if (isLoading) return 'Завантаження...';
    
    const hour = new Date().getHours();
    let timeGreeting = 'Доброго ранку';
    
    if (hour >= 12 && hour < 17) timeGreeting = 'Доброго дня';
    if (hour >= 17) timeGreeting = 'Доброго вечора';
    
    if (!user || !user.name) {
      return `${timeGreeting}! Увійдіть для персоналізації`;
    }
    
    return `${timeGreeting}, ${user.name}!`;
  };

  return (
    <div className={css.greetingContainer}>
      <h2 className={css.greetingText}>
        {getGreeting()}
      </h2>
    </div>
  );
};

export default Greeting;