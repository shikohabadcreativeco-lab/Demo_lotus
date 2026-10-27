"use client";

import { useEffect, useState } from "react";

export function SearchQueryField({ query }: { query: string }) {
  const [value, setValue] = useState(query);

  useEffect(() => {
    setValue(query);
    const timer = window.setTimeout(() => setValue(query), 0);
    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <input
      name="q"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder="Table lamp, brass, bedroom"
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      enterKeyHint="search"
      aria-label="Search"
      className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-neutral-400"
    />
  );
}
