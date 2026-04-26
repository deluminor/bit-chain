import { BackupManager } from '@/components/backup/BackupManager';
import { AnimatedDiv } from '@/components/ui/animations';
import { Download } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Database Backup | BitChain',
  description: 'Backup and restore your trading data',
};

export default function BackupPage() {
  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary shadow-sm">
            <Download className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Database Backup</h1>
            <p className="text-muted-foreground">Manage backups of your trading journal data</p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <BackupManager />
      </div>
    </AnimatedDiv>
  );
}
