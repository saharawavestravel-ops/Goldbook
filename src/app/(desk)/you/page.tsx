import { PageFrame } from "@/components/PageFrame";
import { YouProfile } from "@/components/YouProfile";
import { requireSessionUser } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";
import { getPersistDriver, isDurablePersistReady } from "@/lib/persist";
import { localizeUser } from "@/lib/users";
import { getUserMeta } from "@/lib/users-store";

export default async function YouPage() {
  const user = await requireSessionUser();
  const meta = await getUserMeta(user.id);
  const persistDriver = getPersistDriver();
  const { locale, dict } = await getI18n();

  return (
    <PageFrame eyebrow={dict.you.eyebrow} title={user.name} description={dict.you.description}>
      <YouProfile
        user={localizeUser(user, locale)}
        meta={meta}
        persist={{
          driver: persistDriver,
          durable: isDurablePersistReady(),
        }}
      />
    </PageFrame>
  );
}
