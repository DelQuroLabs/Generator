'use client';

import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
  onDone: () => void;
  duration?: number;
}

export function Toast({ message, show, onDone, duration = 1800 }: ToastProps) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [show, onDone, duration]);

  if (!show) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+5.5rem)] left-1/2 z-[70] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full border border-border bg-elevated px-4 py-2 text-center text-sm text-fg shadow-xl lg:bottom-6"
    >
      <span className="inline-flex items-center gap-2">
        <CheckCircle2 size={16} className="text-success" />
        {message}
      </span>
    </div>
  );
}
