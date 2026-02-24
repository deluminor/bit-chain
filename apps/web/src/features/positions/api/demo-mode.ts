import axiosInstance from '@/lib/axios';

export type DemoModeAction = 'add' | 'remove';

export async function toggleDemoMode(action: DemoModeAction): Promise<void> {
  await axiosInstance.post('/demo-mode', { action });
}
