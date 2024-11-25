import { create } from 'zustand';
import { User, NewUser } from '../types/user';

interface UserStore {
  user: User | null;
  setUser: (user: NewUser) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (newUser: NewUser) => {
    const user: User = {
      ...newUser,
      id: crypto.randomUUID()
    };
    set({ user });
  },
  clearUser: () => set({ user: null })
})); 

