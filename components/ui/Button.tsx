import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'ghost', size = 'md', ...props }, ref) => {
    const variantClass =
      variant === 'primary' ? 'btn-primary' : variant === 'danger' ? 'btn-danger' : 'btn-ghost';
    const sizeClass = size === 'sm' ? 'text-sm px-3 py-1.5 min-h-9' : '';
    return (
      <button
        ref={ref}
        className={cn('btn', variantClass, sizeClass, className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
