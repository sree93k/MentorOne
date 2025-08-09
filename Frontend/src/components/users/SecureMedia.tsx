import React, { useState } from "react";
import { useProfilePicture } from "@/hooks/useSecureUrl";

// Default Avatar Component with Initials
// const DefaultAvatar: React.FC<{ userName: string; size: string }> = ({
//   userName,
//   size,
// }) => {
//   const initials = userName
//     .split(" ")
//     .map((name) => name.charAt(0))
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <div
//       className={`${size} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-gray-200`}
//     >
//       <span className="text-xs">{initials || "U"}</span>
//     </div>
//   );
// };
const DefaultAvatar: React.FC<{ userName?: string; size: string }> = ({
  userName,
  size,
}) => {
  // ✅ BEST FIX: Handle all edge cases
  const getInitials = (name?: string): string => {
    if (!name || typeof name !== "string") return "U";

    const trimmedName = name.trim();
    if (!trimmedName) return "U";

    return (
      trimmedName
        .split(" ")
        .filter((part) => part.length > 0) // Remove empty parts
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const initials = getInitials(userName);

  return (
    <div
      className={`${size} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-gray-200`}
    >
      <span className="text-xs">{initials}</span>
    </div>
  );
};

// Profile Picture Component with Enhanced Error Handling
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
  const [imageError, setImageError] = useState(false);
  const { profilePictureUrl, loading, error } =
    useProfilePicture(profilePicture);

  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
  };

  const sizeClass = sizeClasses[size];

  // Show loading state
  if (loading) {
    return (
      <div
        className={`${sizeClass} rounded-full bg-gray-200 animate-pulse border-2 border-gray-200 ${
          className || ""
        }`}
      />
    );
  }

  // Show default avatar if no image, error, or image failed to load
  if (!profilePictureUrl || error || imageError) {
    return <DefaultAvatar userName={userName} size={sizeClass} />;
  }

  return (
    <img
      src={profilePictureUrl}
      alt={`${userName}'s profile`}
      className={`${sizeClass} rounded-full object-cover border-2 border-gray-200 ${
        className || ""
      }`}
      onError={() => {
        console.log("🖼️ Image failed to load, showing default avatar");
        setImageError(true);
      }}
      onLoad={() => {
        console.log("✅ Image loaded successfully");
        setImageError(false);
      }}
      loading="lazy"
    />
  );
};
