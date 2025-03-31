// src/common/Container.tsx
import React from "react";

const SimpleContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className || ""}`}
    >
      {children}
    </div>
  );
};

export default SimpleContainer;
