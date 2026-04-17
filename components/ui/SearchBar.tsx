"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { useSearch, type SearchResult } from "@/hooks/use-search";
import { trackSearchPerformed } from "@/lib/analytics";

export type SearchBarProps = {
  onSearch?: (query: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { results, isLoading } = useSearch(value);

  const showDropdown = isOpen && value.trim().length >= 2;

  // Fire PostHog when results arrive for a meaningful query
  useEffect(() => {
    if (!isLoading && value.trim().length >= 2) {
      trackSearchPerformed(value.trim(), results.length);
    }
  }, [results, isLoading, value]);

  // Close on outside click
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setIsOpen(false);
      setValue("");
      router.push(`/principles/${result.slug}`);
    },
    [router],
  );

  const submit = useCallback(() => {
    onSearch?.(value);
    setValue("");
    setIsOpen(false);
  }, [value, onSearch]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[586px] px-4 md:px-0"
    >
      <div
        className="relative h-[60px] w-full rounded-[30px] bg-input-fill"
        role="search"
      >
        <input
          type="search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
            if (e.key === "Escape") {
              setIsOpen(false);
            }
          }}
          onFocus={() => {
            if (value.trim().length >= 2) setIsOpen(true);
          }}
          placeholder="Ask or search for anything."
          aria-label="Search"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          autoComplete="off"
          className="font-sans absolute inset-y-0 left-0 right-0 z-0 h-full w-full rounded-[30px] border-0 bg-transparent pl-6 pr-[50px] text-base text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
        />
        <button
          type="button"
          aria-label="Submit search"
          onClick={submit}
          className="absolute right-[10px] top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary p-0 transition-opacity hover:opacity-90"
        >
          {isLoading ? (
            <Loader2
              className="animate-spin text-white"
              width={20}
              height={20}
              aria-hidden
            />
          ) : (
            <svg
              width="40"
              height="40"
              viewBox="534 10 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
              aria-hidden
            >
              <path
                d="M560 36L557.667 33.6667M559.333 29.6667C559.333 32.7963 556.796 35.3333 553.667 35.3333C550.537 35.3333 548 32.7963 548 29.6667C548 26.5371 550.537 24 553.667 24C556.796 24 559.333 26.5371 559.333 29.6667Z"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          role="listbox"
          aria-label="Search results"
          className="absolute left-0 right-0 top-[68px] z-50 overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-lg"
        >
          {results.length > 0 ? (
            <ul className="divide-y divide-border">
              {results.map((result) => (
                <li key={result.id} role="option" aria-selected={false}>
                  <button
                    type="button"
                    onClick={() => handleSelect(result)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted"
                  >
                    <span className="font-sans text-sm font-semibold text-foreground line-clamp-1">
                      {result.title}
                    </span>
                    <span className="shrink-0 rounded-full bg-muted px-3 py-1 font-sans text-xs font-semibold text-muted-foreground">
                      {result.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            !isLoading && (
              <p className="px-5 py-4 font-sans text-sm text-muted-foreground">
                No principles found for &ldquo;{value.trim()}&rdquo;
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
