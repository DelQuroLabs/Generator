/** @type {import('next').NextConfig} */
// Content-Security-Policy for a fully-offline, local-first app.
// - 'unsafe-inline' on script-src is required by the pre-hydration theme script
//   in app/layout.tsx (prevents light/dark flash); documented in docs/charter.md.
// - 'unsafe-inline' on style-src covers Next.js's inlined critical CSS.
// - connect-src 'self' permits only same-origin requests; the app makes no
//   outbound calls (verified by SEC-001 client-bundle scan).
// - frame-ancestors permits the Arena preview host (*.e2b.app) and self.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'self' https://*.e2b.app https://arena.ai https://*.arena.ai",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join('; ');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ['*.e2b.app'],
  experimental: {
    serverActions: {
      allowedOrigins: ['*.e2b.app', 'localhost:3000', '0.0.0.0:3000'],
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()' },
          { key: 'Content-Security-Policy', value: CSP },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          // HSTS is only honored over HTTPS; harmless over HTTP, meaningful once
          // the app is served over a TLS-terminated hosting origin.
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ];
  },
};

export default nextConfig;
