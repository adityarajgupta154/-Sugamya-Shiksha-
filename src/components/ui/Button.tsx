"use client";

import React, { forwardRef } from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variantStyles = {
      primary:
        "bg-navy-800 text-white hover:bg-navy-900 focus-visible:ring-teal-600 shadow-sm border border-navy-700",
      secondary:
        "bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-600 shadow-sm border border-teal-600",
      accent:
        "bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500 shadow-sm border border-amber-600",
      outline:
        "bg-transparent text-navy-800 border-2 border-navy-700 hover:bg-navy-50 focus-visible:ring-navy-600",
      ghost:
        "bg-transparent text-navy-800 hover:bg-slate-100 focus-visible:ring-teal-600",
      danger:
        "bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-500 shadow-sm border border-red-800",
    };

    const sizeStyles = {
      sm: "text-sm px-3 py-1.5 gap-1.5 min-h-[36px]",
      md: "text-base px-4 py-2 gap-2 min-h-[44px]", // WCAG minimum 44px touch target
      lg: "text-lg px-6 py-3 gap-2.5 min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
            aria-hidden="true"
          />
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0" aria-hidden="true">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0" aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
