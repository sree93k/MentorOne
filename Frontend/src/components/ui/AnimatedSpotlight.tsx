// src/components/ui/AnimatedSpotlight.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedSpotlightProps {
  className?: string;
  fill?: string;
}

export const AnimatedSpotlight: React.FC<AnimatedSpotlightProps> = ({
  className,
  fill = "white",
}) => {
  return (
    <div
      className={cn(
        "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] opacity-0 lg:w-[84%]",
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="spotlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={fill} stopOpacity="0.3" />
            <stop offset="50%" stopColor={fill} stopOpacity="0.1" />
            <stop offset="100%" stopColor={fill} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          cx="50"
          cy="50"
          rx="50"
          ry="50"
          fill="url(#spotlight)"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};
