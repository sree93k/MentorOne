import React, { use } from "react";
import {
  GoogleOAuthProvider,
  CredentialResponse,
  GoogleLogin,
} from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { signInWithGoogle } from "@/services/userAuthService";
import {GoogleSignInData} from '@/types/googleAuth'
import toast, { Toaster } from "react-hot-toast";
import { setUser, setIsAuthenticated, setAccessToken } from "@/redux/slices/userSlice";


  const GoogleAuthButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
  
    const handleSuccess = async (credentialResponse: CredentialResponse) => {
      console.log("Credential Response:", credentialResponse);
    
      try {
        console.log("google auth step1 tsx");
        const response = await signInWithGoogle(credentialResponse);
        console.log("google auth step2 tsx", response);
    
        if (response) {
          const { user, accessToken } = response.data;
          console.log("google auth step3 tsx");
          console.log("user:", user);
          console.log("access token:", accessToken);
    
          localStorage.setItem("accessToken", accessToken);
          dispatch(setUser(user));
          dispatch(setIsAuthenticated(true));
          dispatch(setAccessToken(accessToken));
          console.log("google auth step4 tsx");
          toast.success("Logged in with Google successfully!");
          console.log("google auth step5 tsx");
    
          if (user.role.includes("mentee")) {
            navigate("/seeker/dashboard");
          } else if (user.role.includes("mentor")) {
            navigate("/expert/dashboard");
          }
        } else {
          toast.error("Google login failed. Please try again.");
        }
      } catch (error) {
        console.error("Google Sign-In Error:", error);
        toast.error("An error occurred during Google login.");
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

export default GoogleAuthButton
