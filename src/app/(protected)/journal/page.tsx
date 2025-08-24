'use client';

import TablePositions from '@/features/positions/components/PositionsContainer';
import { AnimatedDiv } from '@/components/ui/animations';

export default function JournalPage() {
  return (
    <AnimatedDiv variant="slideUp" className="container py-6">
      <TablePositions />
    </AnimatedDiv>
  );
}
