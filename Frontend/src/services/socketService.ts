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

  // EXISTING: Original notification listener
  onNewNotification(callback: (notification: any) => void): void {
    this.sockets["/notifications"]?.on("new_notification", (notification) => {
      console.log("New notification received:", notification);
      callback(notification);
    });
  }

  // NEW: Listen for notification count updates
  onNotificationCountUpdate(
    callback: (data: { role: "mentor" | "mentee"; increment: number }) => void
  ): void {
    console.log("🔔 Setting up notification count update listener");
    this.sockets["/notifications"]?.on("notification_count_update", (data) => {
      console.log("📊 Notification count update received:", data);
      callback(data);
    });
  }

  // NEW: Get initial notification counts
  getNotificationCounts(callback: (response: any) => void): void {
    console.log("📊 Requesting initial notification counts");
    if (this.sockets["/notifications"]) {
      this.sockets["/notifications"].emit(
        "getNotificationCounts",
        (response: any) => {
          console.log("📊 Initial notification counts response:", response);
          callback(response);
        }
      );
    } else {
      console.warn("⚠️ Notification socket not connected, cannot get counts");
      callback({ success: false, error: "Socket not connected" });
    }
  }

  // UPDATED: Role-aware notification fetching
  getUnreadNotifications(
    role: "mentor" | "mentee",
    callback: (response: any) => void
  ): void {
    console.log(`🔔 Requesting unread notifications for role: ${role}`);
    if (this.sockets["/notifications"]) {
      this.sockets["/notifications"].emit(
        "getUnreadNotifications",
        { role },
        (response: any) => {
          console.log(
            `🔔 Unread notifications response for ${role}:`,
            response
          );
          callback(response);
        }
      );
    } else {
      console.warn(
        "⚠️ Notification socket not connected, cannot get notifications"
      );
      callback({ success: false, error: "Socket not connected" });
    }
  }

  // NEW: Clear notification count for role
  clearNotificationCount(
    role: "mentor" | "mentee",
    callback?: (response: any) => void
  ): void {
    console.log(`🧹 Clearing notification count for role: ${role}`);
    if (this.sockets["/notifications"]) {
      this.sockets["/notifications"].emit(
        "clearNotificationCount",
        { role },
        callback ||
          (() => {
            console.log(`✅ Notification count cleared for ${role}`);
          })
      );
    } else {
      console.warn("⚠️ Notification socket not connected, cannot clear count");
      if (callback) callback({ success: false, error: "Socket not connected" });
    }
  }

  // NEW: Mark notification as read via socket
  markNotificationAsRead(
    notificationId: string,
    callback?: (response: any) => void
  ): void {
    console.log(`✅ Marking notification as read: ${notificationId}`);
    if (this.sockets["/notifications"]) {
      this.sockets["/notifications"].emit(
        "markNotificationAsRead",
        { notificationId },
        callback ||
          (() => {
            console.log(`✅ Notification marked as read: ${notificationId}`);
          })
      );
    } else {
      console.warn("⚠️ Notification socket not connected, cannot mark as read");
      if (callback) callback({ success: false, error: "Socket not connected" });
    }
  }

  // NEW: Remove count update listener
  offNotificationCountUpdate(): void {
    console.log("🔕 Removing notification count update listener");
    if (this.sockets["/notifications"]) {
      this.sockets["/notifications"].off("notification_count_update");
    }
  }

  // NEW: Remove all notification listeners
  offAllNotificationListeners(): void {
    console.log("🔕 Removing all notification listeners");
    if (this.sockets["/notifications"]) {
      this.sockets["/notifications"].off("new_notification");
      this.sockets["/notifications"].off("notification_count_update");
      this.sockets["/notifications"].off("notificationRead");
    }
  }

  // NEW: Get notification socket specifically
  get notificationSocket(): Socket | null {
    return this.sockets["/notifications"] || null;
  }

  // NEW: Check if notification socket is connected
  isNotificationSocketConnected(): boolean {
    return this.sockets["/notifications"]?.connected || false;
  }

  // EXISTING: Disconnect method
  disconnect(namespace: string): void {
    if (this.sockets[namespace]) {
      console.log(`🔌 Disconnecting from ${namespace}`);

      // Clean up listeners before disconnecting
      if (namespace === "/notifications") {
        this.offAllNotificationListeners();
      }

      this.sockets[namespace]!.disconnect();
      this.sockets[namespace] = null;
    }
  }

  // EXISTING: Get socket method
  getSocket(namespace: string): Socket | null {
    return this.sockets[namespace] || null;
  }

  // NEW: Disconnect all sockets (for cleanup on logout)
  disconnectAll(): void {
    console.log("🔌 Disconnecting all sockets");
    Object.keys(this.sockets).forEach((namespace) => {
      this.disconnect(namespace);
    });
  }

  // NEW: Reconnect notification socket if disconnected
  reconnectNotifications(userId: string): void {
    console.log("🔄 Reconnecting notification socket");
    if (!this.isNotificationSocketConnected()) {
      this.disconnect("/notifications");
      this.connect("/notifications", userId);
    }
  }
}

export default new SocketService();
