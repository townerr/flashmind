import { create } from "zustand";

interface User {
  _id: string;
  username?: string;
  email?: string;
  isAnonymous?: boolean;
  image?: string;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isLoading: false,
};

export const useUserStore = create<UserStore>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  reset: () => set(initialState),
}));
