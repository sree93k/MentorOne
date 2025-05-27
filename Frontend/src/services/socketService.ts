// // frontend/services/socketService.ts
// import { io, Socket } from "socket.io-client";

// class SocketService {
//   private socket: Socket | null = null;

//   connect(userId: string): void {
//     if (!this.socket) {
//       const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002"; // Use Vite's env variable or fallback
//       this.socket = io(`${API_URL}/notifications`, {
//         auth: {
//           token: localStorage.getItem("accessToken"),
//         },
//         path: "/socket.io/",
//         reconnection: true,
//         reconnectionAttempts: 5,
//         reconnectionDelay: 1000,
//       });

//       this.socket.on("connect", () => {
//         console.log("Connected to Socket.IO /notifications");
//         this.socket?.emit("join", userId);
//       });

//       this.socket.on("disconnect", () => {
//         console.log("Disconnected from Socket.IO /notifications");
//       });

//       this.socket.on("connect_error", (err) => {
//         console.error("Socket.IO connect error:", err.message);
//       });
//     }
//   }

//   onNewNotification(callback: (notification: any) => void): void {
//     this.socket?.on("new_notification", (notification) => {
//       console.log("New notification received:", notification);
//       callback(notification);
//     });
//   }

//   disconnect(): void {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//     }
//   }
// }

// export default new SocketService();
// frontend/services/socketService.ts
import { io, Socket } from "socket.io-client";

class SocketService {
  private sockets: { [namespace: string]: Socket | null } = {};

  connect(namespace: string, userId: string): Socket {
    if (!this.sockets[namespace]) {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found. Please log in again.");
      }

      this.sockets[namespace] = io(`${API_URL}${namespace}`, {
        auth: { token },
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
          localStorage.removeItem("accessToken");
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
