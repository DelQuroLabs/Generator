'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          background: '#08080c',
          color: '#f3f3f8',
          fontFamily: 'system-ui, sans-serif',
          margin: 0,
        }}
      >
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>A critical error occurred</h1>
          <p style={{ color: '#a4a4b8', maxWidth: 420 }}>
            The application hit an unrecoverable error. Please reload.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              padding: '10px 18px',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
