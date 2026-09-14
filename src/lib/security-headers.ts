/** Shared security response headers for Goldbook. */
export const securityHeaders: { key: string; value: string }[] = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

export function productionSecurityHeaders() {
  if (process.env.NODE_ENV !== "production") return securityHeaders;
  return [
    ...securityHeaders,
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
  ];
}

export function applySecurityHeaders(headers: Headers) {
  for (const item of productionSecurityHeaders()) {
    headers.set(item.key, item.value);
  }
}
