export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { assertEnv } = await import("@/lib/env-validate");
  // Log issues at boot; never crash the build. APIs enforce AUTH_SECRET themselves.
  assertEnv({
    production: process.env.NODE_ENV === "production",
    hard: false,
  });
}
