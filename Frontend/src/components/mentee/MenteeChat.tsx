// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";

// interface MenteeChatProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }
// import { useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   MessageCircle,
//   Phone,
//   Search,
//   Video,
//   Smile,
//   Paperclip,
//   Send,
//   MoreVertical,
// } from "lucide-react";

// interface ChatMessage {
//   id: number;
//   content: string;
//   timestamp: string;
//   sender: "user" | "other";
// }

// interface ChatUser {
//   id: number;
//   name: string;
//   avatar: string;
//   lastMessage: string;
//   timestamp: string;
//   unread?: number;
// }

// const users: ChatUser[] = [
//   {
//     id: 1,
//     name: "Jasna Jaffer",
//     avatar: "https://ui.shadcn.com/avatars/01.png",
//     lastMessage: "Hey! How are you?",
//     timestamp: "8:30 PM",
//     unread: 2,
//   },
//   {
//     id: 2,
//     name: "Anila Benny",
//     avatar: "https://ui.shadcn.com/avatars/02.png",
//     lastMessage: "Can we schedule a call?",
//     timestamp: "7:45 PM",
//   },
//   // Add more users as needed
// ];

// const messages: ChatMessage[] = [
//   {
//     id: 1,
//     content: "Hey There!",
//     timestamp: "8:30 PM",
//     sender: "other",
//   },
//   {
//     id: 2,
//     content: "How are you?",
//     timestamp: "8:30 PM",
//     sender: "other",
//   },
//   {
//     id: 3,
//     content: "Hello!",
//     timestamp: "8:32 PM",
//     sender: "user",
//   },
//   {
//     id: 4,
//     content: "I am fine and how are you?",
//     timestamp: "8:34 PM",
//     sender: "user",
//   },
//   {
//     id: 5,
//     content: "I am doing well, Can we meet tomorrow?",
//     timestamp: "8:36 PM",
//     sender: "other",
//   },
//   {
//     id: 6,
//     content: "Yes Sure!",
//     timestamp: "8:38 PM",
//     sender: "user",
//   },
// ];

// function MenteeChat({ open, onOpenChange }: MenteeChatProps) {
//   const [selectedUser, setSelectedUser] = useState<ChatUser | null>(users[0]);
//   const [newMessage, setNewMessage] = useState("");

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent
//         side="right"
//         className="pr-0 gap-0 bg-white"
//         style={{ width: "50vw", maxWidth: "800px" }}
//       >
//         <div className="flex h-full">
//           {/* Users List Section */}
//           <div className="w-[300px] border-r">
//             <SheetHeader className="p-4 border-b">
//               <SheetTitle>Chats</SheetTitle>
//             </SheetHeader>
//             <div className="p-3">
//               <div className="relative">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input placeholder="Search chats" className="pl-8" />
//               </div>
//             </div>
//             <Tabs defaultValue="people" className="px-3">
//               <TabsList className="w-full">
//                 <TabsTrigger value="people" className="flex-1">
//                   People
//                 </TabsTrigger>
//                 <TabsTrigger value="groups" className="flex-1">
//                   Groups
//                 </TabsTrigger>
//               </TabsList>
//             </Tabs>
//             <ScrollArea className="h-[calc(100vh-200px)]">
//               <div className="space-y-1 p-2">
//                 {users.map((user) => (
//                   <button
//                     key={user.id}
//                     onClick={() => setSelectedUser(user)}
//                     className={`w-full flex items-center space-x-4 p-3 rounded-lg hover:bg-accent ${
//                       selectedUser?.id === user.id ? "bg-accent" : ""
//                     }`}
//                   >
//                     <Avatar>
//                       <AvatarImage src={user.avatar} />
//                       <AvatarFallback>{user.name[0]}</AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 text-left">
//                       <div className="flex justify-between">
//                         <span className="font-medium">{user.name}</span>
//                         <span className="text-xs text-muted-foreground">
//                           {user.timestamp}
//                         </span>
//                       </div>
//                       <p className="text-sm text-muted-foreground truncate">
//                         {user.lastMessage}
//                       </p>
//                     </div>
//                     {user.unread && (
//                       <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
//                         {user.unread}
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </ScrollArea>
//           </div>

//           {/* Chat Section */}
//           <div className="flex-1 flex flex-col">
//             {selectedUser ? (
//               <>
//                 <div className="p-4 border-b flex justify-between items-center">
//                   <div className="flex items-center space-x-4">
//                     <Avatar>
//                       <AvatarImage src={selectedUser.avatar} />
//                       <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <h3 className="font-medium">{selectedUser.name}</h3>
//                       <p className="text-sm text-muted-foreground">Online</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Button variant="ghost" size="icon">
//                       <Phone className="h-5 w-5" />
//                     </Button>
//                     <Button variant="ghost" size="icon">
//                       <Video className="h-5 w-5" />
//                     </Button>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="h-5 w-5" />
//                     </Button>
//                   </div>
//                 </div>
//                 <ScrollArea className="flex-1 p-4">
//                   <div className="space-y-4">
//                     {messages.map((message) => (
//                       <div
//                         key={message.id}
//                         className={`flex ${
//                           message.sender === "user"
//                             ? "justify-end"
//                             : "justify-start"
//                         }`}
//                       >
//                         <div
//                           className={`max-w-[70%] rounded-lg p-3 ${
//                             message.sender === "user"
//                               ? "bg-primary text-primary-foreground"
//                               : "bg-muted"
//                           }`}
//                         >
//                           <p>{message.content}</p>
//                           <span className="text-xs opacity-70 mt-1 block">
//                             {message.timestamp}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </ScrollArea>
//                 <div className="p-4 border-t">
//                   <div className="flex items-center space-x-2">
//                     <Button variant="ghost" size="icon">
//                       <Smile className="h-5 w-5" />
//                     </Button>
//                     <Button variant="ghost" size="icon">
//                       <Paperclip className="h-5 w-5" />
//                     </Button>
//                     <Input
//                       placeholder="Type your message here..."
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       className="flex-1"
//                     />
//                     <Button size="icon">
//                       <Send className="h-5 w-5" />
//                     </Button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-center p-8">
//                 <div className="space-y-2">
//                   <h3 className="font-medium">No chat selected</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Choose a conversation from the left to start chatting
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }
// export default MenteeChat;
