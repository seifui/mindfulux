"use client";

import { useCallback, useState } from "react";

export type SearchBarProps = {
  onSearch?: (query: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");

  const submit = useCallback(() => {
    onSearch?.(value);
    setValue("");
  }, [value, onSearch]);

  return (
    <div className="mx-auto w-full max-w-[586px] px-4 md:px-0">
      <div
        className="relative h-[60px] w-full rounded-[30px] bg-[rgba(31,53,97,0.04)]"
        role="search"
      >
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask or search for anything."
          aria-label="Search"
          className="font-sans absolute inset-y-0 left-0 right-0 z-0 h-full w-full rounded-[30px] border-0 bg-transparent pl-6 pr-[50px] text-base text-[#061A40] outline-none ring-0 placeholder:text-[rgba(6,26,64,0.6)] focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
        />
        <button
          type="button"
          aria-label="Submit search"
          onClick={submit}
          className="absolute right-[10px] top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#B68973] p-0 transition-opacity hover:opacity-90"
        >
          <svg
            width="40"
            height="40"
            viewBox="534 10 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M560 36L557.667 33.6667M559.333 29.6667C559.333 32.7963 556.796 35.3333 553.667 35.3333C550.537 35.3333 548 32.7963 548 29.6667C548 26.5371 550.537 24 553.667 24C556.796 24 559.333 26.5371 559.333 29.6667Z"
              stroke="white"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
