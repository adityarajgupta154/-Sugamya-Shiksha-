import React from "react";
import { clsx } from "clsx";
import { CheckCircle2, Clock, AlertTriangle, Building2, ShieldCheck, XCircle, Award } from "lucide-react";

export type BadgeVariant =
  | "audited"
  | "pending"
  | "follow_up_required"
  | "government"
  | "private"
  | "verified"
  | "rejected"
  | "primary_reference"
  | "default";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children?: React.ReactNode;
}

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  const getBadgeConfig = () => {
    switch (variant) {
      case "audited":
      case "verified":
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
          styles: "bg-emerald-50 text-emerald-800 border-emerald-300",
        };
      case "pending":
        return {
          icon: <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
          styles: "bg-amber-50 text-amber-800 border-amber-300",
        };
      case "follow_up_required":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
          styles: "bg-red-50 text-red-800 border-red-300",
        };
      case "government":
        return {
          icon: <Building2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
          styles: "bg-navy-50 text-navy-800 border-navy-200",
        };
      case "private":
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
          styles: "bg-purple-50 text-purple-800 border-purple-200",
        };
      case "rejected":
        return {
          icon: <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
          styles: "bg-red-50 text-red-800 border-red-300",
        };
      case "primary_reference":
        return {
          icon: <Award className="w-3.5 h-3.5 shrink-0 text-amber-600" aria-hidden="true" />,
          styles: "bg-amber-50 text-amber-900 border-amber-400 font-bold",
        };
      default:
        return {
          icon: null,
          styles: "bg-slate-100 text-slate-800 border-slate-200",
        };
    }
  };

  const { icon, styles } = getBadgeConfig();

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border select-none",
        styles,
        className
      )}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}
