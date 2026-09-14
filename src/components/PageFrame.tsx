export function PageFrame({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="gb-page gb-lift flex flex-1 flex-col py-6 sm:py-8 lg:py-12">
      <p className="gb-eyebrow">{eyebrow}</p>
      <h1 className="gb-display mt-2.5 text-4xl text-gb-ink sm:text-[2.75rem]">{title}</h1>
      <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-gb-muted sm:text-base">
        {description}
      </p>
      {children ? (
        <div
          className="gb-fade-in mt-8 flex flex-1 flex-col sm:mt-9"
          style={{ animationDelay: "80ms" }}
        >
          {children}
        </div>
      ) : null}
    </main>
  );
}
