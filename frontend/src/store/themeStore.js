import { create } from 'zustand';

const useThemeStore = create((set) => ({
  theme: 'light',
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  fetchTheme: () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    set({ theme: savedTheme });
  }
}));

export default useThemeStore;