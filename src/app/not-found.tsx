import Link from "next/link";
import { Disclaimer } from "@/components/StatePanels";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
      <p className="gb-eyebrow">Goldbook</p>
      <h1 className="gb-display mt-3 text-4xl text-gb-ink">Page not found</h1>
      <p className="mt-3 text-base text-gb-muted">
        This route isn’t part of the desk.
      </p>
      <Link href="/" className="gb-btn gb-btn-primary mt-8 w-full">
        Enter desk
      </Link>
      <Disclaimer className="mt-10 text-center" />
    </main>
  );
}
