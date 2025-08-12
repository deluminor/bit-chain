import { BackupManager } from '@/components/backup/BackupManager';
import { AnimatedDiv } from '@/components/ui/animations';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Database Backup | BitChain',
  description: 'Backup and restore your trading data',
};

export default function BackupPage() {
  return (
    <AnimatedDiv variant="slideUp" className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Database Backup</h1>
        <p className="text-muted-foreground">Manage backups of your trading journal data</p>
      </div>

      <BackupManager />
    </AnimatedDiv>
  );
}
