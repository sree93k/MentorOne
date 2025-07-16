import React from "react";
import { useAdminProfilePicture } from "@/hooks/useAdminSecureUrl";

// Profile Picture Component for Admin with Enhanced Debugging
interface AdminProfilePictureProps {
  profilePicture: string | null | undefined;
  userName: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const AdminProfilePicture: React.FC<AdminProfilePictureProps> = ({
  profilePicture,
  userName,
  size = "md",
  className,
}) => {
  console.log("🔍 AdminProfilePicture Component Debug:");
  console.log("- Raw profilePicture prop:", profilePicture);
  console.log("- userName:", userName);
  console.log("- size:", size);

  const { profilePictureUrl, loading, error } =
    useAdminProfilePicture(profilePicture);

  console.log("🔍 useAdminProfilePicture Hook Results:");
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
    console.log("📸 AdminProfilePicture: Loading state");
    return (
      <div
        className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse border-2 border-gray-200`}
      />
    );
  }

  if (error) {
    console.error("❌ AdminProfilePicture error:", error);
    console.log("📸 AdminProfilePicture: Using fallback due to error");
  }

  const finalUrl = profilePictureUrl || "/default-avatar.png";
  console.log("📸 AdminProfilePicture: Final URL to render:", finalUrl);

  return (
    <img
      src={finalUrl}
      alt={`${userName}'s profile`}
      className={finalClasses}
      onLoad={() => {
        console.log(
          "✅ AdminProfilePicture: Image loaded successfully from:",
          finalUrl
        );
      }}
      onError={(e) => {
        console.error(
          "💥 AdminProfilePicture: Image failed to load from:",
          finalUrl
        );
        console.error("💥 Image error event:", e);
        (e.target as HTMLImageElement).src = "/default-avatar.png";
      }}
    />
  );
};
