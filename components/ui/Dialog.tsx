'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  role?: 'dialog' | 'alertdialog';
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  role = 'dialog',
  initialFocusRef,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    const focusTarget = initialFocusRef?.current ?? dialogRef.current;
    focusTarget?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        // simple focus trap
        const root = dialogRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose, initialFocusRef]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4"
      role={role}
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? 'dialog-desc' : undefined}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="card relative z-10 w-full rounded-b-none rounded-t-2xl p-5 pb-[max(env(safe-area-inset-bottom,0px),1.25rem)] shadow-2xl outline-none sm:max-w-md sm:rounded-2xl sm:p-6 sm:pb-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="dialog-title" className="text-lg font-semibold text-fg">
              {title}
            </h2>
            {description && (
              <p id="dialog-desc" className="mt-1 text-sm text-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="icon-btn"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
