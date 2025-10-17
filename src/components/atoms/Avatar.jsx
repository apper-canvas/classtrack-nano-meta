import React from "react";
import { cn } from "@/utils/cn";

const Avatar = ({ src, alt, className, fallback, size = "default" }) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    default: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg"
  };

  const initials = alt ? alt.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "??";

  return (
    <div className={cn("relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-info/20 font-medium text-primary border-2 border-white shadow-sm", sizes[size], className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{fallback || initials}</span>
      )}
    </div>
  );
};

export default Avatar;