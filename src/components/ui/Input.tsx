"use client";

import React, { forwardRef, useId } from "react";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  hideLabel?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: customId,
      label,
      error,
      helperText,
      hideLabel = false,
      required,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || `input-${generatedId}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const describedBy = clsx(
      error && errorId,
      helperText && helperId
    ) || undefined;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              "block text-sm font-semibold text-navy-800",
              hideLabel && "sr-only"
            )}
          >
            {label}
            {required && (
              <span className="text-red-600 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={clsx(
              "w-full rounded-md border bg-white px-3.5 py-2.5 text-base text-navy-900 placeholder:text-slate-400 transition-colors duration-150 min-h-[44px]",
              error
                ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                : "border-slate-300 hover:border-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600",
              className
            )}
            {...props}
          />
        </div>

        {helperText && !error && (
          <p id={helperId} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-semibold text-red-700 flex items-center gap-1"
          >
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  hideLabel?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id: customId,
      label,
      error,
      helperText,
      hideLabel = false,
      required,
      className,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = customId || `textarea-${generatedId}`;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    const describedBy = clsx(
      error && errorId,
      helperText && helperId
    ) || undefined;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className={clsx(
              "block text-sm font-semibold text-navy-800",
              hideLabel && "sr-only"
            )}
          >
            {label}
            {required && (
              <span className="text-red-600 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={clsx(
            "w-full rounded-md border bg-white px-3.5 py-2.5 text-base text-navy-900 placeholder:text-slate-400 transition-colors duration-150",
            error
              ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600"
              : "border-slate-300 hover:border-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600",
            className
          )}
          {...props}
        />

        {helperText && !error && (
          <p id={helperId} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-semibold text-red-700 flex items-center gap-1"
          >
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
