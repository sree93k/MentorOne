// frontend/services/socketService.ts
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string): void {
    if (!this.socket) {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002"; // Use Vite's env variable or fallback
      this.socket = io(`${API_URL}/notifications`, {
        auth: {
          token: localStorage.getItem("accessToken"),
        },
        path: "/socket.io/",
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on("connect", () => {
        console.log("Connected to Socket.IO /notifications");
        this.socket?.emit("join", userId);
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO /notifications");
      });

      this.socket.on("connect_error", (err) => {
        console.error("Socket.IO connect error:", err.message);
      });
    }
  }

  onNewNotification(callback: (notification: any) => void): void {
    this.socket?.on("new_notification", (notification) => {
      console.log("New notification received:", notification);
      callback(notification);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
