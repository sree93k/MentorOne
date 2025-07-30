import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { logout } from "@/services/userAuthService";
import { checkAuthStatus } from "@/services/userServices";

interface BlockedData {
  reason: string;
  category: string;
  adminEmail: string;
  timestamp: string;
  canAppeal: boolean;
  severity?: "high" | "medium" | "low";
}

interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  lastConnected: Date | null;
  reconnectAttempts: number;
  hasReceivedBlock: boolean;
}

export const useBlockDetection = (userId?: string) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockData, setBlockData] = useState<BlockedData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnected: false,
    isConnecting: false,
    lastConnected: null,
    reconnectAttempts: 0,
    hasReceivedBlock: false,
  });

  const navigate = useNavigate();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const blockProcessedRef = useRef(false);

  // 🎯 ENHANCED: HTTP polling fallback with exponential backoff
  const pollForBlockStatus = useCallback(async () => {
    if (!userId || blockProcessedRef.current) return;

    try {
      console.log("🔄 Polling for block status (fallback)");

      // Check if user is still authenticated
      const isAuth = checkAuthStatus();
      if (!isAuth) {
        console.log("👋 User not authenticated, stopping poll");
        return;
      }

      // You can add an API endpoint to check block status here
      // For now, we'll just log the poll attempt
      console.log("✅ Block status poll completed");

      // Schedule next poll with exponential backoff
      const baseDelay = 30000; // 30 seconds
      const maxDelay = 300000; // 5 minutes
      const delay = Math.min(
        baseDelay * Math.pow(1.5, connectionState.reconnectAttempts),
        maxDelay
      );

      pollTimeoutRef.current = setTimeout(pollForBlockStatus, delay);
    } catch (error: any) {
      console.error("❌ Block status poll failed:", error.message);

      // Retry with exponential backoff
      const retryDelay = Math.min(
        60000 * Math.pow(2, connectionState.reconnectAttempts),
        300000
      );
      pollTimeoutRef.current = setTimeout(pollForBlockStatus, retryDelay);
    }
  }, [userId, connectionState.reconnectAttempts]);

  // 🎯 ENHANCED: Connection management with retry logic
  const connectToBlockDetection = useCallback(() => {
    if (!userId || connectionState.isConnecting || blockProcessedRef.current) {
      return;
    }

    console.log("🔌 Starting enhanced block detection connection", {
      userId,
      attempt: connectionState.reconnectAttempts + 1,
    });

    setConnectionState((prev) => ({ ...prev, isConnecting: true }));

    const socketConnection = io(
      `${import.meta.env.VITE_API_URL}/notifications`,
      {
        withCredentials: true,
        transports: ["websocket", "polling"], // ✅ Multiple transports
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 30000,
        maxReconnectionAttempts: 10,
        timeout: 10000,
      }
    );

    // 🎯 CONNECTION: Success handler
    socketConnection.on("connect", () => {
      console.log("✅ Block detection socket connected:", socketConnection.id);

      setConnectionState((prev) => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        lastConnected: new Date(),
        reconnectAttempts: 0,
      }));

      // Test connection immediately
      socketConnection.emit("testBlockConnection", (response: any) => {
        console.log("🧪 Block detection test response:", response);
      });

      // Clear any pending reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Stop polling since WebSocket is working
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
    });

    // 🎯 CONNECTION: Error handler
    socketConnection.on("connect_error", (error) => {
      console.error("❌ Block detection socket error:", error.message);

      setConnectionState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        reconnectAttempts: prev.reconnectAttempts + 1,
      }));

      // Start HTTP polling as fallback
      if (!pollTimeoutRef.current) {
        console.log("🔄 Starting HTTP polling fallback");
        pollForBlockStatus();
      }
    });

    // 🎯 CONNECTION: Disconnect handler
    socketConnection.on("disconnect", (reason) => {
      console.log("🔌 Block detection socket disconnected:", reason);

      setConnectionState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
      }));

      // If not user-initiated, start fallback polling
      if (reason !== "io client disconnect" && !blockProcessedRef.current) {
        console.log("🔄 Auto-disconnect detected, starting fallback");
        pollForBlockStatus();
      }
    });

    // 🎯 BLOCK: Primary block detection event
    socketConnection.on("account_blocked", (data: BlockedData) => {
      if (blockProcessedRef.current) {
        console.log("🚨 Duplicate block notification ignored");
        return;
      }

      console.log("🚨 Account blocked notification received:", data);
      blockProcessedRef.current = true;

      setIsBlocked(true);
      setBlockData(data);
      setConnectionState((prev) => ({ ...prev, hasReceivedBlock: true }));

      // Immediate logout and redirect
      handleBlockedAccount(data);
    });

    // 🎯 BLOCK: Force disconnect event (fallback)
    socketConnection.on("force_disconnect_user", (data: any) => {
      if (data.userId === userId && !blockProcessedRef.current) {
        console.log("🚨 Force disconnect received:", data);
        blockProcessedRef.current = true;

        const blockInfo: BlockedData = {
          reason: data.reason || "Account suspended",
          category: "terms_violation",
          adminEmail: "sreekuttan12kaathu@gmail.com",
          timestamp: data.timestamp || new Date().toISOString(),
          canAppeal: true,
          severity: "medium",
        };

        setIsBlocked(true);
        setBlockData(blockInfo);
        handleBlockedAccount(blockInfo);
      }
    });

    // 🎯 DEBUG: Listen to all events for troubleshooting
    socketConnection.onAny((eventName, ...args) => {
      if (eventName.includes("block") || eventName.includes("disconnect")) {
        console.log(`🔍 Block detection event: ${eventName}`, args);
      }
    });

    setSocket(socketConnection);

    return () => {
      console.log("🧹 Cleaning up block detection connection");
      socketConnection.disconnect();
    };
  }, [
    userId,
    connectionState.isConnecting,
    connectionState.reconnectAttempts,
    pollForBlockStatus,
  ]);

  // 🎯 ENHANCED: Block handling with immediate action
  const handleBlockedAccount = async (data: BlockedData) => {
    try {
      console.log("🚨 Processing account block:", {
        reason: data.reason,
        category: data.category,
        severity: data.severity,
      });

      // Clear all timeouts
      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);

      // Disconnect socket
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      // Immediate logout
      try {
        await logout();
        console.log("✅ Logout completed successfully");
      } catch (logoutError) {
        console.error("❌ Logout failed:", logoutError);
        // Continue with redirect even if logout fails
      }

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Navigate to blocked page
      navigate("/blocked", {
        state: { blockData: data },
        replace: true, // Prevent back navigation
      });
    } catch (error: any) {
      console.error("❌ Error processing block:", error);
      // Force redirect even if processing fails
      window.location.href = "/blocked";
    }
  };

  // 🎯 MAIN: Initialize block detection
  useEffect(() => {
    console.log("🔄 useBlockDetection useEffect triggered", {
      userId,
      hasUserId: !!userId,
      timestamp: new Date().toISOString(),
    });
    if (!userId) {
      console.log("👤 No userId provided, skipping block detection");
      return;
    }

    console.log("🔍 Initializing enhanced block detection for user:", userId);

    const cleanup = connectToBlockDetection();

    return () => {
      console.log("🧹 Block detection cleanup for user:", userId);

      // Clear all timeouts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }

      // Cleanup socket connection
      if (cleanup) cleanup();
    };
  }, [userId]);

  // 🎯 CLEANUP: Component unmount
  useEffect(() => {
    return () => {
      console.log("🧹 useBlockDetection: Component unmounting");

      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);

      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return {
    isBlocked,
    blockData,
    socket,
    connectionState,
    isConnected: connectionState.isConnected,
  };
};
