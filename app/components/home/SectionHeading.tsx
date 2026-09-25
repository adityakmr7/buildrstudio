export default function SectionHeading({
  index,
  kicker,
  title,
  id,
  children,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  id: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="eyebrow">
        <span className="text-faint">{index}</span> / {kicker}
      </p>
      <h2 id={id} className="display text-[clamp(32px,4.4vw,56px)] leading-[1.02]">
        {title}
      </h2>
      {children && <div className="body-copy text-base leading-[1.65]">{children}</div>}
    </div>
  );
}
