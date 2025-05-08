// "use client"

// import { useState } from "react"
// import { VideoCallControls } from "@/components/video-call-controls"
// import { ParticipantGrid } from "@/components/participant-grid"
// import { ChatPanel } from "@/components/chat-panel"
// import { ParticipantsPanel } from "@/components/participants-panel"
// import { useRouter } from "next/navigation"

// export default function VideoCallPage() {
//   const [showChat, setShowChat] = useState(false)
//   const [showParticipants, setShowParticipants] = useState(false)
//   const [layout, setLayout] = useState<"gallery" | "spotlight" | "sidebar">("gallery")
//   const [spotlightId, setSpotlightId] = useState<string | undefined>(undefined)
//   const router = useRouter()

//   const participants = [
//     {
//       id: "1",
//       name: "You",
//       initials: "Y",
//       isSpeaking: false,
//       isMuted: false,
//       isVideoOn: true,
//       isPinned: spotlightId === "1",
//     },
//     {
//       id: "2",
//       name: "Kelly",
//       initials: "K",
//       isSpeaking: false,
//       isMuted: true,
//       isVideoOn: true,
//       isPinned: spotlightId === "2",
//     },
//     {
//       id: "3",
//       name: "Ben",
//       initials: "B",
//       isSpeaking: false,
//       isMuted: true,
//       isVideoOn: false,
//       isPinned: spotlightId === "3",
//     },
//     {
//       id: "4",
//       name: "Amy",
//       initials: "A",
//       isSpeaking: false,
//       isMuted: true,
//       isVideoOn: false,
//       isPinned: spotlightId === "4",
//     },
//     {
//       id: "5",
//       name: "Leo",
//       initials: "L",
//       isSpeaking: true,
//       isMuted: false,
//       isVideoOn: true,
//       isPinned: spotlightId === "5",
//     },
//     {
//       id: "6",
//       name: "Frank",
//       initials: "F",
//       isSpeaking: false,
//       isMuted: true,
//       isVideoOn: false,
//       isPinned: spotlightId === "6",
//     },
//   ]

//   const messages = [
//     {
//       id: "1",
//       sender: {
//         name: "Kelly",
//         initials: "K",
//       },
//       content: "Hi everyone! Glad to be here.",
//       timestamp: new Date(2023, 5, 7, 15, 30),
//     },
//     {
//       id: "2",
//       sender: {
//         name: "You",
//         initials: "Y",
//       },
//       content: "Welcome Kelly! We're just getting started.",
//       timestamp: new Date(2023, 5, 7, 15, 31),
//     },
//     {
//       id: "3",
//       sender: {
//         name: "Leo",
//         initials: "L",
//       },
//       content: "I've prepared some slides for today's discussion.",
//       timestamp: new Date(2023, 5, 7, 15, 32),
//     },
//   ]

//   const handleToggleChat = () => {
//     setShowChat(!showChat)
//     if (showParticipants) setShowParticipants(false)
//   }

//   const handleToggleParticipants = () => {
//     setShowParticipants(!showParticipants)
//     if (showChat) setShowChat(false)
//   }

//   const handlePinParticipant = (id: string) => {
//     if (spotlightId === id) {
//       setSpotlightId(undefined)
//       setLayout("gallery")
//     } else {
//       setSpotlightId(id)
//       setLayout("spotlight")
//     }
//   }

//   const handleSendMessage = (message: string) => {
//     console.log("Sending message:", message)
//     // In a real app, you would add the message to the messages array
//   }

//   const handleEndCall = () => {
//     router.push("/home-page")
//   }

//   return (
//     <div className="flex h-screen flex-col bg-[#1a1d29]">
//       <div className="flex flex-1 overflow-hidden">
//         <div className="relative flex-1 p-2">
//           <ParticipantGrid participants={participants} layout={layout} spotlightId={spotlightId} />
//         </div>

//         {showChat && (
//           <div className="w-80 bg-background">
//             <ChatPanel messages={messages} onSendMessage={handleSendMessage} onClose={handleToggleChat} />
//           </div>
//         )}

//         {showParticipants && (
//           <div className="w-80 bg-background">
//             <ParticipantsPanel
//               participants={participants.map((p) => ({
//                 id: p.id,
//                 name: p.name,
//                 initials: p.initials,
//                 isMuted: p.isMuted,
//                 isPinned: p.isPinned,
//               }))}
//               onPinParticipant={handlePinParticipant}
//               onClose={handleToggleParticipants}
//             />
//           </div>
//         )}
//       </div>

//       <VideoCallControls
//         onEndCall={handleEndCall}
//         onToggleChat={handleToggleChat}
//         onToggleParticipants={handleToggleParticipants}
//       />
//     </div>
//   )
// }
