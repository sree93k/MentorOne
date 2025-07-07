// import React, { use } from "react";
// import {
//   GoogleOAuthProvider,
//   CredentialResponse,
//   GoogleLogin,
// } from "@react-oauth/google";

// import { signInWithGoogle } from "@/services/userAuthService";
// import { GoogleSignInData } from "@/types/googleAuth";
// import toast from "react-hot-toast";
// import {
//   setUser,
//   setIsAuthenticated,
//   setMentorActivated,
//   setLoading,
// } from "@/redux/slices/userSlice";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";

// const GoogleAuthButton = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

//   const handleSuccess = async (credentialResponse: CredentialResponse) => {
//     console.log("Credential Response:", credentialResponse);

//     try {
//       dispatch(setLoading(true));
//       console.log("google auth step1 tsx");
//       const response = await signInWithGoogle(credentialResponse);
//       console.log("google auth step2 tsx", response);

//       if (response) {
//         const { user } = response.data;
//         console.log("google auth step3 tsx");
//         console.log("user:", user);

//         dispatch(setUser(user));
//         dispatch(setIsAuthenticated(true));

//         dispatch(setMentorActivated(user?.mentorActivated));

//         console.log("google auth step4 tsx");
//         toast.success("Logged in with Google successfully!");
//         console.log("google auth step5 tsx");

//         if (user.role.includes("mentee")) {
//           navigate("/seeker/dashboard");
//         } else if (user.role.includes("mentor")) {
//           navigate("/expert/dashboard");
//         }
//       } else {
//         toast.error("Google login failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Google Sign-In Error:", error);
//       toast.error("An error occurred during Google login.");
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const handleError = () => {
//     console.error("Google Login Failed");
//     toast.error("Google login failed. Please try again.");
//   };
//   return (
//     <GoogleOAuthProvider clientId={clientID}>
//       <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
//     </GoogleOAuthProvider>
//   );
// };

// export default GoogleAuthButton;
import React from "react";
import {
  GoogleOAuthProvider,
  CredentialResponse,
  GoogleLogin,
} from "@react-oauth/google";

import { signInWithGoogle } from "@/services/userAuthService";
import { GoogleSignInData } from "@/types/googleAuth";
import toast from "react-hot-toast";
import {
  setUser,
  setIsAuthenticated,
  setMentorActivated,
  setLoading,
  setCurrentTab,
} from "@/redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const GoogleAuthButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log("Credential Response:", credentialResponse);

    try {
      dispatch(setLoading(true));
      console.log("google auth step1 tsx");

      const response: GoogleSignInData = await signInWithGoogle(
        credentialResponse
      );
      console.log("google auth step2 tsx", response);

      // Check if response is successful
      if (
        response &&
        response.success &&
        response.data &&
        response.data.userFound
      ) {
        const user = response.data.userFound;
        console.log("google auth step3 tsx");
        console.log("user:", user);

        // Store user data in Redux (tokens are now in cookies)
        dispatch(setUser(user));
        dispatch(setIsAuthenticated(true));
        dispatch(setMentorActivated(user?.mentorActivated || false));

        console.log("google auth step4 tsx");
        toast.success(`Welcome, ${user.firstName || "User"}!`);
        console.log("google auth step5 tsx");

        // Navigate based on user role
        if (user.role.includes("mentee")) {
          dispatch(setCurrentTab("mentee"));
          navigate("/seeker/dashboard");
        } else if (user.role.includes("mentor")) {
          dispatch(setCurrentTab("mentor"));
          navigate("/expert/dashboard");
        } else {
          // Default fallback
          dispatch(setCurrentTab("mentee"));
          navigate("/seeker/dashboard");
        }
      } else {
        console.error("Invalid response structure:", response);
        toast.error("Google login failed. Please try again.");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);

      // Better error handling
      let errorMessage = "An error occurred during Google login.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = String(error.message);
      }

      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleError = () => {
    console.error("Google Login Failed");
    toast.error("Google login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={clientID}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthButton;
