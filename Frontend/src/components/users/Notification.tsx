// src/components/notification.tsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  getUnreadNotifications,
  initializeNotifications,
  cleanupNotifications,
  markNotificationAsRead,
} from "../../services/userServices";
import { useNavigate } from "react-router-dom";

interface NotificationData {
  _id: string;
  recipient: string;
  sender?: { firstName: string; lastName: string };
  type: "payment" | "booking" | "chat";
  content: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Notification: React.FC<NotificationProps> = ({ open, onOpenChange }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, accessToken } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open || !user || !accessToken) return;

    setLoading(true);
    setError(null);

    const fetchNotifications = async () => {
      try {
        const data = await getUnreadNotifications();
        console.log("Fetched notifications:", JSON.stringify(data, null, 2)); // Detailed debug log
        setNotifications(data);
      } catch (error: any) {
        console.error("Failed to fetch notifications:", error.message);
        setError(error.message || "Failed to fetch notifications");
        toast.error(error.message || "Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const initializeSocket = (retryCount = 0) => {
      const maxRetries = 3;
      try {
        initializeNotifications(user._id, (notification) => {
          console.log(
            "Received live notification:",
            JSON.stringify(notification, null, 2)
          );
          setNotifications((prev) => {
            if (prev.some((n) => n._id === notification._id)) {
              return prev;
            }
            return [notification, ...prev];
          });
          toast.success(
            `New notification: ${notification.content || "No content"}`
          );
        });
      } catch (error: any) {
        console.error(
          "Failed to initialize live notifications:",
          error.message
        );
        if (retryCount < maxRetries) {
          console.log(
            `Retrying socket initialization (attempt ${retryCount + 1})`
          );
          setTimeout(() => initializeSocket(retryCount + 1), 5000);
        } else {
          setError("Unable to connect to live notifications");
          toast.error("Unable to connect to live notifications");
        }
      }
    };

    initializeSocket();

    return () => {
      cleanupNotifications();
    };
  }, [open, user, accessToken]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error.message);
      toast.error("Failed to mark notification as read");
    }
  };

  const handleNotificationClick = (link?: string) => {
    if (link) {
      // navigate(link); // Re-enable navigation
      onOpenChange(false);
    }
  };

  return (
    <div
      className={`fixed right-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: "300px" }}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
      <div className="p-4 space-y-4">
        {loading ? (
          <p>Loading notifications...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-3 rounded-lg cursor-pointer ${
                notification.isRead ? "bg-gray-100" : "bg-blue-100"
              }`}
              onClick={() => handleNotificationClick(notification.link)}
            >
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {notification.sender
                  ? `${notification.sender.firstName} ${notification.sender.lastName}: `
                  : ""}
                {notification.content || "No content available"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
              {!notification.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(notification._id);
                  }}
                  className="text-blue-500 text-sm mt-1 hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
