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
          width={56}
          height={56}
          sizes="56px"
          priority
          className={`h-9 sm:h-11 md:h-12 w-9 sm:w-11 md:w-12 aspect-square object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-105 ${imgClassName}`}
        />
      </div>

      {/* Brand Text */}
      <span className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#0B2D52] tracking-tight leading-tight group-hover:text-teal-700 transition-colors whitespace-nowrap">
        Sugamya Shiksha Bihar
      </span>
    </Link>
  );
}

