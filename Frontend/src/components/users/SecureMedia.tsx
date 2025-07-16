// // // // // components/SecureMedia.tsx
// // // // import React from "react";
// // // // import { useSecureUrl, useProfilePicture } from "@/hooks/useSignedUrl";

// // // // // Secure Image Component
// // // // interface SecureImageProps {
// // // //   src: string | null | undefined;
// // // //   alt: string;
// // // //   className?: string;
// // // //   fallback?: string;
// // // // }

// // // // export const SecureImage: React.FC<SecureImageProps> = ({
// // // //   src,
// // // //   alt,
// // // //   className,
// // // //   fallback = "/default-placeholder.png",
// // // // }) => {
// // // //   const { secureUrl, loading, error } = useSecureUrl(src);

// // // //   if (loading) {
// // // //     return (
// // // //       <div
// // // //         className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
// // // //       >
// // // //         <span className="text-gray-500 text-sm">Loading...</span>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <img
// // // //       src={secureUrl || fallback}
// // // //       alt={alt}
// // // //       className={className}
// // // //       onError={(e) => {
// // // //         (e.target as HTMLImageElement).src = fallback;
// // // //       }}
// // // //     />
// // // //   );
// // // // };

// // // // // Profile Picture Component
// // // // interface ProfilePictureProps {
// // // //   profilePicture: string | null | undefined;
// // // //   userName: string;
// // // //   size?: "xs" | "sm" | "md" | "lg" | "xl";
// // // //   className?: string;
// // // // }

// // // // export const ProfilePicture: React.FC<ProfilePictureProps> = ({
// // // //   profilePicture,
// // // //   userName,
// // // //   size = "md",
// // // //   className,
// // // // }) => {
// // // //   const { profilePictureUrl, loading } = useProfilePicture(profilePicture);

// // // //   const sizeClasses = {
// // // //     xs: "w-6 h-6",
// // // //     sm: "w-8 h-8",
// // // //     md: "w-12 h-12",
// // // //     lg: "w-20 h-20",
// // // //     xl: "w-32 h-32",
// // // //   };

// // // //   const baseClasses = `${sizeClasses[size]} rounded-full object-cover`;
// // // //   const finalClasses = className ? `${baseClasses} ${className}` : baseClasses;

// // // //   if (loading) {
// // // //     return (
// // // //       <div
// // // //         className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse`}
// // // //       />
// // // //     );
// // // //   }

// // // //   return (
// // // //     <img
// // // //       src={profilePictureUrl}
// // // //       alt={`${userName}'s profile`}
// // // //       className={finalClasses}
// // // //     />
// // // //   );
// // // // };

// // // // // Secure Video Component
// // // // interface SecureVideoProps {
// // // //   src: string | null | undefined;
// // // //   className?: string;
// // // //   controls?: boolean;
// // // //   autoPlay?: boolean;
// // // // }

// // // // export const SecureVideo: React.FC<SecureVideoProps> = ({
// // // //   src,
// // // //   className,
// // // //   controls = true,
// // // //   autoPlay = false,
// // // // }) => {
// // // //   const { secureUrl, loading, error } = useSecureUrl(src);

// // // //   if (loading) {
// // // //     return (
// // // //       <div
// // // //         className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
// // // //       >
// // // //         <span className="text-gray-500">Loading video...</span>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (error || !secureUrl) {
// // // //     return (
// // // //       <div
// // // //         className={`bg-gray-200 flex items-center justify-center ${className}`}
// // // //       >
// // // //         <span className="text-red-500">Failed to load video</span>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <video
// // // //       src={secureUrl}
// // // //       controls={controls}
// // // //       autoPlay={autoPlay}
// // // //       className={className}
// // // //       preload="metadata"
// // // //     >
// // // //       Your browser does not support the video tag.
// // // //     </video>
// // // //   );
// // // // };

// // // // // Secure Audio Component
// // // // interface SecureAudioProps {
// // // //   src: string | null | undefined;
// // // //   className?: string;
// // // //   controls?: boolean;
// // // // }

// // // // export const SecureAudio: React.FC<SecureAudioProps> = ({
// // // //   src,
// // // //   className,
// // // //   controls = true,
// // // // }) => {
// // // //   const { secureUrl, loading, error } = useSecureUrl(src);

// // // //   if (loading) {
// // // //     return (
// // // //       <div
// // // //         className={`bg-gray-200 animate-pulse flex items-center justify-center p-4 ${className}`}
// // // //       >
// // // //         <span className="text-gray-500">Loading audio...</span>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (error || !secureUrl) {
// // // //     return (
// // // //       <div
// // // //         className={`bg-gray-200 flex items-center justify-center p-4 ${className}`}
// // // //       >
// // // //         <span className="text-red-500">Failed to load audio</span>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <audio
// // // //       src={secureUrl}
// // // //       controls={controls}
// // // //       className={className}
// // // //       preload="metadata"
// // // //     >
// // // //       Your browser does not support the audio tag.
// // // //     </audio>
// // // //   );
// // // // };

// // // // // Secure PDF/Document Download Component
// // // // interface SecureDocumentProps {
// // // //   src: string | null | undefined;
// // // //   fileName: string;
// // // //   className?: string;
// // // //   children?: React.ReactNode;
// // // // }

// // // // export const SecureDocument: React.FC<SecureDocumentProps> = ({
// // // //   src,
// // // //   fileName,
// // // //   className = "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
// // // //   children = "Download",
// // // // }) => {
// // // //   const { secureUrl, loading, error } = useSecureUrl(src);

// // // //   const handleDownload = () => {
// // // //     if (secureUrl) {
// // // //       const link = document.createElement("a");
// // // //       link.href = secureUrl;
// // // //       link.download = fileName;
// // // //       document.body.appendChild(link);
// // // //       link.click();
// // // //       document.body.removeChild(link);
// // // //     }
// // // //   };

// // // //   if (loading) {
// // // //     return (
// // // //       <button className={className} disabled>
// // // //         Loading...
// // // //       </button>
// // // //     );
// // // //   }

// // // //   if (error || !secureUrl) {
// // // //     return (
// // // //       <button className={`${className} opacity-50 cursor-not-allowed`} disabled>
// // // //         Failed to load
// // // //       </button>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <button onClick={handleDownload} className={className}>
// // // //       {children}
// // // //     </button>
// // // //   );
// // // // };

// // // // export default {
// // // //   SecureImage,
// // // //   ProfilePicture,
// // // //   SecureVideo,
// // // //   SecureAudio,
// // // //   SecureDocument,
// // // // };
// // // // components/SecureMedia.tsx
// // // import React from "react";
// // // import { useSecureUrl, useProfilePicture } from "@/hooks/useSecureUrl";

// // // // Secure Image Component
// // // interface SecureImageProps {
// // //   src: string | null | undefined;
// // //   alt: string;
// // //   className?: string;
// // //   fallback?: string;
// // // }

// // // export const SecureImage: React.FC<SecureImageProps> = ({
// // //   src,
// // //   alt,
// // //   className,
// // //   fallback = "/default-placeholder.png",
// // // }) => {
// // //   const { secureUrl, loading } = useSecureUrl(src);

// // //   if (loading) {
// // //     return (
// // //       <div
// // //         className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
// // //       >
// // //         <span className="text-gray-500 text-sm">Loading...</span>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <img
// // //       src={secureUrl || fallback}
// // //       alt={alt}
// // //       className={className}
// // //       onError={(e) => {
// // //         (e.target as HTMLImageElement).src = fallback;
// // //       }}
// // //     />
// // //   );
// // // };

// // // // Profile Picture Component
// // // interface ProfilePictureProps {
// // //   profilePicture: string | null | undefined;
// // //   userName: string;
// // //   size?: "xs" | "sm" | "md" | "lg" | "xl";
// // //   className?: string;
// // // }

// // // export const ProfilePicture: React.FC<ProfilePictureProps> = ({
// // //   profilePicture,
// // //   userName,
// // //   size = "md",
// // //   className,
// // // }) => {
// // //   const { profilePictureUrl, loading } = useProfilePicture(profilePicture);

// // //   const sizeClasses = {
// // //     xs: "w-6 h-6",
// // //     sm: "w-8 h-8",
// // //     md: "w-12 h-12",
// // //     lg: "w-20 h-20",
// // //     xl: "w-32 h-32",
// // //   };

// // //   const baseClasses = `${sizeClasses[size]} rounded-full object-cover`;
// // //   const finalClasses = className ? `${baseClasses} ${className}` : baseClasses;

// // //   if (loading) {
// // //     return (
// // //       <div
// // //         className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse`}
// // //       />
// // //     );
// // //   }

// // //   return (
// // //     <img
// // //       src={profilePictureUrl}
// // //       alt={`${userName}'s profile`}
// // //       className={finalClasses}
// // //     />
// // //   );
// // // };

// // // // Secure Video Component
// // // interface SecureVideoProps {
// // //   src: string | null | undefined;
// // //   className?: string;
// // //   controls?: boolean;
// // //   autoPlay?: boolean;
// // // }

// // // export const SecureVideo: React.FC<SecureVideoProps> = ({
// // //   src,
// // //   className,
// // //   controls = true,
// // //   autoPlay = false,
// // // }) => {
// // //   const { secureUrl, loading, error } = useSecureUrl(src);

// // //   if (loading) {
// // //     return (
// // //       <div
// // //         className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
// // //       >
// // //         <span className="text-gray-500">Loading video...</span>
// // //       </div>
// // //     );
// // //   }

// // //   if (error || !secureUrl) {
// // //     return (
// // //       <div
// // //         className={`bg-gray-200 flex items-center justify-center ${className}`}
// // //       >
// // //         <span className="text-red-500">Failed to load video</span>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <video
// // //       src={secureUrl}
// // //       controls={controls}
// // //       autoPlay={autoPlay}
// // //       className={className}
// // //       preload="metadata"
// // //     >
// // //       Your browser does not support the video tag.
// // //     </video>
// // //   );
// // // };

// // // // Secure Audio Component
// // // interface SecureAudioProps {
// // //   src: string | null | undefined;
// // //   className?: string;
// // //   controls?: boolean;
// // // }

// // // export const SecureAudio: React.FC<SecureAudioProps> = ({
// // //   src,
// // //   className,
// // //   controls = true,
// // // }) => {
// // //   const { secureUrl, loading, error } = useSecureUrl(src);

// // //   if (loading) {
// // //     return (
// // //       <div
// // //         className={`bg-gray-200 animate-pulse flex items-center justify-center p-4 ${className}`}
// // //       >
// // //         <span className="text-gray-500">Loading audio...</span>
// // //       </div>
// // //     );
// // //   }

// // //   if (error || !secureUrl) {
// // //     return (
// // //       <div
// // //         className={`bg-gray-200 flex items-center justify-center p-4 ${className}`}
// // //       >
// // //         <span className="text-red-500">Failed to load audio</span>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <audio
// // //       src={secureUrl}
// // //       controls={controls}
// // //       className={className}
// // //       preload="metadata"
// // //     >
// // //       Your browser does not support the audio tag.
// // //     </audio>
// // //   );
// // // };

// // // // Secure PDF/Document Download Component
// // // interface SecureDocumentProps {
// // //   src: string | null | undefined;
// // //   fileName: string;
// // //   className?: string;
// // //   children?: React.ReactNode;
// // // }

// // // export const SecureDocument: React.FC<SecureDocumentProps> = ({
// // //   src,
// // //   fileName,
// // //   className = "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
// // //   children = "Download",
// // // }) => {
// // //   const { secureUrl, loading, error } = useSecureUrl(src);

// // //   const handleDownload = () => {
// // //     if (secureUrl) {
// // //       const link = document.createElement("a");
// // //       link.href = secureUrl;
// // //       link.download = fileName;
// // //       document.body.appendChild(link);
// // //       link.click();
// // //       document.body.removeChild(link);
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <button className={className} disabled>
// // //         Loading...
// // //       </button>
// // //     );
// // //   }

// // //   if (error || !secureUrl) {
// // //     return (
// // //       <button className={`${className} opacity-50 cursor-not-allowed`} disabled>
// // //         Failed to load
// // //       </button>
// // //     );
// // //   }

// // //   return (
// // //     <button onClick={handleDownload} className={className}>
// // //       {children}
// // //     </button>
// // //   );
// // // };

// // // export default {
// // //   SecureImage,
// // //   ProfilePicture,
// // //   SecureVideo,
// // //   SecureAudio,
// // //   SecureDocument,
// // // };
// // // src/components/users/SecureMedia.tsx - Simple version without signed URLs
// // import React from "react";

// // // Simple fallback that just uses regular img tags for now
// // interface SecureImageProps {
// //   src: string | null | undefined;
// //   alt: string;
// //   className?: string;
// //   fallback?: string;
// // }

// // export const SecureImage: React.FC<SecureImageProps> = ({
// //   src,
// //   alt,
// //   className,
// //   fallback = "/default-placeholder.png",
// // }) => {
// //   return (
// //     <img
// //       src={src || fallback}
// //       alt={alt}
// //       className={className}
// //       onError={(e) => {
// //         (e.target as HTMLImageElement).src = fallback;
// //       }}
// //     />
// //   );
// // };

// // // Simple profile picture component
// // interface ProfilePictureProps {
// //   profilePicture: string | null | undefined;
// //   userName: string;
// //   size?: "xs" | "sm" | "md" | "lg" | "xl";
// //   className?: string;
// // }

// // export const ProfilePicture: React.FC<ProfilePictureProps> = ({
// //   profilePicture,
// //   userName,
// //   size = "md",
// //   className,
// // }) => {
// //   const sizeClasses = {
// //     xs: "w-6 h-6",
// //     sm: "w-8 h-8",
// //     md: "w-12 h-12",
// //     lg: "w-20 h-20",
// //     xl: "w-32 h-32",
// //   };

// //   const baseClasses = `${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`;
// //   const finalClasses = className ? `${baseClasses} ${className}` : baseClasses;

// //   return (
// //     <img
// //       src={profilePicture || "/default-avatar.png"}
// //       alt={`${userName}'s profile`}
// //       className={finalClasses}
// //       onError={(e) => {
// //         console.log("Profile picture failed, using fallback");
// //         (e.target as HTMLImageElement).src = "/default-avatar.png";
// //       }}
// //     />
// //   );
// // };

// // export default {
// //   SecureImage,
// //   ProfilePicture,
// // };
// import React from "react";
// import { useSecureUrl, useProfilePicture } from "@/hooks/useSecureUrl";

// // Secure Image Component
// interface SecureImageProps {
//   src: string | null | undefined;
//   alt: string;
//   className?: string;
//   fallback?: string;
// }

// export const SecureImage: React.FC<SecureImageProps> = ({
//   src,
//   alt,
//   className,
//   fallback = "/default-placeholder.png",
// }) => {
//   const { secureUrl, loading, error } = useSecureUrl(src);

//   if (loading) {
//     return (
//       <div
//         className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
//       >
//         <span className="text-gray-500 text-sm">Loading...</span>
//       </div>
//     );
//   }

//   if (error) {
//     console.error("SecureImage error:", error);
//   }

//   return (
//     <img
//       src={secureUrl || fallback}
//       alt={alt}
//       className={className}
//       onError={(e) => {
//         console.log("Image failed to load, using fallback:", fallback);
//         (e.target as HTMLImageElement).src = fallback;
//       }}
//     />
//   );
// };

// // Profile Picture Component
// interface ProfilePictureProps {
//   profilePicture: string | null | undefined;
//   userName: string;
//   size?: "xs" | "sm" | "md" | "lg" | "xl";
//   className?: string;
// }

// export const ProfilePicture: React.FC<ProfilePictureProps> = ({
//   profilePicture,
//   userName,
//   size = "md",
//   className,
// }) => {
//   const { profilePictureUrl, loading, error } =
//     useProfilePicture(profilePicture);

//   const sizeClasses = {
//     xs: "w-6 h-6",
//     sm: "w-8 h-8",
//     md: "w-12 h-12",
//     lg: "w-20 h-20",
//     xl: "w-32 h-32",
//   };

//   const baseClasses = `${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`;
//   const finalClasses = className ? `${baseClasses} ${className}` : baseClasses;

//   if (loading) {
//     return (
//       <div
//         className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse border-2 border-gray-200`}
//       />
//     );
//   }

//   if (error) {
//     console.error("ProfilePicture error:", error);
//   }

//   return (
//     <img
//       src={profilePictureUrl}
//       alt={`${userName}'s profile`}
//       className={finalClasses}
//       onError={(e) => {
//         console.log("Profile picture failed, using default avatar");
//         (e.target as HTMLImageElement).src = "/default-avatar.png";
//       }}
//     />
//   );
// };

// // Secure Video Component
// interface SecureVideoProps {
//   src: string | null | undefined;
//   className?: string;
//   controls?: boolean;
//   autoPlay?: boolean;
// }

// export const SecureVideo: React.FC<SecureVideoProps> = ({
//   src,
//   className,
//   controls = true,
//   autoPlay = false,
// }) => {
//   const { secureUrl, loading, error } = useSecureUrl(src);

//   if (loading) {
//     return (
//       <div
//         className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
//       >
//         <span className="text-gray-500">Loading video...</span>
//       </div>
//     );
//   }

//   if (error || !secureUrl) {
//     return (
//       <div
//         className={`bg-gray-200 flex items-center justify-center ${className}`}
//       >
//         <span className="text-red-500">Failed to load video</span>
//       </div>
//     );
//   }

//   return (
//     <video
//       src={secureUrl}
//       controls={controls}
//       autoPlay={autoPlay}
//       className={className}
//       preload="metadata"
//     >
//       Your browser does not support the video tag.
//     </video>
//   );
// };

// // Secure Audio Component
// interface SecureAudioProps {
//   src: string | null | undefined;
//   className?: string;
//   controls?: boolean;
// }

// export const SecureAudio: React.FC<SecureAudioProps> = ({
//   src,
//   className,
//   controls = true,
// }) => {
//   const { secureUrl, loading, error } = useSecureUrl(src);

//   if (loading) {
//     return (
//       <div
//         className={`bg-gray-200 animate-pulse flex items-center justify-center p-4 ${className}`}
//       >
//         <span className="text-gray-500">Loading audio...</span>
//       </div>
//     );
//   }

//   if (error || !secureUrl) {
//     return (
//       <div
//         className={`bg-gray-200 flex items-center justify-center p-4 ${className}`}
//       >
//         <span className="text-red-500">Failed to load audio</span>
//       </div>
//     );
//   }

//   return (
//     <audio
//       src={secureUrl}
//       controls={controls}
//       className={className}
//       preload="metadata"
//     >
//       Your browser does not support the audio tag.
//     </audio>
//   );
// };

// // Secure PDF/Document Download Component
// interface SecureDocumentProps {
//   src: string | null | undefined;
//   fileName: string;
//   className?: string;
//   children?: React.ReactNode;
// }

// export const SecureDocument: React.FC<SecureDocumentProps> = ({
//   src,
//   fileName,
//   className = "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
//   children = "Download",
// }) => {
//   const { secureUrl, loading, error } = useSecureUrl(src);

//   const handleDownload = () => {
//     if (secureUrl) {
//       const link = document.createElement("a");
//       link.href = secureUrl;
//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   if (loading) {
//     return (
//       <button className={className} disabled>
//         Loading...
//       </button>
//     );
//   }

//   if (error || !secureUrl) {
//     return (
//       <button className={`${className} opacity-50 cursor-not-allowed`} disabled>
//         Failed to load
//       </button>
//     );
//   }

//   return (
//     <button onClick={handleDownload} className={className}>
//       {children}
//     </button>
//   );
// };

// export default {
//   SecureImage,
//   ProfilePicture,
//   SecureVideo,
//   SecureAudio,
//   SecureDocument,
// };
// Enhanced SecureMedia.tsx with comprehensive debugging
import React from "react";
import { useSecureUrl, useProfilePicture } from "@/hooks/useSecureUrl";

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
