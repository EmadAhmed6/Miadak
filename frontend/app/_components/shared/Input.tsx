"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  placeholder?: string;
}
const Input = ({
  type = "text",
  label,
  error,
  placeholder,
  className = "",
  id,
  ref,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-textPrimary text-start"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={`w-full rounded-lg border px-3.5 py-4 text-sm text-textPrimary transition-colors outline-none placeholder:text-textSecondary/60 ${
            isPassword ? "pe-10" : ""
          } ${
            error
              ? "border-statusDanger bg-statusDanger/5 focus:border-statusDanger"
              : "border-borderPrimary bg-bgSecondary focus:border-borderFocus"
          } ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
            }
            className="absolute inset-y-0 end-3 flex items-center text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-statusDanger text-start">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
