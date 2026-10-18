import React from "react";
import { clsx } from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "article" | "section";
  variant?: "default" | "elevated" | "bordered" | "interactive";
}

export function Card({
  as: Component = "div",
  variant = "default",
  className,
  children,
  ...props
}: CardProps) {
  const baseStyles = "rounded-lg p-6 bg-white transition-[border-color,box-shadow,background-color] duration-150 ease-out";

  const variantStyles = {
    default: "border border-slate-200 shadow-sm",
    elevated: "border border-slate-200 shadow-md",
    bordered: "border-2 border-navy-700/20 shadow-none",
    interactive:
      "border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600 cursor-pointer",
  };

  return (
    <Component
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("mb-4 space-y-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  as: Component = "h3",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "h4" | "h5" }) {
  return (
    <Component
      className={clsx("text-xl font-bold tracking-tight text-navy-800", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={clsx("text-sm text-slate-600", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("text-base text-slate-700", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("mt-6 flex items-center pt-4 border-t border-slate-100", className)} {...props}>
      {children}
    </div>
  );
}
