// src/hooks/useContactNotifications.ts
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  setContactNotifications,
  clearContactNotifications,
} from "@/redux/slices/adminSlice";
import { getContactStatistics } from "@/services/contactServices";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5002";

export const useContactNotifications = () => {
  const dispatch = useDispatch();
  const { contactNotifications } = useSelector(
    (state: RootState) => state.admin
  );
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to notification namespace
    const notificationSocket = io(`${SOCKET_URL}/notifications`, {
      withCredentials: true,
    });

    notificationSocket.on("connect", () => {
      console.log("📡 Connected to notification socket");
      setIsConnected(true);

      // Subscribe to contact notifications
      notificationSocket.emit("subscribe_contact_notifications", "admin");
    });

    notificationSocket.on("disconnect", () => {
      console.log("📡 Disconnected from notification socket");
      setIsConnected(false);
    });

    // Listen for new contact messages
    notificationSocket.on("new_contact_message", (data: any) => {
      console.log("📩 New contact message received:", data);

      // Update contact notification state
      dispatch(
        setContactNotifications({
          hasNewMessages: true,
          unseenCount: contactNotifications.unseenCount + 1,
          newMessageData: data,
        })
      );
    });

    // Listen for contact statistics updates
    notificationSocket.on("contact_statistics_update", (stats: any) => {
      console.log("📊 Contact statistics updated:", stats);

      dispatch(
        setContactNotifications({
          hasNewMessages: stats.hasNewMessages,
          unseenCount: stats.unseenCount,
          unreadCount: stats.unreadCount,
          totalMessages: stats.totalMessages,
        })
      );
    });

    // Listen for contact statistics
    notificationSocket.on("contact_statistics", (stats: any) => {
      console.log("📊 Contact statistics received:", stats);

      dispatch(
        setContactNotifications({
          hasNewMessages: stats.hasNewMessages,
          unseenCount: stats.unseenCount,
          unreadCount: stats.unreadCount,
          totalMessages: stats.totalMessages,
        })
      );
    });

    setSocket(notificationSocket);

    // Fetch initial statistics
    fetchContactStatistics();

    return () => {
      notificationSocket.emit("unsubscribe_contact_notifications", "admin");
      notificationSocket.disconnect();
    };
  }, []);

  const fetchContactStatistics = async () => {
    try {
      const response = await getContactStatistics();
      if (response.success) {
        dispatch(
          setContactNotifications({
            hasNewMessages: response.data.hasNewMessages,
            unseenCount: response.data.unseenCount,
            unreadCount: response.data.unreadCount,
            totalMessages: response.data.totalMessages,
          })
        );
      }
    } catch (error) {
      console.error("Failed to fetch contact statistics:", error);
    }
  };

  const clearNotifications = useCallback(() => {
    dispatch(clearContactNotifications());
  }, [dispatch]);

  const requestStatistics = useCallback(() => {
    if (socket) {
      socket.emit("request_contact_statistics");
    }
  }, [socket]);

  return {
    isConnected,
    clearNotifications,
    requestStatistics,
    fetchContactStatistics,
  };
};
