"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex size-9 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
      aria-label={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-9 shrink-0"
        aria-hidden
      >
        <path
          d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"
          fill="#B68973"
          fillOpacity="0.14"
        />
        <g clipPath="url(#clip0_4566_1431)">
          {isDark ? (
            <g transform="translate(10 10) scale(0.8333333333333334)">
              <path
                d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
                stroke="#B68973"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          ) : (
            <path
              d="M20.0003 11.6667V13.3333M20.0003 26.6667V28.3333M13.3337 20H11.667M15.2621 15.2618L14.0836 14.0833M24.7386 15.2618L25.9171 14.0833M15.2621 24.7417L14.0836 25.9202M24.7386 24.7417L25.9171 25.9202M28.3337 20H26.667M24.167 20C24.167 22.3012 22.3015 24.1667 20.0003 24.1667C17.6991 24.1667 15.8337 22.3012 15.8337 20C15.8337 17.6988 17.6991 15.8333 20.0003 15.8333C22.3015 15.8333 24.167 17.6988 24.167 20Z"
              stroke="#B68973"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </g>
        <defs>
          <clipPath id="clip0_4566_1431">
            <rect
              width="20"
              height="20"
              fill="white"
              transform="translate(10 10)"
            />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
}
