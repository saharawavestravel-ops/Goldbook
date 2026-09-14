import { TodayHome } from "@/components/TodayHome";
import { getLocale } from "@/lib/i18n/server";
import { getTodayPreviewAsync } from "@/lib/today";

export default async function TodayPage() {
  const locale = await getLocale();
  const preview = await getTodayPreviewAsync(locale);
  return <TodayHome preview={preview} />;
}
