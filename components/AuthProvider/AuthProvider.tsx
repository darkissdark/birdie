"use client";

import { checkSession, getMe } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";
import { useEffect } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearisAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuthenticated = await checkSession();
        if (isAuthenticated) {
          const user = await getMe();
          if (user) {
            setUser(user);
          } else {
            clearisAuthenticated();
          }
        } else {
          clearisAuthenticated();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        clearisAuthenticated();
      }
    };

    fetchUser();
  }, [setUser, clearisAuthenticated]);

  return <>{children}</>;
};

export default AuthProvider;
