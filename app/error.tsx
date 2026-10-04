'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertTriangle size={40} className="text-danger" />
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted">
        An unexpected error occurred while rendering. Your criteria are saved locally; you can retry safely.
      </p>
      <button
        type="button"
        onClick={reset}
        className="btn btn-primary"
      >
        <RotateCw size={16} /> Try again
      </button>
    </div>
  );
}
