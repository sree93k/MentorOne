// import { io, Socket } from "socket.io-client";

// class SocketService {
//   private sockets: { [namespace: string]: Socket | null } = {};

//   connect(namespace: string, userId: string): Socket {
//     if (!this.sockets[namespace]) {
//       const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         throw new Error("No access token found. Please log in again.");
//       }

//       this.sockets[namespace] = io(`${API_URL}${namespace}`, {
//         auth: { token },
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
//           localStorage.removeItem("accessToken");
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

//   getSocket(namespace: string): Socket | null {
//     return this.sockets[namespace] || null;
//   }
// }

// export default new SocketService();
// ✅ CHANGED: Remove localStorage token usage - cookies sent automatically
import { io, Socket } from "socket.io-client";

class SocketService {
  private sockets: { [namespace: string]: Socket | null } = {};

  connect(namespace: string, userId: string): Socket {
    if (!this.sockets[namespace]) {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

      // ✅ CHANGED: No token from localStorage - cookies sent automatically
      this.sockets[namespace] = io(`${API_URL}${namespace}`, {
        withCredentials: true, // ✅ CRITICAL: Enable cookies
        path: "/socket.io/",
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
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
          // ✅ CHANGED: Don't remove accessToken, clear other data and redirect
          localStorage.clear();
          sessionStorage.clear();
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

  getSocket(namespace: string): Socket | null {
    return this.sockets[namespace] || null;
  }
}

export default new SocketService();
