// // import { io, Socket } from "socket.io-client";

// // class SocketService {
// //   private sockets: { [namespace: string]: Socket | null } = {};

// //   connect(namespace: string, userId: string): Socket {
// //     if (!this.sockets[namespace]) {
// //       const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
// //       const token = localStorage.getItem("accessToken");
// //       if (!token) {
// //         throw new Error("No access token found. Please log in again.");
// //       }

// //       this.sockets[namespace] = io(`${API_URL}${namespace}`, {
// //         auth: { token },
// //         path: "/socket.io/",
// //         reconnection: true,
// //         reconnectionAttempts: 5,
// //         reconnectionDelay: 1000,
// //       });

// //       this.sockets[namespace]!.on("connect", () => {
// //         console.log(
// //           `Connected to Socket.IO ${namespace}, socket ID: ${this.sockets[namespace]?.id}`
// //         );
// //         this.sockets[namespace]?.emit("join", userId);
// //       });

// //       this.sockets[namespace]!.on("disconnect", () => {
// //         console.log(`Disconnected from Socket.IO ${namespace}`);
// //       });

// //       this.sockets[namespace]!.on("connect_error", (err) => {
// //         console.error(`Socket.IO ${namespace} connect error:`, err.message);
// //         if (err.message.includes("Authentication error")) {
// //           localStorage.removeItem("accessToken");
// //           window.location.href = "/login";
// //         }
// //       });
// //     }
// //     return this.sockets[namespace]!;
// //   }

// //   onNewNotification(callback: (notification: any) => void): void {
// //     this.sockets["/notifications"]?.on("new_notification", (notification) => {
// //       console.log("New notification received:", notification);
// //       callback(notification);
// //     });
// //   }

// //   disconnect(namespace: string): void {
// //     if (this.sockets[namespace]) {
// //       this.sockets[namespace]!.disconnect();
// //       this.sockets[namespace] = null;
// //     }
// //   }

// //   getSocket(namespace: string): Socket | null {
// //     return this.sockets[namespace] || null;
// //   }
// // }

// // export default new SocketService();
// import { io, Socket } from "socket.io-client";

// class SocketService {
//   private sockets: { [namespace: string]: Socket | null } = {};

//   connect(namespace: string, userId: string): Socket {
//     if (!this.sockets[namespace]) {
//       const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

//       this.sockets[namespace] = io(`${API_URL}${namespace}`, {
//         withCredentials: true, // This sends cookies automatically
//         path: "/socket.io/",
//         reconnection: true,
//         reconnectionAttempts: 5,
//         reconnectionDelay: 1000,
//       });

//       this.sockets[namespace]!.on("connect", () => {
//         console.log(
//           `Connected to Socket.IO ${namespace}, socket ID: ${this.sockets[namespace]?.id}`
//         );
//         this.sockets[namespace]?.emit("join", userId);
//       });

//       this.sockets[namespace]!.on("disconnect", () => {
//         console.log(`Disconnected from Socket.IO ${namespace}`);
//       });

//       this.sockets[namespace]!.on("connect_error", (err) => {
//         console.error(`Socket.IO ${namespace} connect error:`, err.message);
//         if (err.message.includes("Authentication error")) {
//           // Clear any client-side auth state if needed
//           // Since we're using cookies, the server will handle clearing them
//           window.location.href = "/login";
//         }
//       });
//     }
//     return this.sockets[namespace]!;
//   }

//   onNewNotification(callback: (notification: any) => void): void {
//     this.sockets["/notifications"]?.on("new_notification", (notification) => {
//       console.log("New notification received:", notification);
//       callback(notification);
//     });
//   }

//   disconnect(namespace: string): void {
//     if (this.sockets[namespace]) {
//       this.sockets[namespace]!.disconnect();
//       this.sockets[namespace] = null;
//     }
//   }

//   disconnectAll(): void {
//     Object.keys(this.sockets).forEach((namespace) => {
//       this.disconnect(namespace);
//     });
//   }

//   getSocket(namespace: string): Socket | null {
//     return this.sockets[namespace] || null;
//   }

//   // Helper method to check if a socket is connected
//   isConnected(namespace: string): boolean {
//     return this.sockets[namespace]?.connected || false;
//   }

//   // Helper method to emit events with error handling
//   emit(namespace: string, event: string, data?: any): boolean {
//     const socket = this.sockets[namespace];
//     if (socket && socket.connected) {
//       socket.emit(event, data);
//       return true;
//     }
//     console.warn(`Cannot emit ${event}: Socket ${namespace} not connected`);
//     return false;
//   }

//   // Helper method to listen to events with automatic cleanup
//   on(
//     namespace: string,
//     event: string,
//     callback: (...args: any[]) => void
//   ): void {
//     const socket = this.sockets[namespace];
//     if (socket) {
//       socket.on(event, callback);
//     } else {
//       console.warn(
//         `Cannot listen to ${event}: Socket ${namespace} not available`
//       );
//     }
//   }

//   // Helper method to remove event listeners
//   off(
//     namespace: string,
//     event: string,
//     callback?: (...args: any[]) => void
//   ): void {
//     const socket = this.sockets[namespace];
//     if (socket) {
//       if (callback) {
//         socket.off(event, callback);
//       } else {
//         socket.off(event);
//       }
//     }
//   }
// }

// export default new SocketService();
import { io, Socket } from "socket.io-client";
import { getAccessToken } from "../utils/cookieUtils"; // ✅ ADD THIS IMPORT

class SocketService {
  private sockets: { [namespace: string]: Socket | null } = {};

  connect(namespace: string, userId: string): Socket {
    if (!this.sockets[namespace]) {
      const API_URL =
        import.meta.env.VITE_SOCKET_URL || "http://localhost:5002";

      // Get token for authentication
      const token = getAccessToken();

      this.sockets[namespace] = io(`${API_URL}${namespace}`, {
        withCredentials: true, // This sends cookies automatically
        path: "/socket.io/",
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        auth: {
          token: token, // ✅ Send token in auth
        },
      });

      this.sockets[namespace]!.on("connect", () => {
        console.log(
          `Connected to Socket.IO ${namespace}, socket ID: ${this.sockets[namespace]?.id}`
        );
        this.sockets[namespace]?.emit("join", userId);
      });

      this.sockets[namespace]!.on("disconnect", () => {
        console.log(`Disconnected from Socket.IO ${namespace}`);
      });

      this.sockets[namespace]!.on("connect_error", (err) => {
        console.error(`Socket.IO ${namespace} connect error:`, err.message);
        if (err.message.includes("Authentication error")) {
          // Clear any client-side auth state if needed
          // Since we're using cookies, the server will handle clearing them
          window.location.href = "/login";
        }
      });
    }
    return this.sockets[namespace]!;
  }

  onNewNotification(callback: (notification: any) => void): void {
    this.sockets["/notifications"]?.on("new_notification", (notification) => {
      console.log("New notification received:", notification);
      callback(notification);
    });
  }

  disconnect(namespace: string): void {
    if (this.sockets[namespace]) {
      this.sockets[namespace]!.disconnect();
      this.sockets[namespace] = null;
    }
  }

  disconnectAll(): void {
    Object.keys(this.sockets).forEach((namespace) => {
      this.disconnect(namespace);
    });
  }

  getSocket(namespace: string): Socket | null {
    return this.sockets[namespace] || null;
  }

  // Helper method to check if a socket is connected
  isConnected(namespace: string): boolean {
    return this.sockets[namespace]?.connected || false;
  }

  // Helper method to emit events with error handling
  emit(namespace: string, event: string, data?: any): boolean {
    const socket = this.sockets[namespace];
    if (socket && socket.connected) {
      socket.emit(event, data);
      return true;
    }
    console.warn(`Cannot emit ${event}: Socket ${namespace} not connected`);
    return false;
  }

  // Helper method to listen to events with automatic cleanup
  on(
    namespace: string,
    event: string,
    callback: (...args: any[]) => void
  ): void {
    const socket = this.sockets[namespace];
    if (socket) {
      socket.on(event, callback);
    } else {
      console.warn(
        `Cannot listen to ${event}: Socket ${namespace} not available`
      );
    }
  }

  // Helper method to remove event listeners
  off(
    namespace: string,
    event: string,
    callback?: (...args: any[]) => void
  ): void {
    const socket = this.sockets[namespace];
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  }
}

export default new SocketService();
