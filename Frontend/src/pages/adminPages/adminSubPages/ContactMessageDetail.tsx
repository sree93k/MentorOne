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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "in_progress":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "archived":
        return <Archive className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getUserStatusBadge = (isRegisteredUser: boolean) => {
    if (isRegisteredUser) {
      return (
        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
          <UserCheck className="w-4 h-4" />
          <span className="text-sm font-medium">Registered User</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
          <UserX className="w-4 h-4" />
          <span className="text-sm font-medium">Guest User</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Message not found
          </h2>
          <Button className="mt-4" onClick={() => navigate("/admin/messages")}>
            Back to Messages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-24 p-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate("/admin/messages")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Messages
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Message Details
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {getStatusIcon(message.status)}
          <Badge className={`${getPriorityColor(message.priority)} text-white`}>
            {message.priority.toUpperCase()} PRIORITY
          </Badge>
          {getUserStatusBadge(message.isRegisteredUser)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{message.subject}</span>
                <Badge variant="outline">{message.inquiryType}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {message.message}
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Responses and Notes */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="responses" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="responses">
                    Responses ({message.responses?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="notes">
                    Internal Notes ({message.internalNotes?.length || 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="responses" className="p-6">
                  {/* Response History */}
                  {message.responses && message.responses.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {message.responses.map((response, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-blue-700 dark:text-blue-300">
                              {response.adminName}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(response.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {response.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No responses yet
                    </div>
                  )}

                  {/* Response Form */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-medium">Send Response</span>
                    </div>
                    <Textarea
                      placeholder="Type your response here..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <Button
                      onClick={handleSendResponse}
                      disabled={responding || !responseText.trim()}
                      className="w-full"
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
                </TabsContent>

                <TabsContent value="notes" className="p-6">
                  {/* Internal Notes */}
                  {message.internalNotes && message.internalNotes.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {message.internalNotes.map((note, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-gray-500 pl-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-r-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              {note.adminName}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {note.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No internal notes yet
                    </div>
                  )}

                  {/* Add Internal Note */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">Add Internal Note</span>
                    </div>
                    <Textarea
                      placeholder="Add a private note for your team..."
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <Button
                      onClick={handleAddInternalNote}
                      disabled={addingNote || !internalNote.trim()}
                      variant="outline"
                      className="w-full"
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{message.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <a
                  href={`mailto:${message.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {message.email}
                </a>
              </div>
              {message.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <a
                    href={`tel:${message.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {message.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t">
                {getUserStatusBadge(message.isRegisteredUser)}
              </div>
            </CardContent>
          </Card>

          {/* Message Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="w-5 h-5" />
                <span>Manage Message</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={message.status}
                  onValueChange={handleStatusChange}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Priority
                </label>
                <Select
                  value={message.priority}
                  onValueChange={handlePriorityChange}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p>
                    <strong>Preferred Contact:</strong>{" "}
                    {message.preferredContact}
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(message.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`mailto:${message.email}`, "_blank")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              {/* 
              {message.phone && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(`tel:${message.phone}`, "_blank")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Phone
                </Button>
              )} */}

              {message.phone && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    const phoneNumber = message.phone?.replace(/\s/g, "");
                    window.open(`https://wa.me/${phoneNumber}`, "_blank");
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Message Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Message Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Responses:
                  </span>
                  <span className="font-medium">
                    {message.responses?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Internal Notes:
                  </span>
                  <span className="font-medium">
                    {message.internalNotes?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Read Status:
                  </span>
                  <span
                    className={`font-medium ${
                      message.isRead ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {message.isRead ? "Read" : "Unread"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    User Type:
                  </span>
                  <span
                    className={`font-medium ${
                      message.isRegisteredUser
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {message.isRegisteredUser ? "Registered" : "Guest"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactMessageDetail;
