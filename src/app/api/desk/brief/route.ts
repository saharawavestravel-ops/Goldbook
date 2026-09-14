import { apiOk, requireApiUser } from "@/lib/api";
import { getDailyBrief } from "@/lib/brief";
import { loadDailyBrief } from "@/lib/brief-store";
import { getLocale } from "@/lib/i18n/server";

export async function GET() {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;

  const locale = await getLocale();
  const stored = await loadDailyBrief(undefined, locale);
  const brief = stored ?? (await getDailyBrief({ preferStored: false, locale }));
  return apiOk({
    persisted: Boolean(stored),
    brief,
  });
}
