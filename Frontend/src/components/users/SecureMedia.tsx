import React from "react";
import { useProfilePicture } from "@/hooks/useSecureUrl";

// Profile Picture Component with Enhanced Debugging
interface ProfilePictureProps {
  profilePicture: string | null | undefined;
  userName: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profilePicture,
  userName,
  size = "md",
  className,
}) => {
  console.log("🔍 ProfilePicture Component Debug:");
  console.log("- Raw profilePicture prop:", profilePicture);
  console.log("- userName:", userName);
  console.log("- size:", size);

  const { profilePictureUrl, loading, error } =
    useProfilePicture(profilePicture);

  console.log("🔍 useProfilePicture Hook Results:");
  console.log("- profilePictureUrl:", profilePictureUrl);
  console.log("- loading:", loading);
  console.log("- error:", error);

  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
  };

  const baseClasses = `${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`;
  const finalClasses = className ? `${baseClasses} ${className}` : baseClasses;

  if (loading) {
    console.log("📸 ProfilePicture: Loading state");
    return (
      <div
        className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse border-2 border-gray-200`}
      />
    );
  }

  if (error) {
    console.error("❌ ProfilePicture error:", error);
    console.log("📸 ProfilePicture: Using fallback due to error");
  }

  const finalUrl = profilePictureUrl || "/default-avatar.png";
  console.log("📸 ProfilePicture: Final URL to render:", finalUrl);

  return (
    <img
      src={finalUrl}
      alt={`${userName}'s profile`}
      className={finalClasses}
      onLoad={() => {
        console.log(
          "✅ ProfilePicture: Image loaded successfully from:",
          finalUrl
        );
      }}
      onError={(e) => {
        console.error(
          "💥 ProfilePicture: Image failed to load from:",
          finalUrl
        );
        console.error("💥 Image error event:", e);
        (e.target as HTMLImageElement).src = "/default-avatar.png";
      }}
    />
  );
};
