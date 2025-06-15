import React from "react";

interface GradientBackgroundTextProps {
  children: React.ReactNode;
  className?: string;
}

const GradientBackgroundText: React.FC<GradientBackgroundTextProps> = ({
  children,
  className,
}) => {
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-white animate-gradient ${className}`}
      style={{
        backgroundSize: "200% 100%",
        backgroundImage:
          "linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
      }}
    >
      {children}
      <style>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </span>
  );
};

export default GradientBackgroundText;
