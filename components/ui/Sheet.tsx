'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Right-side header slot (e.g. a reset button) */
  headerAction?: ReactNode;
  labelId?: string;
}

/**
 * Mobile-first bottom sheet: full-width sheet anchored to the bottom edge on
 * phones, centered panel from lg up. Handles Escape, backdrop tap, body scroll
 * lock, focus restore and a simple focus trap.
 */
export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  headerAction,
  labelId = 'sheet-title',
}: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const root = panelRef.current;
        if (!root) return;
        const focusables = Array.from(
          root.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => el.offsetParent !== null || el === document.activeElement);
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
  }, [open, onClose]);

  // Swipe-down-to-dismiss on the grabber/header area
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchStartY.current;
      const end = e.changedTouches[0]?.clientY ?? null;
      touchStartY.current = null;
      if (start !== null && end !== null && end - start > 70) onClose();
    },
    [onClose],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
    >
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="sheet-panel relative z-10 w-full outline-none lg:max-w-2xl"
      >
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="sheet-grabber lg:hidden" aria-hidden="true" />
          <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-3 sm:px-5">
            <div className="min-w-0">
              <h2 id={labelId} className="text-base font-semibold tracking-tight sm:text-lg">
                {title}
              </h2>
              {description && <p className="mt-0.5 text-xs text-muted sm:text-sm">{description}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {headerAction}
              <button type="button" onClick={onClose} aria-label="Close" className="icon-btn">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="sheet-scroll flex-1 px-4 pb-4 sm:px-5">{children}</div>

        {footer && (
          <div
            className="border-t border-border bg-surface/95 px-4 pt-3 sm:px-5"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.75rem)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
