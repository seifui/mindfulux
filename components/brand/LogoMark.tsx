import { cn } from "@/lib/utils";

type LogoMarkProps = {
  className?: string;
};

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-8 shrink-0 md:size-9", className)}
      aria-hidden
    >
      <g clipPath="url(#clip0_4566_1399)">
        <path
          d="M0 10.0428H10.0322L5.01609 -0.000244141L0 10.0428Z"
          fill="#4F4040"
        />
      </g>
      <g clipPath="url(#clip1_4566_1399)">
        <path
          d="M23.2001 -0.000106812H13.168V10.043H23.2001V-0.000106812Z"
          fill="#B68973"
        />
      </g>
      <g clipPath="url(#clip2_4566_1399)">
        <path
          d="M10.0322 13.1793H0V23.2224H10.0322V13.1793Z"
          fill="#B68973"
        />
      </g>
      <g clipPath="url(#clip3_4566_1399)">
        <path
          d="M18.1841 23.2224C20.9544 23.2224 23.2001 20.9742 23.2001 18.2008C23.2001 15.4275 20.9544 13.1793 18.1841 13.1793C15.4137 13.1793 13.168 15.4275 13.168 18.2008C13.168 20.9742 15.4137 23.2224 18.1841 23.2224Z"
          fill="#B68973"
        />
      </g>
      <defs>
        <clipPath id="clip0_4566_1399">
          <rect width="10.0322" height="10.0431" fill="white" />
        </clipPath>
        <clipPath id="clip1_4566_1399">
          <rect
            width="10.0322"
            height="10.0431"
            fill="white"
            transform="translate(13.168)"
          />
        </clipPath>
        <clipPath id="clip2_4566_1399">
          <rect
            width="10.0322"
            height="10.0431"
            fill="white"
            transform="translate(0 13.1787)"
          />
        </clipPath>
        <clipPath id="clip3_4566_1399">
          <rect
            width="10.0322"
            height="10.0431"
            fill="white"
            transform="translate(13.168 13.1787)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
