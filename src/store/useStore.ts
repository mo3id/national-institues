import { create } from 'zustand';

interface GlobalState {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    // you can add more global UI state here like sidebar open state, etc.
}

export const useStore = create<GlobalState>((set) => ({
    theme: 'light',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
