// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getContactMessage,
//   updateContactMessage,
//   addMessageResponse,
//   addInternalNote,
// } from "@/services/contactServices";
// import { ContactMessage } from "@/types/contact";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   ArrowLeft,
//   Mail,
//   Phone,
//   Calendar,
//   User,
//   MessageSquare,
//   Send,
//   Edit,
//   Clock,
//   AlertTriangle,
//   CheckCircle,
//   Archive,
//   UserCheck,
//   UserX,
//   FileText,
//   Plus,
// } from "lucide-react";
// import { toast } from "react-hot-toast";

// const ContactMessageDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const [message, setMessage] = useState<ContactMessage | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [responding, setResponding] = useState(false);
//   const [responseText, setResponseText] = useState("");
//   const [internalNote, setInternalNote] = useState("");
//   const [updating, setUpdating] = useState(false);
//   const [addingNote, setAddingNote] = useState(false);

//   useEffect(() => {
//     if (id) {
//       fetchMessage();
//     }
//   }, [id]);

//   const fetchMessage = async () => {
//     try {
//       setLoading(true);
//       const response = await getContactMessage(id!);
//       if (response.success) {
//         setMessage(response.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch message:", error);
//       toast.error("Failed to load message");
//       navigate("/admin/messages");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (newStatus: string) => {
//     try {
//       setUpdating(true);
//       const response = await updateContactMessage(id!, { status: newStatus });
//       if (response.success) {
//         setMessage(response.data);
//         toast.success("Status updated successfully");
//       }
//     } catch (error) {
//       console.error("Failed to update status:", error);
//       toast.error("Failed to update status");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handlePriorityChange = async (newPriority: string) => {
//     try {
//       setUpdating(true);
//       const response = await updateContactMessage(id!, {
//         priority: newPriority,
//       });
//       if (response.success) {
//         setMessage(response.data);
//         toast.success("Priority updated successfully");
//       }
//     } catch (error) {
//       console.error("Failed to update priority:", error);
//       toast.error("Failed to update priority");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleSendResponse = async () => {
//     if (!responseText.trim()) {
//       toast.error("Please enter a response message");
//       return;
//     }

//     try {
//       setResponding(true);
//       const response = await addMessageResponse(id!, responseText);
//       if (response.success) {
//         setMessage(response.data);
//         setResponseText("");
//         toast.success("Response sent successfully");
//       }
//     } catch (error) {
//       console.error("Failed to send response:", error);
//       toast.error("Failed to send response");
//     } finally {
//       setResponding(false);
//     }
//   };

//   const handleAddInternalNote = async () => {
//     if (!internalNote.trim()) {
//       toast.error("Please enter a note");
//       return;
//     }

//     try {
//       setAddingNote(true);
//       const response = await addInternalNote(id!, internalNote);
//       if (response.success) {
//         setMessage(response.data);
//         setInternalNote("");
//         toast.success("Internal note added successfully");
//       }
//     } catch (error) {
//       console.error("Failed to add note:", error);
//       toast.error("Failed to add note");
//     } finally {
//       setAddingNote(false);
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "new":
//         return <Clock className="w-5 h-5 text-blue-500" />;
//       case "in_progress":
//         return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
//       case "resolved":
//         return <CheckCircle className="w-5 h-5 text-green-500" />;
//       case "archived":
//         return <Archive className="w-5 h-5 text-gray-500" />;
//       default:
//         return <Clock className="w-5 h-5 text-gray-500" />;
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "high":
//         return "bg-red-500";
//       case "medium":
//         return "bg-yellow-500";
//       case "low":
//         return "bg-green-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const getUserStatusBadge = (isRegisteredUser: boolean) => {
//     if (isRegisteredUser) {
//       return (
//         <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
//           <UserCheck className="w-4 h-4" />
//           <span className="text-sm font-medium">Registered User</span>
//         </div>
//       );
//     } else {
//       return (
//         <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
//           <UserX className="w-4 h-4" />
//           <span className="text-sm font-medium">Guest User</span>
//         </div>
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!message) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//             Message not found
//           </h2>
//           <Button className="mt-4" onClick={() => navigate("/admin/messages")}>
//             Back to Messages
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 ml-24 p-8 bg-white">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center space-x-4">
//           <div className="space-y-2">
//             <div className="flex items-center">
//               <button
//                 className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 active:scale-95 shadow-sm"
//                 onClick={() => navigate(-1)}
//                 aria-label="Go back"
//               >
//                 <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
//               </button>
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Message Details
//           </h1>
//         </div>

//         <div className="flex items-center space-x-4">
//           {getStatusIcon(message.status)}
//           <Badge className={`${getPriorityColor(message.priority)} text-white`}>
//             {message.priority.toUpperCase()} PRIORITY
//           </Badge>
//           {getUserStatusBadge(message.isRegisteredUser)}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Message Content */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>{message.subject}</span>
//                 <Badge variant="outline">{message.inquiryType}</Badge>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
//                 {message.message}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Tabs for Responses and Notes */}
//           <Card>
//             <CardContent className="p-0">
//               <Tabs defaultValue="responses" className="w-full">
//                 <TabsList className="grid w-full grid-cols-2">
//                   <TabsTrigger value="responses">
//                     Responses ({message.responses?.length || 0})
//                   </TabsTrigger>
//                   <TabsTrigger value="notes">
//                     Internal Notes ({message.internalNotes?.length || 0})
//                   </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="responses" className="p-6">
//                   {/* Response History */}
//                   {message.responses && message.responses.length > 0 ? (
//                     <div className="space-y-4 mb-6">
//                       {message.responses.map((response, index) => (
//                         <div
//                           key={index}
//                           className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg"
//                         >
//                           <div className="flex items-center justify-between mb-2">
//                             <span className="font-semibold text-blue-700 dark:text-blue-300">
//                               {response.adminName}
//                             </span>
//                             <span className="text-sm text-gray-500 dark:text-gray-400">
//                               {new Date(response.createdAt).toLocaleString()}
//                             </span>
//                           </div>
//                           <p className="text-gray-700 dark:text-gray-300">
//                             {response.message}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 text-gray-500 dark:text-gray-400">
//                       No responses yet
//                     </div>
//                   )}

//                   {/* Response Form */}
//                   <div className="space-y-4">
//                     <div className="flex items-center space-x-2">
//                       <MessageSquare className="w-5 h-5" />
//                       <span className="font-medium">Send Response</span>
//                     </div>
//                     <Textarea
//                       placeholder="Type your response here..."
//                       value={responseText}
//                       onChange={(e) => setResponseText(e.target.value)}
//                       rows={6}
//                       className="resize-none"
//                     />
//                     <Button
//                       onClick={handleSendResponse}
//                       disabled={responding || !responseText.trim()}
//                       className="w-full"
//                     >
//                       {responding ? (
//                         <div className="flex items-center space-x-2">
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           <span>Sending...</span>
//                         </div>
//                       ) : (
//                         <div className="flex items-center space-x-2">
//                           <Send className="w-4 h-4" />
//                           <span>Send Response</span>
//                         </div>
//                       )}
//                     </Button>
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="notes" className="p-6">
//                   {/* Internal Notes */}
//                   {message.internalNotes && message.internalNotes.length > 0 ? (
//                     <div className="space-y-4 mb-6">
//                       {message.internalNotes.map((note, index) => (
//                         <div
//                           key={index}
//                           className="border-l-4 border-gray-500 pl-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-r-lg"
//                         >
//                           <div className="flex items-center justify-between mb-2">
//                             <span className="font-semibold text-gray-700 dark:text-gray-300">
//                               {note.adminName}
//                             </span>
//                             <span className="text-sm text-gray-500 dark:text-gray-400">
//                               {new Date(note.createdAt).toLocaleString()}
//                             </span>
//                           </div>
//                           <p className="text-gray-700 dark:text-gray-300">
//                             {note.note}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 text-gray-500 dark:text-gray-400">
//                       No internal notes yet
//                     </div>
//                   )}

//                   {/* Add Internal Note */}
//                   <div className="space-y-4">
//                     <div className="flex items-center space-x-2">
//                       <FileText className="w-5 h-5" />
//                       <span className="font-medium">Add Internal Note</span>
//                     </div>
//                     <Textarea
//                       placeholder="Add a private note for your team..."
//                       value={internalNote}
//                       onChange={(e) => setInternalNote(e.target.value)}
//                       rows={4}
//                       className="resize-none"
//                     />
//                     <Button
//                       onClick={handleAddInternalNote}
//                       disabled={addingNote || !internalNote.trim()}
//                       variant="outline"
//                       className="w-full"
//                     >
//                       {addingNote ? (
//                         <div className="flex items-center space-x-2">
//                           <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
//                           <span>Adding...</span>
//                         </div>
//                       ) : (
//                         <div className="flex items-center space-x-2">
//                           <Plus className="w-4 h-4" />
//                           <span>Add Note</span>
//                         </div>
//                       )}
//                     </Button>
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Contact Information */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <User className="w-5 h-5" />
//                 <span>Contact Information</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center space-x-3">
//                 <User className="w-4 h-4 text-gray-500" />
//                 <span className="font-medium">{message.name}</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Mail className="w-4 h-4 text-gray-500" />
//                 <a
//                   href={`mailto:${message.email}`}
//                   className="text-blue-600 hover:underline"
//                 >
//                   {message.email}
//                 </a>
//               </div>
//               {message.phone && (
//                 <div className="flex items-center space-x-3">
//                   <Phone className="w-4 h-4 text-gray-500" />
//                   <a
//                     href={`tel:${message.phone}`}
//                     className="text-blue-600 hover:underline"
//                   >
//                     {message.phone}
//                   </a>
//                 </div>
//               )}
//               <div className="flex items-center space-x-3">
//                 <Calendar className="w-4 h-4 text-gray-500" />
//                 <span className="text-sm">
//                   {new Date(message.createdAt).toLocaleString()}
//                 </span>
//               </div>
//               <div className="pt-2 border-t">
//                 {getUserStatusBadge(message.isRegisteredUser)}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Message Management */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Edit className="w-5 h-5" />
//                 <span>Manage Message</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium mb-2 block">Status</label>
//                 <Select
//                   value={message.status}
//                   onValueChange={handleStatusChange}
//                   disabled={updating}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white">
//                     <SelectItem value="new">New</SelectItem>
//                     <SelectItem value="in_progress">In Progress</SelectItem>
//                     <SelectItem value="resolved">Resolved</SelectItem>
//                     <SelectItem value="archived">Archived</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium mb-2 block">
//                   Priority
//                 </label>
//                 <Select
//                   value={message.priority}
//                   onValueChange={handlePriorityChange}
//                   disabled={updating}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white">
//                     <SelectItem value="low">Low</SelectItem>
//                     <SelectItem value="medium">Medium</SelectItem>
//                     <SelectItem value="high">High</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="pt-4 border-t">
//                 <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
//                   <p>
//                     <strong>Preferred Contact:</strong>{" "}
//                     {message.preferredContact}
//                   </p>
//                   <p>
//                     <strong>Created:</strong>{" "}
//                     {new Date(message.createdAt).toLocaleDateString()}
//                   </p>
//                   <p>
//                     <strong>Last Updated:</strong>{" "}
//                     {new Date(message.updatedAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Quick Actions */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 onClick={() => window.open(`mailto:${message.email}`, "_blank")}
//               >
//                 <Mail className="w-4 h-4 mr-2" />
//                 Send Email
//               </Button>
//               {/*
//               {message.phone && (
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start"
//                   onClick={() => window.open(`tel:${message.phone}`, "_blank")}
//                 >
//                   <Phone className="w-4 h-4 mr-2" />
//                   Call Phone
//                 </Button>
//               )} */}

//               {message.phone && (
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start"
//                   onClick={() => {
//                     const phoneNumber = message.phone?.replace(/\s/g, "");
//                     window.open(`https://wa.me/${phoneNumber}`, "_blank");
//                   }}
//                 >
//                   <MessageSquare className="w-4 h-4 mr-2" />
//                   WhatsApp
//                 </Button>
//               )}
//             </CardContent>
//           </Card>

//           {/* Message Statistics */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Message Info</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 dark:text-gray-400">
//                     Responses:
//                   </span>
//                   <span className="font-medium">
//                     {message.responses?.length || 0}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 dark:text-gray-400">
//                     Internal Notes:
//                   </span>
//                   <span className="font-medium">
//                     {message.internalNotes?.length || 0}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 dark:text-gray-400">
//                     Read Status:
//                   </span>
//                   <span
//                     className={`font-medium ${
//                       message.isRead ? "text-green-600" : "text-red-600"
//                     }`}
//                   >
//                     {message.isRead ? "Read" : "Unread"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 dark:text-gray-400">
//                     User Type:
//                   </span>
//                   <span
//                     className={`font-medium ${
//                       message.isRegisteredUser
//                         ? "text-green-600"
//                         : "text-yellow-600"
//                     }`}
//                   >
//                     {message.isRegisteredUser ? "Registered" : "Guest"}
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactMessageDetail;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getContactMessage,
  updateContactMessage,
  addMessageResponse,
  addInternalNote,
} from "@/services/contactServices";
import { ContactMessage } from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare,
  Send,
  Edit,
  Clock,
  AlertTriangle,
  CheckCircle,
  Archive,
  UserCheck,
  UserX,
  FileText,
  Plus,
  Star,
  Activity,
  Zap,
  Globe,
  Shield,
  Heart,
  ExternalLink,
  Copy,
  Timer,
  Users,
  Flag,
} from "lucide-react";
import { toast } from "react-hot-toast";

const ContactMessageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMessage();
    }
  }, [id]);

  const fetchMessage = async () => {
    try {
      setLoading(true);
      const response = await getContactMessage(id!);
      if (response.success) {
        setMessage(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch message:", error);
      toast.error("Failed to load message");
      navigate("/admin/messages");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdating(true);
      const response = await updateContactMessage(id!, { status: newStatus });
      if (response.success) {
        setMessage(response.data);
        toast.success("Status updated successfully");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      setUpdating(true);
      const response = await updateContactMessage(id!, {
        priority: newPriority,
      });
      if (response.success) {
        setMessage(response.data);
        toast.success("Priority updated successfully");
      }
    } catch (error) {
      console.error("Failed to update priority:", error);
      toast.error("Failed to update priority");
    } finally {
      setUpdating(false);
    }
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) {
      toast.error("Please enter a response message");
      return;
    }

    try {
      setResponding(true);
      const response = await addMessageResponse(id!, responseText);
      if (response.success) {
        setMessage(response.data);
        setResponseText("");
        toast.success("Response sent successfully");
      }
    } catch (error) {
      console.error("Failed to send response:", error);
      toast.error("Failed to send response");
    } finally {
      setResponding(false);
    }
  };

  const handleAddInternalNote = async () => {
    if (!internalNote.trim()) {
      toast.error("Please enter a note");
      return;
    }

    try {
      setAddingNote(true);
      const response = await addInternalNote(id!, internalNote);
      if (response.success) {
        setMessage(response.data);
        setInternalNote("");
        toast.success("Internal note added successfully");
      }
    } catch (error) {
      console.error("Failed to add note:", error);
      toast.error("Failed to add note");
    } finally {
      setAddingNote(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "new":
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          borderColor: "border-blue-200",
        };
      case "in_progress":
        return {
          icon: <Zap className="w-5 h-5" />,
          color: "text-amber-600",
          bgColor: "bg-amber-100",
          borderColor: "border-amber-200",
        };
      case "resolved":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: "text-emerald-600",
          bgColor: "bg-emerald-100",
          borderColor: "border-emerald-200",
        };
      case "archived":
        return {
          icon: <Archive className="w-5 h-5" />,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-200",
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-200",
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          color: "text-red-700",
          bgColor: "bg-red-100",
          borderColor: "border-red-200",
          pulse: "animate-pulse",
        };
      case "medium":
        return {
          icon: <Flag className="w-4 h-4" />,
          color: "text-amber-700",
          bgColor: "bg-amber-100",
          borderColor: "border-amber-200",
          pulse: "",
        };
      case "low":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: "text-emerald-700",
          bgColor: "bg-emerald-100",
          borderColor: "border-emerald-200",
          pulse: "",
        };
      default:
        return {
          icon: <Flag className="w-4 h-4" />,
          color: "text-gray-700",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-200",
          pulse: "",
        };
    }
  };

  const getUserStatusBadge = (isRegisteredUser: boolean) => {
    if (isRegisteredUser) {
      return (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
          <UserCheck className="w-4 h-4" />
          <span className="text-sm font-medium">Registered User</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full border border-amber-200">
          <UserX className="w-4 h-4" />
          <span className="text-sm font-medium">Guest User</span>
        </div>
      );
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading message details...
          </p>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <MessageSquare className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Message not found
          </h2>
          <p className="text-gray-600 mb-6">
            The message you're looking for doesn't exist or has been removed.
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/admin/messages")}
          >
            Back to Messages
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(message.status);
  const priorityConfig = getPriorityConfig(message.priority);

  return (
    <div className="flex-1 ml-24 p-8 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 active:scale-95 shadow-sm"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-200" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Message Details
              </h1>
              <p className="text-gray-600 mt-1 font-medium">
                Manage and respond to customer inquiry
              </p>
            </div>
          </div>

          {/* Status & Priority Badges */}
          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl border ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.color}`}
            >
              {statusConfig.icon}
              <span className="font-semibold capitalize">
                {message.status.replace("_", " ")}
              </span>
            </div>
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl border ${priorityConfig.bgColor} ${priorityConfig.borderColor} ${priorityConfig.color} ${priorityConfig.pulse}`}
            >
              {priorityConfig.icon}
              <span className="font-semibold capitalize">
                {message.priority} Priority
              </span>
            </div>
            {getUserStatusBadge(message.isRegisteredUser)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Content - Takes 3 columns */}
        <div className="xl:col-span-3 space-y-6">
          {/* Message Content Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {message.subject}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{message.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{message.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatRelativeTime(message.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityConfig.bgColor} ${priorityConfig.borderColor} ${priorityConfig.color}`}
                >
                  {message.inquiryType
                    ?.replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
                  {message.message}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs for Responses and Notes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <Tabs defaultValue="responses" className="w-full">
              <div className="px-6 pt-6 border-b border-gray-200">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
                  <TabsTrigger
                    value="responses"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Responses ({message.responses?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Internal Notes ({message.internalNotes?.length || 0})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="responses" className="p-6">
                {/* Response History */}
                {message.responses && message.responses.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {message.responses.map((response, index) => (
                      <div
                        key={index}
                        className="relative bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5"
                      >
                        <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-l-xl"></div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-blue-900">
                              {response.adminName}
                            </span>
                            <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                              Admin Response
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatRelativeTime(response.createdAt)} •{" "}
                            {new Date(response.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <p className="text-gray-800 leading-relaxed">
                          {response.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <MessageSquare className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No responses yet
                    </h3>
                    <p className="text-gray-600">
                      Be the first to respond to this customer inquiry.
                    </p>
                  </div>
                )}

                {/* Enhanced Response Form */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Send className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Send Response
                    </h3>
                  </div>
                  <Textarea
                    placeholder="Type your professional response here..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={6}
                    className="resize-none mb-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {responseText.length} characters
                    </div>
                    <Button
                      onClick={handleSendResponse}
                      disabled={responding || !responseText.trim()}
                      className="bg-blue-600 hover:bg-blue-700 px-6"
                    >
                      {responding ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="w-4 h-4" />
                          <span>Send Response</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="p-6">
                {/* Internal Notes */}
                {message.internalNotes && message.internalNotes.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {message.internalNotes.map((note, index) => (
                      <div
                        key={index}
                        className="relative bg-gradient-to-r from-gray-50 to-slate-100/50 border border-gray-200 rounded-xl p-5"
                      >
                        <div className="absolute left-0 top-0 w-1 h-full bg-gray-500 rounded-l-xl"></div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="bg-gray-600 p-1.5 rounded-lg">
                              <FileText className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900">
                              {note.adminName}
                            </span>
                            <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">
                              Internal Note
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatRelativeTime(note.createdAt)} •{" "}
                            {new Date(note.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <p className="text-gray-800 leading-relaxed">
                          {note.note}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No internal notes yet
                    </h3>
                    <p className="text-gray-600">
                      Add private notes for your team collaboration.
                    </p>
                  </div>
                )}

                {/* Enhanced Add Internal Note */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50/30 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="bg-gray-600 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Add Internal Note
                    </h3>
                  </div>
                  <Textarea
                    placeholder="Add a private note for your team (this won't be visible to the customer)..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    rows={4}
                    className="resize-none mb-4 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {internalNote.length} characters
                    </div>
                    <Button
                      onClick={handleAddInternalNote}
                      disabled={addingNote || !internalNote.trim()}
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50 px-6"
                    >
                      {addingNote ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Adding...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Add Note</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Enhanced Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Contact Information Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">
                    {message.name}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(message.name)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a
                    href={`mailto:${message.email}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {message.email}
                  </a>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => copyToClipboard(message.email)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                  <a
                    href={`mailto:${message.email}`}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </div>

              {message.phone && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-blue-600 font-medium">
                      {message.phone}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(message.phone!)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {formatRelativeTime(message.createdAt)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                {getUserStatusBadge(message.isRegisteredUser)}
              </div>
            </div>
          </div>

          {/* Message Management Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Edit className="w-5 h-5 mr-2" />
                Manage Message
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Priority
                </label>
                <Select
                  value={message.priority}
                  onValueChange={handlePriorityChange}
                  disabled={updating}
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="low">🟢 Low</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="high">🔴 High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Preferred Contact:
                    </span>
                    <span className="text-gray-900 font-semibold capitalize">
                      {message.preferredContact}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Created:</span>
                    <span className="text-gray-900 font-semibold">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Last Updated:
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {new Date(message.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Quick Actions
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                onClick={() => window.open(`mailto:${message.email}`, "_blank")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>

              {message.phone && (
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
                  onClick={() => {
                    const phoneNumber = message.phone?.replace(/\s/g, "");
                    window.open(`https://wa.me/${phoneNumber}`, "_blank");
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200"
                onClick={() =>
                  copyToClipboard(
                    `Name: ${message.name}\nEmail: ${message.email}\nSubject: ${message.subject}\nMessage: ${message.message}`
                  )
                }
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Message
              </Button>
            </div>
          </div>

          {/* Enhanced Message Statistics Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Message Analytics
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {message.responses?.length || 0}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    Responses
                  </div>
                </div>

                <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {message.internalNotes?.length || 0}
                  </div>
                  <div className="text-xs text-purple-600 font-medium">
                    Notes
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                  <span className="text-gray-600 font-medium flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Read Status:
                  </span>
                  <span
                    className={`font-bold text-sm px-2 py-1 rounded-full ${
                      message.isRead
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {message.isRead ? "Read" : "Unread"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                  <span className="text-gray-600 font-medium flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    User Type:
                  </span>
                  <span
                    className={`font-bold text-sm px-2 py-1 rounded-full ${
                      message.isRegisteredUser
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {message.isRegisteredUser ? "Registered" : "Guest"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                  <span className="text-gray-600 font-medium flex items-center">
                    <Timer className="w-4 h-4 mr-2" />
                    Response Time:
                  </span>
                  <span className="font-bold text-sm text-gray-700">
                    {message.responses?.length
                      ? `${formatRelativeTime(message.responses[0].createdAt)}`
                      : "No response"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Timeline Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Activity Timeline
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 p-1.5 rounded-full">
                    <MessageSquare className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Message Received
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {message.responses &&
                  message.responses.map((response, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-emerald-500 p-1.5 rounded-full">
                        <Send className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          Response Sent
                        </div>
                        <div className="text-xs text-gray-500">
                          by {response.adminName} •{" "}
                          {new Date(response.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}

                {message.internalNotes &&
                  message.internalNotes.map((note, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-gray-500 p-1.5 rounded-full">
                        <FileText className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          Note Added
                        </div>
                        <div className="text-xs text-gray-500">
                          by {note.adminName} •{" "}
                          {new Date(note.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessageDetail;
