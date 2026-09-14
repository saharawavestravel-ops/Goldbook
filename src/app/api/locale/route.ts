import { NextResponse } from "next/server";
import {
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/i18n/locales";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { locale?: string } | null;
  if (!body?.locale || !isLocale(body.locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const locale: Locale = body.locale;
  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
