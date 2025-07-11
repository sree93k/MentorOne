// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

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
//   refreshToken: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(
//   undefined
// );

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = localStorage.getItem("auth_token");
//         if (token) {
//           const response = await axios.get(
//             `${API_BASE_URL}/api/auth/validate`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           const { id, email, name, role } = response.data.user;
//           setUser({ id, email, name, role });
//         } else {
//           setUser(null);
//           navigate("/login");
//         }
//       } catch (error) {
//         console.error("Auth check failed:", error);
//         localStorage.removeItem("auth_token");
//         localStorage.removeItem("refresh_token");
//         setUser(null);
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   const login = async (email: string, password: string) => {
//     try {
//       setLoading(true);
//       const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
//         email,
//         password,
//       });
//       const { user, accessToken, refreshToken } = response.data;
//       localStorage.setItem("auth_token", accessToken);
//       localStorage.setItem("refresh_token", refreshToken);
//       setUser({
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//       });
//       navigate("/seeker/dashboard");
//     } catch (error: any) {
//       console.error("Login failed:", error);
//       throw new Error(error.response?.data?.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       setLoading(true);
//       localStorage.removeItem("auth_token");
//       localStorage.removeItem("refresh_token");
//       setUser(null);
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem("refresh_token");
//       if (!refreshToken) {
//         throw new Error("No refresh token available");
//       }
//       const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
//         refreshToken,
//       });
//       const { accessToken, newRefreshToken } = response.data;
//       localStorage.setItem("auth_token", accessToken);
//       localStorage.setItem("refresh_token", newRefreshToken);
//       const userResponse = await axios.get(
//         `${API_BASE_URL}/api/auth/validate`,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );
//       const { id, email, name, role } = userResponse.data.user;
//       setUser({ id, email, name, role });
//     } catch (error) {
//       console.error("Token refresh failed:", error);
//       localStorage.removeItem("auth_token");
//       localStorage.removeItem("refresh_token");
//       setUser(null);
//       navigate("/login");
//       throw error;
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
//         refreshToken,
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
