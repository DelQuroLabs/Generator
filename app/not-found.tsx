import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="font-mono text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="max-w-md text-sm text-muted">
        That route doesn&apos;t exist. Head back to the generator.
      </p>
      <Link
        href="/"
        className="btn btn-primary"
      >
        Back to DelQuro
      </Link>
    </div>
  );
}
