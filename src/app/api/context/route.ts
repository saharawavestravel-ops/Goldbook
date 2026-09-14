import { apiOk, requireApiUser } from "@/lib/api";
import { getContextSnapshot } from "@/lib/context";

export async function GET() {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;

  const snapshot = await getContextSnapshot();
  return apiOk(snapshot, {
    macro: {
      sample: snapshot.macro.sample,
      source: snapshot.macro.source,
      asOf: snapshot.macro.asOf,
      dataAsOf: snapshot.macro.dataAsOf,
    },
    news: {
      sample: snapshot.news.sample,
      source: snapshot.news.source,
      asOf: snapshot.news.asOf,
      dataAsOf: snapshot.news.dataAsOf,
    },
  });
}
