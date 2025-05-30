// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import {
//   getUnreadNotifications,
//   initializeNotifications,
//   cleanupNotifications,
//   markNotificationAsRead,
// } from "../../services/userServices";
// import { useNavigate } from "react-router-dom";
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";

// interface NotificationData {
//   _id: string;
//   recipient: string;
//   sender?: { firstName: string; lastName: string };
//   type: "payment" | "booking" | "chat";
//   content: string;
//   link?: string;
//   isRead: boolean;
//   createdAt: string;
// }

// interface NotificationProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// const Notification: React.FC<NotificationProps> = ({ open, onOpenChange }) => {
//   const [notifications, setNotifications] = useState<NotificationData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { user, accessToken } = useSelector((state: RootState) => state.user);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!open || !user || !accessToken) return;

//     setLoading(true);
//     setError(null);

//     const fetchNotifications = async () => {
//       try {
//         const data = await getUnreadNotifications();
//         console.log("Fetched notifications:", JSON.stringify(data, null, 2));
//         setNotifications(data);
//       } catch (error: any) {
//         console.error("Failed to fetch notifications:", error.message);
//         setError(error.message || "Failed to fetch notifications");
//         toast.error(error.message || "Failed to fetch notifications");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();

//     const initializeSocket = (retryCount = 0) => {
//       const maxRetries = 3;
//       try {
//         initializeNotifications(user._id, (notification) => {
//           console.log(
//             "Received live notification:",
//             JSON.stringify(notification, null, 2)
//           );
//           setNotifications((prev) => {
//             if (prev.some((n) => n._id === notification._id)) {
//               return prev;
//             }
//             return [notification, ...prev];
//           });
//           toast.success(
//             `New notification: ${notification.content || "No content"}`
//           );
//         });
//       } catch (error: any) {
//         console.error(
//           "Failed to initialize live notifications:",
//           error.message
//         );
//         if (retryCount < maxRetries) {
//           console.log(
//             `Retrying socket initialization (attempt ${retryCount + 1})`
//           );
//           setTimeout(() => initializeSocket(retryCount + 1), 5000);
//         } else {
//           setError("Unable to connect to live notifications");
//           toast.error("Unable to connect to live notifications");
//         }
//       }
//     };

//     initializeSocket();

//     return () => {
//       cleanupNotifications();
//     };
//   }, [open, user, accessToken]);

//   const handleMarkAsRead = async (notificationId: string) => {
//     try {
//       await markNotificationAsRead(notificationId);
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
//       );
//     } catch (error: any) {
//       console.error("Failed to mark notification as read:", error.message);
//       toast.error("Failed to mark notification as read");
//     }
//   };

//   const handleNotificationClick = (link?: string) => {
//     if (link) {
//       navigate(link);
//       onOpenChange(false);
//     }
//   };

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent
//         side="right"
//         className="pr-0 gap-0 bg-white dark:bg-gray-800"
//         style={{ width: "30vw", maxWidth: "800px" }}
//       >
//         <SheetHeader>
//           <SheetTitle>Notifications</SheetTitle>
//           <SheetDescription>
//             {notifications.length === 0 && !loading && !error
//               ? "No new notifications"
//               : "Your latest notifications"}
//           </SheetDescription>
//         </SheetHeader>
//         <div className="py-4 space-y-4">
//           {loading ? (
//             <p className="text-gray-500">Loading notifications...</p>
//           ) : error ? (
//             <p className="text-red-500">{error}</p>
//           ) : notifications.length === 0 ? (
//             <p className="text-gray-500">No notifications</p>
//           ) : (
//             notifications.map((notification) => (
//               <div
//                 key={notification._id}
//                 className={`p-3 rounded-lg cursor-pointer transition-colors ${
//                   notification.isRead
//                     ? "bg-gray-100 dark:bg-gray-700"
//                     : "bg-blue-50 dark:bg-blue-900"
//                 }`}
//                 onClick={() => handleNotificationClick(notification.link)}
//               >
//                 <p className="text-sm text-gray-800 dark:text-gray-200">
//                   {notification.sender
//                     ? `${notification.sender.firstName} ${notification.sender.lastName}: `
//                     : ""}
//                   {notification.content || "No content available"}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {new Date(notification.createdAt).toLocaleString()}
//                 </p>
//                 {!notification.isRead && (
//                   <Button
//                     variant="link"
//                     size="sm"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleMarkAsRead(notification._id);
//                     }}
//                     className="text-blue-500 text-sm mt-1 p-0 hover:underline"
//                   >
//                     Mark as Read
//                   </Button>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//         <SheetClose asChild>
//           <Button variant="outline" className="mt-4 w-full">
//             Close
//           </Button>
//         </SheetClose>
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default Notification;
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
        console.log("Fetched notifications:", JSON.stringify(data, null, 2));
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
      navigate(link);
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="pr-0 gap-0 bg-white dark:bg-gray-800"
        style={{ width: "30vw", maxWidth: "800px", minWidth: "300px" }}
      >
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            {notifications.length === 0 && !loading && !error
              ? "No new notifications"
              : "Your latest notifications"}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 py-4 max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scroll-smooth">
          {loading ? (
            <p className="text-gray-500">Loading notifications...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : notifications.length === 0 ? (
            <p className="text-gray-500">No notifications</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    notification.isRead
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "bg-blue-50 dark:bg-blue-900"
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
                    {new Date(notification.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  {!notification.isRead && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification._id);
                      }}
                      className="text-blue-500 text-sm mt-1 p-0 hover:underline"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="px-4 pb-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Notification;
