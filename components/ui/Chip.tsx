'use client';

import { cn } from '@/lib/utils';

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Chip({ active, onClick, children, title, className }: ChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={active}
      title={title}
      data-active={active}
      onClick={onClick}
      className={cn('chip', className)}
    >
      {children}
    </button>
  );
}
