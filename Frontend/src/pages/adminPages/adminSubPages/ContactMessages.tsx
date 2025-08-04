// // src/pages/adminPages/adminSubPages/ContactMessages.tsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { clearContactNotifications } from "@/redux/slices/adminSlice";
// import {
//   getContactMessages,
//   getContactStatistics,
//   markMessagesAsSeen,
//   searchContactMessages,
//   bulkUpdateStatus,
// } from "@/services/contactServices";
// import {
//   ContactMessage,
//   ContactStatistics,
//   ContactFilters,
// } from "@/types/contact";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Search,
//   Filter,
//   Eye,
//   MessageSquare,
//   User,
//   Clock,
//   ChevronLeft,
//   ChevronRight,
//   Loader,
// } from "lucide-react";
// import { toast } from "react-hot-toast";

// const ContactMessages: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // State
//   const [messages, setMessages] = useState<ContactMessage[]>([]);
//   const [statistics, setStatistics] = useState<ContactStatistics | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const limit = 20;

//   // Filters
//   const [filters, setFilters] = useState<ContactFilters>({});
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     // Clear notifications when component mounts
//     dispatch(clearContactNotifications());

//     fetchMessages();
//     fetchStatistics();
//   }, [currentPage, filters, dispatch]);

//   const fetchMessages = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: currentPage,
//         limit,
//         ...filters,
//         search: searchQuery,
//       };

//       const response = await getContactMessages(params);

//       if (response.success) {
//         setMessages(response.data);
//         setTotalPages(response.pagination.totalPages);
//         setTotalItems(response.pagination.totalItems);

//         // Mark unseen messages as seen
//         const unseenMessages = response.data
//           .filter((msg: ContactMessage) => !msg.isSeen)
//           .map((msg: ContactMessage) => msg._id!)
//           .filter(Boolean);

//         if (unseenMessages.length > 0) {
//           await markMessagesAsSeen(unseenMessages);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch messages:", error);
//       toast.error("Failed to fetch messages");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStatistics = async () => {
//     try {
//       const response = await getContactStatistics();
//       if (response.success) {
//         setStatistics(response.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch statistics:", error);
//     }
//   };

//   const handleSearch = async () => {
//     if (searchQuery.trim()) {
//       try {
//         setLoading(true);
//         const response = await searchContactMessages(
//           searchQuery,
//           currentPage,
//           limit
//         );

//         if (response.success) {
//           setMessages(response.data);
//           setTotalPages(response.pagination.totalPages);
//           setTotalItems(response.pagination.totalItems);
//         }
//       } catch (error) {
//         console.error("Search failed:", error);
//         toast.error("Search failed");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       fetchMessages();
//     }
//   };

//   const handleFilterChange = (key: keyof ContactFilters, value: any) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value === "all" ? undefined : value,
//     }));
//     setCurrentPage(1);
//   };

//   const handleSelectMessage = (messageId: string) => {
//     setSelectedMessages((prev) =>
//       prev.includes(messageId)
//         ? prev.filter((id) => id !== messageId)
//         : [...prev, messageId]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedMessages.length === messages.length) {
//       setSelectedMessages([]);
//     } else {
//       setSelectedMessages(messages.map((msg) => msg._id!));
//     }
//   };
//   const handleBulkStatusUpdate = async (status: string) => {
//     if (selectedMessages.length === 0) {
//       toast.error("Please select messages to update");
//       return;
//     }

//     try {
//       await bulkUpdateStatus(selectedMessages, status);
//       toast.success(`${selectedMessages.length} messages updated to ${status}`);
//       setSelectedMessages([]);
//       fetchMessages();
//       fetchStatistics();
//     } catch (error) {
//       console.error("Bulk update failed:", error);
//       toast.error("Failed to update messages");
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "new":
//         return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
//       case "in_progress":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
//       case "resolved":
//         return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
//       case "archived":
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
//     }
//   };

//   const getPriorityBadge = (priority: string) => {
//     switch (priority) {
//       case "high":
//         return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
//       case "medium":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
//       case "low":
//         return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
//     }
//   };

//   const getUserStatusBadge = (isRegisteredUser: boolean) => {
//     return isRegisteredUser ? (
//       <div className="flex items-center space-x-1">
//         <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//         <span className="text-xs text-green-600 dark:text-green-400">
//           Registered
//         </span>
//       </div>
//     ) : (
//       <div className="flex items-center space-x-1">
//         <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
//         <span className="text-xs text-yellow-600 dark:text-yellow-400">
//           Guest
//         </span>
//       </div>
//     );
//   };

//   const formatDate = (dateString: string | Date) => {
//     return new Date(dateString).toLocaleString();
//   };

//   return (
//     <div className="flex-1 ml-24 p-8 bg-white">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Contact Messages
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Manage and respond to customer inquiries
//           </p>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       {statistics && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-2">
//                 <MessageSquare className="w-8 h-8 text-blue-500" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                     Total Messages
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-white">
//                     {statistics.totalMessages}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-2">
//                 <Eye className="w-8 h-8 text-green-500" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                     New Messages
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-white">
//                     {statistics.unseenCount}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-2">
//                 <Clock className="w-8 h-8 text-yellow-500" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                     In Progress
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-white">
//                     {statistics.inProgressMessages}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-2">
//                 <User className="w-8 h-8 text-purple-500" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                     Registered Users
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-white">
//                     {statistics.registeredUserMessages}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Search and Filters */}
//       <Card className="mb-4">
//         <CardContent className="p-4">
//           <div className="flex flex-col space-y-4">
//             {/* Search Bar */}
//             <div className="flex space-x-2">
//               <div className="flex-1">
//                 <Input
//                   placeholder="Search messages by name, email, subject..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && handleSearch()}
//                 />
//               </div>
//               <Button onClick={handleSearch}>
//                 <Search className="w-4 h-4 mr-2" />
//                 Search
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => setShowFilters(!showFilters)}
//               >
//                 <Filter className="w-4 h-4 mr-2" />
//                 Filters
//               </Button>
//             </div>

//             {/* Filters */}
//             {showFilters && (
//               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                 <div>
//                   <Label htmlFor="status-filter">Status</Label>
//                   <Select
//                     onValueChange={(value) =>
//                       handleFilterChange("status", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="All Statuses" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-white">
//                       <SelectItem value="all">All Statuses</SelectItem>
//                       <SelectItem value="new">New</SelectItem>
//                       <SelectItem value="in_progress">In Progress</SelectItem>
//                       <SelectItem value="resolved">Resolved</SelectItem>
//                       <SelectItem value="archived">Archived</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label htmlFor="priority-filter">Priority</Label>
//                   <Select
//                     onValueChange={(value) =>
//                       handleFilterChange("priority", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="All Priorities" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-white">
//                       <SelectItem value="all">All Priorities</SelectItem>
//                       <SelectItem value="high">High</SelectItem>
//                       <SelectItem value="medium">Medium</SelectItem>
//                       <SelectItem value="low">Low</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label htmlFor="inquiry-filter">Inquiry Type</Label>
//                   <Select
//                     onValueChange={(value) =>
//                       handleFilterChange("inquiryType", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="All Types" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-white">
//                       <SelectItem value="all">All Types</SelectItem>
//                       <SelectItem value="general">General</SelectItem>
//                       <SelectItem value="mentorship">Mentorship</SelectItem>
//                       <SelectItem value="courses">Courses</SelectItem>
//                       <SelectItem value="partnership">Partnership</SelectItem>
//                       <SelectItem value="support">Support</SelectItem>
//                       <SelectItem value="feedback">Feedback</SelectItem>
//                       <SelectItem value="media">Media</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label htmlFor="user-filter">User Type</Label>
//                   <Select
//                     onValueChange={(value) =>
//                       handleFilterChange(
//                         "isRegisteredUser",
//                         value === "registered"
//                       )
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="All Users" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-white">
//                       <SelectItem value="all">All Users</SelectItem>
//                       <SelectItem value="registered">Registered</SelectItem>
//                       <SelectItem value="guest">Guest</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="flex items-end">
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       setFilters({});
//                       setSearchQuery("");
//                       setCurrentPage(1);
//                     }}
//                   >
//                     Clear Filters
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Bulk Actions */}
//       {selectedMessages.length > 0 && (
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">
//                 {selectedMessages.length} message(s) selected
//               </span>
//               <div className="flex space-x-2">
//                 <Button
//                   size="sm"
//                   onClick={() => handleBulkStatusUpdate("in_progress")}
//                 >
//                   Mark In Progress
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={() => handleBulkStatusUpdate("resolved")}
//                 >
//                   Mark Resolved
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => handleBulkStatusUpdate("archived")}
//                 >
//                   Archive
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Messages Table */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>Messages ({totalItems})</CardTitle>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 checked={
//                   selectedMessages.length === messages.length &&
//                   messages.length > 0
//                 }
//                 onCheckedChange={handleSelectAll}
//               />
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 Select All
//               </span>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="flex items-center justify-center py-8">
//               <Loader className="w-8 h-8 animate-spin text-blue-500" />
//             </div>
//           ) : messages.length === 0 ? (
//             <div className="text-center py-8">
//               <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//                 No messages found
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 {searchQuery || Object.keys(filters).length > 0
//                   ? "Try adjusting your search or filters"
//                   : "Contact messages will appear here when users submit inquiries"}
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {messages.map((message) => (
//                 <div
//                   key={message._id}
//                   className={`border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
//                     !message.isSeen
//                       ? "border-blue-200 bg-blue-50/30 dark:bg-blue-900/10"
//                       : "border-gray-200 dark:border-gray-700"
//                   }`}
//                   onClick={() => navigate(`/admin/messages/${message._id}`)}
//                 >
//                   <div className="flex items-start space-x-4">
//                     <Checkbox
//                       checked={selectedMessages.includes(message._id!)}
//                       onCheckedChange={() => handleSelectMessage(message._id!)}
//                       onClick={(e) => e.stopPropagation()}
//                     />

//                     <div className="flex-1 space-y-2">
//                       {/* Header */}
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                           <h3 className="font-semibold text-gray-900 dark:text-white">
//                             {message.name}
//                           </h3>
//                           {getUserStatusBadge(message.isRegisteredUser)}
//                           {!message.isRead && (
//                             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                           )}
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(
//                               message.priority
//                             )}`}
//                           >
//                             {message.priority}
//                           </span>
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
//                               message.status
//                             )}`}
//                           >
//                             {message.status.replace("_", " ")}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Content */}
//                       <div>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           {message.email}
//                         </p>
//                         <p className="font-medium text-gray-900 dark:text-white">
//                           {message.subject}
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
//                           {message.message}
//                         </p>
//                       </div>

//                       {/* Footer */}
//                       <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
//                         <div className="flex items-center space-x-4">
//                           <span>Type: {message.inquiryType}</span>
//                           <span>Contact: {message.preferredContact}</span>
//                           {message.responses &&
//                             message.responses.length > 0 && (
//                               <span className="text-green-600 dark:text-green-400">
//                                 {message.responses.length} response(s)
//                               </span>
//                             )}
//                         </div>
//                         <span>{formatDate(message.createdAt!)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between">
//           <div className="text-sm text-gray-600 dark:text-gray-400">
//             Showing {(currentPage - 1) * limit + 1} to{" "}
//             {Math.min(currentPage * limit, totalItems)} of {totalItems} messages
//           </div>
//           <div className="flex items-center space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//             >
//               <ChevronLeft className="w-4 h-4" />
//               Previous
//             </Button>
//             <span className="text-sm font-medium">
//               Page {currentPage} of {totalPages}
//             </span>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//             >
//               Next
//               <ChevronRight className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContactMessages;
// src/pages/adminPages/adminSubPages/ContactMessages.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearContactNotifications } from "@/redux/slices/adminSlice";
import {
  getContactMessages,
  getContactStatistics,
  markMessagesAsSeen,
  searchContactMessages,
  bulkUpdateStatus,
} from "@/services/contactServices";
import {
  ContactMessage,
  ContactStatistics,
  ContactFilters,
} from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader,
  RotateCcw,
  ArrowLeft,
  Download,
  Star,
  AlertTriangle,
  CheckCircle,
  Zap,
  TrendingUp,
  Activity,
  Mail,
} from "lucide-react";
import { toast } from "react-hot-toast";

const ContactMessages: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [statistics, setStatistics] = useState<ContactStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 20;

  // Filters
  const [filters, setFilters] = useState<ContactFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Clear notifications when component mounts
    dispatch(clearContactNotifications());

    fetchMessages();
    fetchStatistics();
  }, [currentPage, filters, dispatch]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        ...filters,
        search: searchQuery,
      };

      const response = await getContactMessages(params);

      if (response.success) {
        setMessages(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);

        // Mark unseen messages as seen
        const unseenMessages = response.data
          .filter((msg: ContactMessage) => !msg.isSeen)
          .map((msg: ContactMessage) => msg._id!)
          .filter(Boolean);

        if (unseenMessages.length > 0) {
          await markMessagesAsSeen(unseenMessages);
        }
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getContactStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        setSearching(true);
        const response = await searchContactMessages(
          searchQuery,
          currentPage,
          limit
        );

        if (response.success) {
          setMessages(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalItems(response.pagination.totalItems);
        }
      } catch (error) {
        console.error("Search failed:", error);
        toast.error("Search failed");
      } finally {
        setSearching(false);
      }
    } else {
      fetchMessages();
    }
  };

  const handleFilterChange = (key: keyof ContactFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
    setCurrentPage(1);
  };

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map((msg) => msg._id!));
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedMessages.length === 0) {
      toast.error("Please select messages to update");
      return;
    }

    try {
      await bulkUpdateStatus(selectedMessages, status);
      toast.success(`${selectedMessages.length} messages updated to ${status}`);
      setSelectedMessages([]);
      fetchMessages();
      fetchStatistics();
    } catch (error) {
      console.error("Bulk update failed:", error);
      toast.error("Failed to update messages");
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-3 h-3" />;
      case "medium":
        return <Clock className="w-3 h-3" />;
      case "low":
        return <CheckCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getUserStatusBadge = (isRegisteredUser: boolean) => {
    return isRegisteredUser ? (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
        <span className="text-xs text-emerald-600 font-medium">Registered</span>
      </div>
    ) : (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
        <span className="text-xs text-amber-600 font-medium">Guest</span>
      </div>
    );
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString();
  };

  const formatRelativeTime = (dateString: string | Date) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const hasActiveFilters =
    Object.values(filters).some((value) => value !== undefined) || searchQuery;

  return (
    <div className="flex-1 ml-24 p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Modern Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Contact Messages
              </h1>
              <p className="text-gray-600 mt-1 font-medium">
                Manage and respond to customer inquiries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Messages
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {statistics.totalMessages}
                </p>
                <div className="flex items-center text-sm text-emerald-600 mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  New Messages
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {statistics.unseenCount}
                </p>
                <div className="flex items-center text-sm text-blue-600 mt-2">
                  <Activity className="w-4 h-4 mr-1" />
                  <span>Requires attention</span>
                </div>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Eye className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {statistics.inProgressMessages}
                </p>
                <div className="flex items-center text-sm text-amber-600 mt-2">
                  <Zap className="w-4 h-4 mr-1" />
                  <span>Being processed</span>
                </div>
              </div>
              <div className="bg-amber-100 p-3 rounded-xl">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Registered Users
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {statistics.registeredUserMessages}
                </p>
                <div className="flex items-center text-sm text-purple-600 mt-2">
                  <Star className="w-4 h-4 mr-1" />
                  <span>Premium customers</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <User className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Search & Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Search & Filter Messages
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? "Hide" : "Show"} Filters</span>
            </button>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, email, subject, or message content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
            />
            {searching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
              {/* Status Filter */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </Label>
                <Select
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">🆕 New</SelectItem>
                    <SelectItem value="in_progress">⚡ In Progress</SelectItem>
                    <SelectItem value="resolved">✅ Resolved</SelectItem>
                    <SelectItem value="archived">📁 Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Filter */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleFilterChange("priority", value)
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">🔴 High Priority</SelectItem>
                    <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                    <SelectItem value="low">🟢 Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Inquiry Type Filter */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Inquiry Type
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleFilterChange("inquiryType", value)
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="general">💬 General</SelectItem>
                    <SelectItem value="mentorship">🎓 Mentorship</SelectItem>
                    <SelectItem value="courses">📚 Courses</SelectItem>
                    <SelectItem value="partnership">🤝 Partnership</SelectItem>
                    <SelectItem value="support">🛠️ Support</SelectItem>
                    <SelectItem value="feedback">💭 Feedback</SelectItem>
                    <SelectItem value="media">📺 Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Type Filter */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleFilterChange(
                      "isRegisteredUser",
                      value === "registered"
                    )
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="registered">
                      👤 Registered Users
                    </SelectItem>
                    <SelectItem value="guest">👥 Guest Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Results Summary & Clear Filters */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">
                    {totalItems}
                  </span>{" "}
                  message{totalItems !== 1 ? "s" : ""} found
                </span>
                <div className="flex gap-2">
                  {filters.status && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Status: {filters.status}
                    </span>
                  )}
                  {filters.priority && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      Priority: {filters.priority}
                    </span>
                  )}
                  {filters.inquiryType && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Type: {filters.inquiryType}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Bulk Actions */}
      {selectedMessages.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                {selectedMessages.length} message
                {selectedMessages.length !== 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => handleBulkStatusUpdate("in_progress")}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Mark In Progress
              </Button>
              <Button
                size="sm"
                onClick={() => handleBulkStatusUpdate("resolved")}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Mark Resolved
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatusUpdate("archived")}
              >
                Archive
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Messages List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Messages ({totalItems})
            </h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={
                  selectedMessages.length === messages.length &&
                  messages.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No messages found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery || Object.keys(filters).length > 0
                  ? "Try adjusting your search criteria or clearing filters to see more results."
                  : "Contact messages will appear here when users submit inquiries through your website."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`group relative border rounded-xl p-6 hover:shadow-md transition-all duration-200 cursor-pointer ${
                    !message.isSeen
                      ? "border-blue-200 bg-blue-50/30 hover:bg-blue-50/50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                  onClick={() => navigate(`/admin/messages/${message._id}`)}
                >
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={selectedMessages.includes(message._id!)}
                      onCheckedChange={() => handleSelectMessage(message._id!)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />

                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">
                              {message.name}
                            </h3>
                            {!message.isSeen && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          {getUserStatusBadge(message.isRegisteredUser)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(
                              message.priority
                            )}`}
                          >
                            {getPriorityIcon(message.priority)}
                            <span className="capitalize">
                              {message.priority}
                            </span>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                              message.status
                            )}`}
                          >
                            {message.status
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            {message.email}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900 mb-2">
                          {message.subject}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {message.message}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">
                            {message.inquiryType
                              ?.replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </span>
                          <span>Contact: {message.preferredContact}</span>
                          {message.responses &&
                            message.responses.length > 0 && (
                              <span className="text-emerald-600 font-medium">
                                {message.responses.length} response
                                {message.responses.length !== 1 ? "s" : ""}
                              </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {formatRelativeTime(message.createdAt!)}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>{formatDate(message.createdAt!)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {(currentPage - 1) * limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900">
              {Math.min(currentPage * limit, totalItems)}
            </span>{" "}
            of <span className="font-semibold text-gray-900">{totalItems}</span>{" "}
            messages
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-white border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="bg-white border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
