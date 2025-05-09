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
//     // Check for stored auth token and validate it
//     const checkAuth = async () => {
//       try {
//         const token = localStorage.getItem("auth_token");
//         if (token) {
//           // TODO: Validate token with backend
//           // For now, we'll use mock data
//           const mockUser = {
//             id: "1",
//             email: "user@example.com",
//             name: "John Doe",
//             role: "mentor" as UserRole,
//           };
//           setUser(mockUser);
//         }
//       } catch (error) {
//         console.error("Auth check failed:", error);
//         localStorage.removeItem("auth_token");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       setLoading(true);
//       // TODO: Implement actual login API call
//       // For demonstration, we'll simulate an API call with credentials
//       console.log(
//         `Attempting login with email: ${email} and password: ${password.length} characters`
//       );

//       // Simulate API validation
//       if (!email || !password) {
//         throw new Error("Email and password are required");
//       }

//       // Mock successful authentication
//       const mockUser = {
//         id: "1",
//         email,
//         name: "John Doe",
//         role: "mentor" as UserRole,
//       };
//       localStorage.setItem("auth_token", "mock_token");
//       setUser(mockUser);
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
//       localStorage.removeItem("auth_token");
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("authCOntext step1 ");

    const checkAuth = async () => {
      try {
        console.log("authCOntext step2 ");
        const token = localStorage.getItem("accessToken");
        console.log("authCOntext step3 ", token);
        if (token) {
          // TODO: Replace with actual API call to validate token
          const response = await fetch("/api/auth/validate", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("authCOntext step4 ", response);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem("accessToken");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // TODO: Replace with actual login API call
      console.log("authCOntext login step1 ");
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("authCOntext login step2 ", response);
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const { user, token } = await response.json();
      localStorage.setItem("accessToken", token);
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // TODO: Optional - Call logout API if needed
      localStorage.removeItem("accessToken");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
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
