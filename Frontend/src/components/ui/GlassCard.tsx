// src/components/ui/GlassCard.tsx

import React from "react";
import { Card, CardContent } from "@/components/ui/card"; // Assuming you use shadcn/ui Card

// Define the component's props interface
interface GlassCardProps {
  children: React.ReactNode;
  className?: string; // Optional className prop
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Card
      className={`relative bg-white/50 backdrop-blur-xl border border-white/[0.2] rounded-3xl shadow-lg transition-all duration-300 ${className}`}
      {...props}
    >
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
};

export { GlassCard };
