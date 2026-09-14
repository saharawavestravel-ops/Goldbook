import { apiOk, requireApiUser } from "@/lib/api";
import { getMarketSnapshot } from "@/lib/market";

export async function GET() {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;

  const snapshot = await getMarketSnapshot();
  return apiOk(snapshot, {
    sample: snapshot.sample,
    source: snapshot.source,
    asOf: snapshot.asOf,
    dataAsOf: snapshot.dataAsOf,
    cacheTtlSec: snapshot.cacheTtlSec,
  });
}
