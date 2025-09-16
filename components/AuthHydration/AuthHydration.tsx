"use client";

import { useEffect } from "react";
import useAuthStore from "@/lib/store/authStore";
import { User } from "@/types/user";

interface AuthHydrationProps {
  user: User;
}

export default function AuthHydration({ user }: AuthHydrationProps) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return null;
}
