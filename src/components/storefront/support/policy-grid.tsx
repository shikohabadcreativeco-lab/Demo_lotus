import type { ReactNode } from "react";

export function PolicyGrid({
  sections,
}: {
  sections: { title: string; body: string; icon: ReactNode }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sections.map((section, index) => (
        <section
          key={section.title}
          className={`rounded-3xl border border-[#ece4d6] bg-white p-6 shadow-[0_18px_40px_rgba(28,25,23,0.05)] ${
            index === sections.length - 1 && sections.length % 2 === 1 ? "md:col-span-2" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#f3eee6] text-[#c6a15a]">
              {section.icon}
            </span>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-[#c6a15a]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950">{section.title}</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-neutral-500">{section.body}</p>
        </section>
      ))}
    </div>
  );
}
