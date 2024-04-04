import { create } from 'zustand'
import { persist } from 'zustand/middleware'
interface AuthState {
  isAuth: boolean
  toggleAuth: () => void
  user: string
  setUser: (loggedUser: string) => void
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isAuth: false,
      user: '',
      toggleAuth: () => set((state) => ({ isAuth: !state.isAuth })),
      setUser: (loggedUser) => set(() => ({ user: loggedUser })),
    }),
    {
      name: 'auth',
    }
  )
)
