import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300",
    success: "bg-success hover:bg-success/90 text-white shadow-sm hover:shadow-md",
    warning: "bg-warning hover:bg-warning/90 text-white shadow-sm hover:shadow-md",
    error: "bg-error hover:bg-error/90 text-white shadow-sm hover:shadow-md",
    ghost: "hover:bg-gray-100 text-gray-700 border border-transparent hover:border-gray-200",
    gradient: "bg-gradient-to-r from-primary to-info hover:from-primary/90 hover:to-info/90 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 h-8",
    default: "text-sm px-4 py-2 h-10",
    lg: "text-base px-6 py-3 h-12"
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;