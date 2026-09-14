import { AppShell } from "@/components/AppShell";
import { requireSessionUser } from "@/lib/auth";

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  await requireSessionUser();
  return <AppShell>{children}</AppShell>;
}
