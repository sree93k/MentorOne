// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import {
//   initializeNotifications,
//   cleanupNotifications,
//   markNotificationAsRead,
//   markAllNotificationsAsRead,
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
// import { Bell } from "lucide-react";
// import { checkAuthStatus } from "@/utils/auth";
// import {
//   markAllNotificationsAsRead as markAllAsReadAction,
//   markNotificationAsRead as markAsReadAction,
// } from "@/redux/slices/userSlice";

// interface NotificationData {
//   _id: string;
//   recipient: string;
//   sender?: { firstName: string; lastName: string };
//   type: "payment" | "booking" | "chat" | "meeting" | "contact_response";
//   content: string;
//   link?: string;
//   isRead: boolean;
//   isSeen: boolean; // ✅ NEW FIELD
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
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

//   const { user } = useSelector((state: RootState) => state.user);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // ✅ Helper function to determine current role
//   const getCurrentRole = (): "mentor" | "mentee" => {
//     return window.location.pathname.includes("/expert/") ? "mentor" : "mentee";
//   };

//   // ✅ Fetch notifications function
//   const fetchNotifications = async (page = 1) => {
//     try {
//       setLoading(true);
//       const currentRole = getCurrentRole();

//       console.log(`🔔 Fetching ${currentRole} notifications - Page ${page}`);

//       const response = await fetch(
//         `${
//           import.meta.env.VITE_API_URL
//         }/user/notifications/unread?role=${currentRole}&page=${page}&limit=12`,
//         {
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch notifications");

//       const data = await response.json();
//       const newNotifications = data.data || [];

//       console.log(
//         `📊 Fetched ${newNotifications.length} notifications for ${currentRole}`
//       );

//       if (page === 1) {
//         setNotifications(newNotifications);
//       } else {
//         setNotifications((prev) => [...prev, ...newNotifications]);
//       }

//       setHasMore(newNotifications.length === 12);
//     } catch (error: any) {
//       console.error("Failed to fetch notifications:", error);
//       setError(error.message || "Failed to fetch notifications");
//       toast.error(error.message || "Failed to fetch notifications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Load more function
//   const loadMore = () => {
//     if (!loading && hasMore) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   // ✅ Handle scroll for pagination
//   const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
//     const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

//     if (scrollHeight - scrollTop <= clientHeight + 50) {
//       loadMore();
//     }
//   };

//   // ✅ Pagination effect
//   useEffect(() => {
//     if (currentPage > 1) {
//       fetchNotifications(currentPage);
//     }
//   }, [currentPage]);

//   // ✅ Main initialization effect
//   useEffect(() => {
//     const isAuthenticated = checkAuthStatus();

//     if (!open || !user || !isAuthenticated) {
//       console.log("🔍 Notification component: Skipping fetch", {
//         open,
//         hasUser: !!user,
//         isAuthenticated,
//       });
//       return;
//     }

//     console.log("🔔 Notification panel opened, initializing...");

//     // Reset state
//     setError(null);
//     setCurrentPage(1);
//     setHasMore(true);

//     // Fetch initial notifications
//     fetchNotifications(1);

//     // Initialize socket for real-time notifications
//     const initializeSocket = (retryCount = 0) => {
//       const maxRetries = 3;
//       try {
//         console.log("🔍 Initializing notification socket for user:", user._id);
//         initializeNotifications(user._id, (notification) => {
//           console.log("📨 Received live notification:", notification);

//           // Only add if it matches current role
//           const currentRole = getCurrentRole();
//           if (
//             notification.targetRole === currentRole ||
//             notification.targetRole === "both"
//           ) {
//             setNotifications((prev) => {
//               if (prev.some((n) => n._id === notification._id)) {
//                 return prev;
//               }
//               return [notification, ...prev];
//             });
//             toast.success(
//               `New notification: ${notification.content || "No content"}`
//             );
//           }
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
//   }, [open, user]);

//   // ✅ Handle individual mark as read
//   const handleMarkAsRead = async (notificationId: string) => {
//     try {
//       await markNotificationAsRead(notificationId);

//       const currentRole = getCurrentRole();
//       dispatch(markAsReadAction({ role: currentRole }));

//       setNotifications((prev) =>
//         prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
//       );

//       toast.success("Notification marked as read");
//     } catch (error: any) {
//       console.error("Failed to mark notification as read:", error.message);
//       toast.error("Failed to mark notification as read");
//     }
//   };

//   // ✅ Handle mark all as read
//   const handleMarkAllAsRead = async () => {
//     if (!user || notifications.length === 0) return;

//     setMarkingAllAsRead(true);
//     try {
//       const currentRole = getCurrentRole();

//       console.log(`🔔 Marking all ${currentRole} notifications as read`);

//       await markAllNotificationsAsRead(currentRole);
//       dispatch(markAllAsReadAction({ role: currentRole }));

//       // Update local state - mark all as read
//       setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

//       toast.success("All notifications marked as read!");
//     } catch (error: any) {
//       console.error("Failed to mark all as read:", error);
//       toast.error("Failed to mark all as read");
//     } finally {
//       setMarkingAllAsRead(false);
//     }
//   };

//   const handleNotificationClick = (notification: NotificationData) => {
//     // Handle different notification types
//     switch (notification.type) {
//       case "meeting":
//         if (notification.link) {
//           navigate(notification.link);
//           onOpenChange(false);
//         }
//         break;

//       case "contact_response": // ✅ NEW: Handle contact response clicks
//         // Navigate to support/contact page or show a success message
//         navigate("/support"); // or "/contact" - wherever your support page is
//         onOpenChange(false);
//         toast.success("Check your email for the full response details!");
//         break;

//       case "booking":
//       case "payment":
//         // Handle other notification types as needed
//         if (notification.link) {
//           navigate(notification.link);
//           onOpenChange(false);
//         }
//         break;

//       default:
//         console.log(
//           "No specific handler for notification type:",
//           notification.type
//         );
//         break;
//     }
//   };

//   // ✅ Get notification visual style based on state
//   const getNotificationStyle = (notification: NotificationData) => {
//     if (notification.isRead) {
//       // Read notifications - dimmed
//       return "bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-300";
//     } else if (notification.isSeen) {
//       // Seen but unread - normal background
//       return "bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-400";
//     } else {
//       // New/unseen - bright background
//       return "bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-600 shadow-sm";
//     }
//   };
//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case "payment":
//         return "💰";
//       case "booking":
//         return "📅";
//       case "meeting":
//         return "🎥";
//       case "contact_response": // ✅ NEW: Contact response icon
//         return "📧";
//       default:
//         return "🔔";
//     }
//   };
//   // ✅ Get notification text style
//   const getNotificationTextStyle = (notification: NotificationData) => {
//     if (notification.isRead) {
//       return "text-gray-500 dark:text-gray-400";
//     } else if (notification.isSeen) {
//       return "text-gray-800 dark:text-gray-200";
//     } else {
//       return "text-gray-900 dark:text-white font-medium";
//     }
//   };

//   // ✅ Highlight sender name

//   // 4. Update the notification rendering to include icon:
//   const renderNotificationContent = (notification: NotificationData) => {
//     const senderName = notification.sender
//       ? `${notification.sender.firstName} ${notification.sender.lastName}`
//       : null;

//     return (
//       <div className="flex items-start gap-3">
//         {/* ✅ NEW: Add notification type icon */}
//         <span className="text-lg flex-shrink-0 mt-0.5">
//           {getNotificationIcon(notification.type)}
//         </span>

//         <div className="flex-1">
//           {senderName ? (
//             <span>
//               <span className="font-semibold text-blue-600 dark:text-blue-400">
//                 {senderName}
//               </span>
//               <span className="text-gray-600 dark:text-gray-300">: </span>
//               <span>{notification.content || "No content available"}</span>
//             </span>
//           ) : (
//             <span>{notification.content || "No content available"}</span>
//           )}
//         </div>
//       </div>
//     );
//   };
//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent
//         side="right"
//         className="pr-0 gap-0 bg-white dark:bg-gray-800"
//         style={{ width: "30vw", maxWidth: "800px", minWidth: "300px" }}
//       >
//         {/* ✅ UPDATED HEADER with Mark All as Read button */}
//         <SheetHeader className="px-4 pt-4">
//           <div className="flex justify-between items-center">
//             <SheetTitle className="flex flex-row gap-2">
//               <Bell />
//               Notifications
//             </SheetTitle>
//             {/* ✅ Mark All as Read Button */}
//             {notifications.some((n) => !n.isRead) && (
//               <button
//                 onClick={handleMarkAllAsRead}
//                 disabled={markingAllAsRead || notifications.length === 0}
//                 className="text-sm text-blue-500 hover:text-blue-700 disabled:text-gray-400 transition-colors font-medium"
//               >
//                 {markingAllAsRead ? "Marking..." : "Mark all as read"}
//               </button>
//             )}
//           </div>
//           <SheetDescription className="text-gray-500">
//             Stay updated with your latest activity
//           </SheetDescription>
//         </SheetHeader>

//         {/* ✅ UPDATED CONTENT with scroll and enhanced styling */}
//         <div
//           className="px-4 py-4 max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scroll-smooth"
//           onScroll={handleScroll}
//         >
//           {loading && currentPage === 1 ? (
//             <div className="flex justify-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//             </div>
//           ) : error ? (
//             <div className="text-center py-8">
//               <p className="text-red-500">{error}</p>
//             </div>
//           ) : notifications.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)] text-center animate-fade-in">
//               <div className="relative mb-4">
//                 <Bell className="w-16 h-16 text-gray-400" />
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse"></div>
//                 </div>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//                 No Notifications Yet
//               </h3>
//               <p className="text-sm text-gray-500 mt-2 max-w-xs">
//                 You're all caught up! Check back later for updates or start
//                 engaging with your mentors and mentees.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {notifications.map((notification) => (
//                 <div
//                   key={notification._id}
//                   className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${getNotificationStyle(
//                     notification
//                   )}`}
//                   onClick={() => handleNotificationClick(notification)}
//                 >
//                   <div
//                     className={`text-sm ${getNotificationTextStyle(
//                       notification
//                     )}`}
//                   >
//                     {renderNotificationContent(notification)}
//                   </div>

//                   <p className="text-xs text-gray-500 mt-2">
//                     {new Date(notification.createdAt).toLocaleString("en-US", {
//                       year: "numeric",
//                       month: "2-digit",
//                       day: "2-digit",
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       hour12: true,
//                     })}
//                   </p>

//                   {!notification.isRead && (
//                     <Button
//                       variant="link"
//                       size="sm"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleMarkAsRead(notification._id);
//                       }}
//                       className="text-blue-500 text-xs mt-2 p-0 hover:underline"
//                     >
//                       Mark as Read
//                     </Button>
//                   )}
//                 </div>
//               ))}

//               {/* ✅ Loading indicator for pagination */}
//               {loading && currentPage > 1 && (
//                 <div className="flex justify-center py-4">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
//                 </div>
//               )}

//               {/* ✅ End of list indicator */}
//               {!hasMore && notifications.length > 0 && (
//                 <div className="flex justify-center py-4">
//                   <span className="text-gray-400 text-sm">
//                     No more notifications
//                   </span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="px-4 pb-4">
//           <SheetClose asChild>
//             <Button variant="outline" className="w-full">
//               Close
//             </Button>
//           </SheetClose>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default Notification;
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store/store";
import {
  initializeNotifications,
  cleanupNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/userServices";
// import { useNavigate } from "react-router-dom"; // Assuming this is available in your app
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Calendar,
  DollarSign,
  Video,
  Mail,
  Sparkles,
  Clock,
  User,
  X,
  RefreshCw,
  Archive,
} from "lucide-react";
import { checkAuthStatus } from "@/utils/auth";
import {
  markAllNotificationsAsRead as markAllAsReadAction,
  markNotificationAsRead as markAsReadAction,
} from "@/redux/slices/userSlice";

interface NotificationData {
  _id: string;
  recipient: string;
  sender?: { firstName: string; lastName: string };
  type: "payment" | "booking" | "chat" | "meeting" | "contact_response";
  content: string;
  link?: string;
  isRead: boolean;
  isSeen: boolean;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const [hoveredNotification, setHoveredNotification] = useState<string | null>(
    null
  );

  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Helper function to determine current role
  const getCurrentRole = (): "mentor" | "mentee" => {
    return window.location.pathname.includes("/expert/") ? "mentor" : "mentee";
  };

  // Fetch notifications function
  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const currentRole = getCurrentRole();

      console.log(`🔔 Fetching ${currentRole} notifications - Page ${page}`);

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/user/notifications/unread?role=${currentRole}&page=${page}&limit=12`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();
      const newNotifications = data.data || [];

      console.log(
        `📊 Fetched ${newNotifications.length} notifications for ${currentRole}`
      );

      if (page === 1) {
        setNotifications(newNotifications);
      } else {
        setNotifications((prev) => [...prev, ...newNotifications]);
      }

      setHasMore(newNotifications.length === 12);
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      setError(error.message || "Failed to fetch notifications");
      toast.error(error.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  // Load more function
  const loadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Handle scroll for pagination
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight + 50) {
      loadMore();
    }
  };

  // Pagination effect
  useEffect(() => {
    if (currentPage > 1) {
      fetchNotifications(currentPage);
    }
  }, [currentPage]);

  // Main initialization effect
  useEffect(() => {
    const isAuthenticated = checkAuthStatus();

    if (!open || !user || !isAuthenticated) {
      console.log("🔍 Notification component: Skipping fetch", {
        open,
        hasUser: !!user,
        isAuthenticated,
      });
      return;
    }

    console.log("🔔 Notification panel opened, initializing...");

    setError(null);
    setCurrentPage(1);
    setHasMore(true);

    fetchNotifications(1);

    const initializeSocket = (retryCount = 0) => {
      const maxRetries = 3;
      try {
        console.log("🔍 Initializing notification socket for user:", user._id);
        initializeNotifications(user._id, (notification) => {
          console.log("📨 Received live notification:", notification);

          const currentRole = getCurrentRole();
          if (
            notification.targetRole === currentRole ||
            notification.targetRole === "both"
          ) {
            setNotifications((prev) => {
              if (prev.some((n) => n._id === notification._id)) {
                return prev;
              }
              return [notification, ...prev];
            });
            toast.success(
              `New notification: ${notification.content || "No content"}`
            );
          }
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
  }, [open, user]);

  // Handle individual mark as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);

      const currentRole = getCurrentRole();
      dispatch(markAsReadAction({ role: currentRole }));

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );

      toast.success("Notification marked as read");
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error.message);
      toast.error("Failed to mark notification as read");
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    if (!user || notifications.length === 0) return;

    setMarkingAllAsRead(true);
    try {
      const currentRole = getCurrentRole();

      console.log(`🔔 Marking all ${currentRole} notifications as read`);

      await markAllNotificationsAsRead(currentRole);
      dispatch(markAllAsReadAction({ role: currentRole }));

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      toast.success("All notifications marked as read!");
    } catch (error: any) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const handleNotificationClick = (notification: NotificationData) => {
    switch (notification.type) {
      case "meeting":
        if (notification.link) {
          navigate(notification.link);
          onOpenChange(false);
        }
        break;

      case "contact_response":
        navigate("/support");
        onOpenChange(false);
        toast.success("Check your email for the full response details!");
        break;

        break;

      default:
        console.log(
          "No specific handler for notification type:",
          notification.type
        );
        break;
    }
  };

  // Get notification icon component
  const getNotificationIcon = (type: string, isRead: boolean) => {
    const iconClass = `w-5 h-5 ${isRead ? "text-gray-400" : "text-white"}`;

    switch (type) {
      case "payment":
        return <DollarSign className={iconClass} />;
      case "booking":
        return <Calendar className={iconClass} />;
      case "meeting":
        return <Video className={iconClass} />;
      case "contact_response":
        return <Mail className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  // Get notification color theme
  const getNotificationTheme = (type: string) => {
    const themes = {
      payment: "from-emerald-500 to-emerald-600",
      booking: "from-blue-500 to-blue-600",
      meeting: "from-purple-500 to-purple-600",
      contact_response: "from-orange-500 to-orange-600",
      default: "from-indigo-500 to-indigo-600",
    };
    return themes[type] || themes.default;
  };

  // Get time ago string
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - notificationDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="p-0 gap-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 border-l border-gray-200 dark:border-gray-700"
        style={{ width: "38vw", maxWidth: "480px", minWidth: "380px" }}
      >
        {/* Modern Header */}
        <SheetHeader className="px-0 pt-0 sticky top-0 z-10">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BellRing className="w-6 h-6" />
                  </div>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                  )}
                </div>
                <div>
                  <SheetTitle className="text-white text-xl font-bold">
                    Notifications
                  </SheetTitle>
                  <SheetDescription className="text-white/80 text-sm">
                    {unreadCount > 0
                      ? `${unreadCount} unread messages`
                      : "You're all caught up!"}
                  </SheetDescription>
                </div>
              </div>

              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markingAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 backdrop-blur-sm"
                >
                  {markingAllAsRead ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCheck className="w-4 h-4" />
                  )}
                  Mark all read
                </button>
              )}

              <button
                onClick={() => fetchNotifications(1)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 backdrop-blur-sm"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </SheetHeader>

        {/* Content Area */}
        <div
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
          onScroll={handleScroll}
          style={{ height: "calc(100vh - 180px)" }}
        >
          {loading && currentPage === 1 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                <Sparkles className="w-6 h-6 text-indigo-600 absolute top-3 left-3" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Loading notifications...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                <X className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-600 dark:text-red-400 text-center font-medium">
                {error}
              </p>
              <button
                onClick={() => fetchNotifications(1)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="relative mb-6">
                <div className="p-6 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl">
                  <Bell className="w-12 h-12 text-indigo-400" />
                </div>
                <div className="absolute -top-1 -right-1 animate-bounce">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                All Clear! 🎉
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
                You're all caught up! No new notifications right now. We'll let
                you know when something important happens.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification, index) => (
                <div
                  key={notification._id}
                  className={`group relative transform transition-all duration-300 hover:scale-[1.05] ${
                    hoveredNotification === notification._id
                      ? "scale-[1.02]"
                      : ""
                  }`}
                  onMouseEnter={() => setHoveredNotification(notification._id)}
                  onMouseLeave={() => setHoveredNotification(null)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div
                    onClick={() => handleNotificationClick(notification)}
                    className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
                      notification.isRead
                        ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {/* Notification Content */}
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 p-2 rounded-xl bg-gradient-to-r ${getNotificationTheme(
                            notification.type
                          )} shadow-lg`}
                        >
                          {getNotificationIcon(
                            notification.type,
                            notification.isRead
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              {notification.sender && (
                                <div className="flex items-center gap-2 mb-1">
                                  <User className="w-3 h-3 text-gray-400" />
                                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                    {notification.sender.firstName}{" "}
                                    {notification.sender.lastName}
                                  </span>
                                </div>
                              )}
                              <p
                                className={`text-sm leading-relaxed ${
                                  notification.isRead
                                    ? "text-gray-600 dark:text-gray-400"
                                    : "text-gray-800 dark:text-gray-200 font-medium"
                                }`}
                              >
                                {notification.content || "No content available"}
                              </p>
                            </div>

                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0 mt-1"></div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{getTimeAgo(notification.createdAt)}</span>
                            </div>

                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification._id);
                                }}
                                className="opacity-40 group-hover:opacity-95 flex items-center gap-1 px-3 py-1 text-xs bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200"
                              >
                                <Check className="w-3 h-3" />
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              ))}

              {/* Loading more indicator */}
              {loading && currentPage > 1 && (
                <div className="flex justify-center py-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-200 border-t-indigo-600"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Loading more...
                    </span>
                  </div>
                </div>
              )}

              {/* End of list */}
              {!hasMore && notifications.length > 0 && (
                <div className="flex flex-col items-center py-8">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
                    <Archive className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    That's all for now!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <SheetClose asChild>
            <Button
              variant="outline"
              className="w-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 font-medium"
            >
              Close Notifications
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Notification;
