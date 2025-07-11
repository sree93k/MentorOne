// import React, { createContext, useContext, useState, useEffect } from "react";

// export type UserRole = "admin" | "mentor" | "mentee";

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: UserRole;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log("authCOntext step1 ");

//     const checkAuth = async () => {
//       try {
//         console.log("authCOntext step2 ");
//         const token = localStorage.getItem("accessToken");
//         console.log("authCOntext step3 ", token);
//         if (token) {
//           // TODO: Replace with actual API call to validate token
//           const response = await fetch("/api/auth/validate", {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           console.log("authCOntext step4 ", response);
//           if (response.ok) {
//             const userData = await response.json();
//             setUser(userData);
//           } else {
//             localStorage.removeItem("accessToken");
//             setUser(null);
//           }
//         }
//       } catch (error) {
//         console.error("Auth check failed:", error);
//         localStorage.removeItem("accessToken");
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       setLoading(true);
//       // TODO: Replace with actual login API call
//       console.log("authCOntext login step1 ");
//       const response = await fetch("/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       console.log("authCOntext login step2 ", response);
//       if (!response.ok) {
//         throw new Error("Invalid credentials");
//       }
//       const { user, token } = await response.json();
//       localStorage.setItem("accessToken", token);
//       setUser(user);
//     } catch (error) {
//       console.error("Login failed:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       setLoading(true);
//       // TODO: Optional - Call logout API if needed
//       localStorage.removeItem("accessToken");
//       setUser(null);
//     } catch (error) {
//       console.error("Logout failed:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         logout,
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  validateUserSession,
  logout as logoutService,
} from "@/services/userAuthService"; // Import your service functions

export type UserRole = "admin" | "mentor" | "mentee";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  checkAuthentication: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthentication = async () => {
    try {
      console.log("AuthContext: Checking authentication via cookies");
      setLoading(true);

      // Use your existing service to validate session (cookies sent automatically)
      const response = await validateUserSession();

      console.log("AuthContext: Validation response", response);

      if (response?.status === 200 && response.data?.user) {
        const userData = response.data.user;
        setUser({
          id: userData._id || userData.id,
          email: userData.email,
          name:
            userData.firstName +
            (userData.lastName ? ` ${userData.lastName}` : ""),
          role: userData.role?.[0] || userData.role || "mentee", // Handle array or string role
        });
        console.log("AuthContext: User authenticated successfully");
      } else {
        console.log("AuthContext: User not authenticated");
        setUser(null);
      }
    } catch (error) {
      console.error("AuthContext: Authentication check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("AuthContext: Initial authentication check");
    checkAuthentication();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("AuthContext: Login attempt for", email);

      // Use your existing login service (cookies will be set automatically by the backend)
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/user/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important: This sends and receives cookies
          body: JSON.stringify({ email, password, role: ["mentee"] }), // Adjust role as needed
        }
      );

      console.log("AuthContext: Login response", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const responseData = await response.json();
      console.log("AuthContext: Login successful", responseData);

      // Set user data from response
      if (responseData.data?.userFound) {
        const userData = responseData.data.userFound;
        setUser({
          id: userData._id || userData.id,
          email: userData.email,
          name:
            userData.firstName +
            (userData.lastName ? ` ${userData.lastName}` : ""),
          role: userData.role?.[0] || userData.role || "mentee",
        });
      }

      // Alternatively, you could call checkAuthentication() here to get fresh user data
      // await checkAuthentication();
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log("AuthContext: Logout attempt");

      // Use your existing logout service (will clear cookies on backend)
      await logoutService();

      console.log("AuthContext: Logout successful");
      setUser(null);
    } catch (error) {
      console.error("AuthContext: Logout failed:", error);
      // Even if logout fails, clear user state locally
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        checkAuthentication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
