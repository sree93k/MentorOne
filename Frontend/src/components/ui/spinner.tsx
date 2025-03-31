import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export function Spinner({ size = 24, color, className }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      color={color}
      className={cn("animate-spin", className)}
    />
  );
}
