// src/components/ui/PlaceholdersAndVanishInput.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface PlaceholdersAndVanishInputProps {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export const PlaceholdersAndVanishInput: React.FC<
  PlaceholdersAndVanishInputProps
> = ({ placeholders, onChange, onSubmit, className }) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  }, [placeholders.length]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAnimating(true);

    // Simulate search animation
    setTimeout(() => {
      setAnimating(false);
    }, 1000);

    onSubmit(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e);
  };

  useEffect(() => {
    startAnimation();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startAnimation]);

  return (
    <form
      className={cn(
        "relative w-full mx-auto bg-white/10 backdrop-blur-lg h-16 rounded-2xl overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-all duration-200 border border-white/20",
        className
      )}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className={cn(
          "w-full h-full pl-6 pr-16 bg-transparent border-none outline-none text-white placeholder-white/60 text-lg font-medium",
          animating && "animate-pulse"
        )}
        placeholder={placeholders[currentPlaceholder]}
      />
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white p-2 rounded-xl transition-all duration-200 shadow-lg"
        type="submit"
        disabled={animating}
      >
        <Search className={cn("w-5 h-5", animating && "animate-spin")} />
      </button>
    </form>
  );
};
