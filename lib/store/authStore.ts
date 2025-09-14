import { create } from "zustand";
import type { User } from "@/types/user";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  // setUser: (user: User) => void;
  setUser: (user: Partial<User>) => void;
  clearIsAuthenticated: () => void;
}

const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (newUser) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...newUser } : (newUser as User),
      isAuthenticated: true,
    })),

  clearIsAuthenticated: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

export default useAuthStore;
