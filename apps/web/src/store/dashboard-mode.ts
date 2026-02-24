import { create } from 'zustand';

export type DashboardMode = 'crypto' | 'finance';

interface DashboardModeState {
  mode: DashboardMode;
  setMode: (mode: DashboardMode) => void;
}

const getSavedMode = (): DashboardMode => {
  if (typeof window === 'undefined') return 'finance';

  try {
    const saved = localStorage.getItem('dashboard-mode');
    return saved === 'finance' || saved === 'crypto' ? saved : 'finance';
  } catch {
    return 'finance';
  }
};

const saveMode = (mode: DashboardMode) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('dashboard-mode', mode);
  } catch (error) {
    console.warn('Failed to save mode to localStorage:', error);
  }
};

export const useDashboardMode = create<DashboardModeState>(set => ({
  mode: getSavedMode(),
  setMode: (mode: DashboardMode) => {
    saveMode(mode);
    set({ mode });
  },
}));
