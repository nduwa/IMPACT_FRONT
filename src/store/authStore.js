import { create } from 'zustand';

const initialToken = sessionStorage.getItem('token');
const initialUser = JSON.parse(sessionStorage.getItem('user'));

export const useAuthStore = create((set) => ({
  token: initialToken,
  user: initialUser,
  setAuth: ({ token, user }) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    sessionStorage.clear();
    set({ token: null, user: null });
  }
}));