import { create } from "zustand";
import { UserType } from "../types";

interface UserStore {
  user: UserType;
  updateUser: (newUser: UserType) => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: {} as UserType,
  updateUser: (newUser: UserType) => set({ user: newUser }),
}));
