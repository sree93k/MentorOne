// import React from "react";

// interface GradientBackgroundTextProps {
//   children: React.ReactNode;
//   className?: string;
// }

// const GradientBackgroundText: React.FC<GradientBackgroundTextProps> = ({
//   children,
//   className,
// }) => {
//   return (
//     <span
//       className={`inline-block px-2 py-1 rounded-full text-white animate-gradient ${className}`}
//       style={{
//         backgroundSize: "200% 100%",
//         backgroundImage:
//           "linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
//       }}
//     >
//       {children}
//       <style>{`
//         @keyframes gradient {
//           0% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//           100% {
//             background-position: 0% 50%;
//           }
//         }
//         .animate-gradient {
//           animation: gradient 3s linear infinite;
//         }
//       `}</style>
//     </span>
//   );
// };

// export default GradientBackgroundText;
import React from "react";

interface GradientBackgroundTextProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "button" | "text";
}

const GradientBackgroundText: React.FC<GradientBackgroundTextProps> = ({
  children,
  className = "",
  onClick,
  size = "md",
  variant = "button",
}) => {
  // Size classes for responsive design
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs sm:text-sm rounded-md",
    md: "px-4 py-2 text-sm sm:text-base rounded-lg",
    lg: "px-6 py-3 text-base sm:text-lg rounded-xl",
    xl: "px-8 py-4 text-lg sm:text-xl rounded-2xl",
  };

  // Base classes
  const baseClasses = `
    inline-block text-white font-semibold transition-all duration-300 
    hover:scale-105 active:scale-95 cursor-pointer select-none
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    ${sizeClasses[size]}
  `;

  // Combine classes
  const combinedClasses = `${baseClasses} ${className}`.trim();

  const gradientStyle = {
    backgroundSize: "200% 100%",
    backgroundImage:
      "linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
    backgroundClip: variant === "text" ? "text" : undefined,
    WebkitBackgroundClip: variant === "text" ? "text" : undefined,
    color: variant === "text" ? "transparent" : "white",
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  if (variant === "button") {
    return (
      <>
        <button
          className={`${combinedClasses} animate-gradient`}
          style={gradientStyle}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={
            typeof children === "string" ? children : "Gradient button"
          }
        >
          {children}
        </button>
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
          
          /* Responsive hover effects */
          @media (hover: hover) and (pointer: fine) {
            .animate-gradient:hover {
              animation-duration: 1.5s;
              box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
            }
          }
          
          /* Touch device optimizations */
          @media (hover: none) and (pointer: coarse) {
            .animate-gradient:active {
              animation-duration: 1s;
              transform: scale(0.98);
            }
          }
          
          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .animate-gradient {
              border: 2px solid currentColor;
            }
          }
          
          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            .animate-gradient {
              animation: none;
              background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            }
          }
          
          /* Dark mode optimizations */
          @media (prefers-color-scheme: dark) {
            .animate-gradient {
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
          }
          
          /* Print styles */
          @media print {
            .animate-gradient {
              background: #3b82f6 !important;
              color: white !important;
              animation: none !important;
            }
          }
        `}</style>
      </>
    );
  }

  // Text variant
  return (
    <>
      <span
        className={`${combinedClasses} animate-gradient`}
        style={gradientStyle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? "button" : undefined}
      >
        {children}
      </span>
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
        
        /* Responsive optimizations for text variant */
        @media (max-width: 640px) {
          .animate-gradient {
            word-break: break-word;
            hyphens: auto;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .animate-gradient {
            background: linear-gradient(45deg, #000, #333) !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-gradient {
            animation: none;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            background-clip: text;
          }
        }
        
        /* Print styles */
        @media print {
          .animate-gradient {
            background: #000 !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default GradientBackgroundText;
