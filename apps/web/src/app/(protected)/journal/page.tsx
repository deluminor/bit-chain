'use client';

import { AnimatedDiv } from '@/components/ui/animations';
import TablePositions from '@/features/positions/components/PositionsContainer';

export default function JournalPage() {
  return (
    <AnimatedDiv variant="slideUp" className="container py-6">
      <TablePositions />
    </AnimatedDiv>
  );
}
