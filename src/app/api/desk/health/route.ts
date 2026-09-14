import { apiOk, requireApiUser } from "@/lib/api";
import { getIntegrationStatus } from "@/lib/env";
import { validateEnv, envIsReadyForProduction } from "@/lib/env-validate";
import { getPersistDriver, isDurablePersistReady } from "@/lib/persist";

/** Non-secret security / env readiness for signed-in users. */
export async function GET() {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;

  const issues = validateEnv({ production: process.env.NODE_ENV === "production" });

  return apiOk({
    productionReady: envIsReadyForProduction(),
    persist: {
      driver: getPersistDriver(),
      durable: isDurablePersistReady(),
    },
    issues: issues.map((issue) => ({
      level: issue.level,
      code: issue.code,
      message: issue.message,
    })),
    integrations: getIntegrationStatus(),
  });
}
