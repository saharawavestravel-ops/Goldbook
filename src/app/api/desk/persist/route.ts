import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getPersistDriver, isDurablePersistReady } from "@/lib/persist";
import { listBriefDates } from "@/lib/brief-store";
import { listStoredScores } from "@/lib/scores-store";
import { listUserMetas } from "@/lib/users-store";

/** Non-secret persistence health for the signed-in desk. */
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const [briefDates, scores, users] = await Promise.all([
    listBriefDates(),
    listStoredScores(),
    listUserMetas(),
  ]);

  return NextResponse.json({
    ok: true,
    driver: getPersistDriver(),
    durable: isDurablePersistReady(),
    counts: {
      briefs: briefDates.length,
      scores: scores.length,
      users: users.length,
    },
  });
}
