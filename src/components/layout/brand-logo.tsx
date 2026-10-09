import Image from "next/image";
import Link from "next/link";

export function BrandLogo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const isLight = tone === "light";

  return (
    <Link
      href="/"
      aria-label="Lotus Lights"
      className="group inline-flex items-center gap-2"
    >
      <span className="relative grid size-11 shrink-0 place-items-center sm:size-12">
        <span
          aria-hidden="true"
          className={`absolute -inset-1 rounded-full blur-md transition-opacity duration-300 group-hover:opacity-100 ${
            isLight
              ? "bg-[radial-gradient(circle,rgba(212,240,74,0.7),transparent_68%)] opacity-80"
              : "bg-[radial-gradient(circle,rgba(186,224,48,0.7),transparent_68%)] opacity-60"
          }`}
        />
        <Image
          src="/images/logo/logo.png"
          alt=""
          width={1375}
          height={1144}
          priority={!isLight}
          className="relative h-10 w-auto sm:h-11"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`text-[17px] font-bold tracking-[-0.03em] sm:text-[19px] ${
            isLight ? "text-white" : "text-neutral-950"
          }`}
        >
          Lotus
        </span>
        <span className="mt-1.5 flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={`h-px w-3.5 shrink-0 ${
              isLight
                ? "bg-gradient-to-r from-white/80 to-[#e4ff6a]"
                : "bg-gradient-to-r from-[#4f7d0c] to-[#c6ee4a]"
            }`}
          />
          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px] ${
              isLight ? "text-[#e4ff6a]" : "text-[#5f8c14]"
            }`}
          >
            Lights
          </span>
        </span>
      </span>
    </Link>
  );
}
