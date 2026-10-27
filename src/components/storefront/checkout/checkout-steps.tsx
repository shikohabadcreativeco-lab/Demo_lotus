const steps = ["Cart", "Checkout", "Confirmation"];

export function CheckoutSteps({ current }: { current: number }) {
  return (
    <ol className="flex items-center" aria-label="Checkout progress">
      {steps.map((label, index) => {
        const complete = index < current;
        const active = index === current;
        const reached = complete || active;
        return (
          <li key={label} className="flex min-w-0 flex-1 items-center">
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                reached ? "bg-[#c6a15a] text-white" : "bg-white text-neutral-400 ring-1 ring-[#e6dccb]"
              }`}
            >
              {complete ? "✓" : index + 1}
            </span>
            <span
              className={`ml-2 truncate text-xs font-medium sm:text-sm ${
                active ? "text-neutral-950" : reached ? "text-neutral-700" : "text-neutral-400"
              }`}
            >
              {label}
            </span>
            {index < steps.length - 1 ? (
              <span className={`mx-2 h-px min-w-3 flex-1 sm:mx-3 ${complete ? "bg-[#c6a15a]" : "bg-[#e6dccb]"}`} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
