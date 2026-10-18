import React from "react";
import Link from "next/link";
import Image from "next/image";

interface SugamyaLogoProps {
  compact?: boolean;
  className?: string;
  imgClassName?: string;
}

export function SugamyaLogo({ compact = false, className = "", imgClassName = "" }: SugamyaLogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg p-1 transition-all min-w-0 ${className}`}
      aria-label="Sugamya Shiksha Bihar — Home"
    >
      {/* Official Emblem Logo */}
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Sugamya Shiksha Bihar Emblem"
          width={104}
          height={77}
          sizes="104px"
          priority
          className={`h-8 sm:h-10 md:h-12 w-auto max-w-none object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-105 ${imgClassName}`}
        />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col text-left min-w-0">
        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#0B2D52] tracking-tight leading-tight group-hover:text-teal-700 transition-colors truncate">
          Sugamya Shiksha Bihar
        </span>
        {!compact && (
          <span className="hidden md:block text-[11px] sm:text-xs text-slate-500 font-medium leading-tight tracking-normal truncate">
            NCPEDP Fellowship Research Project • Danapur
          </span>
        )}
      </div>
    </Link>
  );
}

