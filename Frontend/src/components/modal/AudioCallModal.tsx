// // import React, { useEffect, useState, useRef } from "react";
// // import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { Button } from "@/components/ui/button";
// // import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
// // import { cn } from "@/lib/utils";
// // import { io, Socket } from "socket.io-client";

// // export type CallStatus = "calling" | "connected" | "disconnected";

// // interface CallModalProps {
// //   open: boolean;
// //   caller: {
// //     name: string;
// //     image?: string;
// //     phoneNumber?: string;
// //   };
// //   onOpenChange: (open: boolean) => void;
// //   children?: React.ReactNode;
// //   initialStatus?: CallStatus;
// //   autoConnect?: boolean;
// //   chatId: string;
// //   userId: string;
// //   recipientId: string;
// // }

// // // WebRTC Hook
// // const useWebRTCAudio = (
// //   chatId: string,
// //   userId: string,
// //   recipientId: string,
// //   socket: Socket | null
// // ) => {
// //   const localStream = useRef<MediaStream | null>(null);
// //   const peerConnection = useRef<RTCPeerConnection | null>(null);
// //   const [isConnected, setIsConnected] = useState(false);

// //   useEffect(() => {
// //     if (!socket) return;

// //     const initWebRTC = async () => {
// //       try {
// //         localStream.current = await navigator.mediaDevices.getUserMedia({
// //           audio: true,
// //         });

// //         peerConnection.current = new RTCPeerConnection({
// //           iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// //         });

// //         localStream.current.getTracks().forEach((track) => {
// //           peerConnection.current?.addTrack(track, localStream.current!);
// //         });

// //         peerConnection.current.ontrack = (event) => {
// //           const [remoteStream] = event.streams;
// //           const audio = new Audio();
// //           audio.srcObject = remoteStream;
// //           audio.play().catch((e) => console.error("Audio playback error:", e));
// //         };

// //         peerConnection.current.onicecandidate = (event) => {
// //           if (event.candidate) {
// //             socket.emit("iceCandidate", {
// //               chatId,
// //               candidate: event.candidate,
// //               to: recipientId,
// //             });
// //           }
// //         };

// //         peerConnection.current.onconnectionstatechange = () => {
// //           if (peerConnection.current?.connectionState === "connected") {
// //             setIsConnected(true);
// //           }
// //         };

// //         // Socket.IO signaling
// //         socket.on("offer", async ({ offer, from }) => {
// //           if (from !== recipientId) return;
// //           await peerConnection.current?.setRemoteDescription(
// //             new RTCSessionDescription(offer)
// //           );
// //           const answer = await peerConnection.current?.createAnswer();
// //           await peerConnection.current?.setLocalDescription(answer);
// //           socket.emit("answer", { chatId, answer, to: recipientId });
// //         });

// //         socket.on("answer", async ({ answer, from }) => {
// //           if (from !== recipientId) return;
// //           await peerConnection.current?.setRemoteDescription(
// //             new RTCSessionDescription(answer)
// //           );
// //         });

// //         socket.on("iceCandidate", async ({ candidate, from }) => {
// //           if (from !== recipientId) return;
// //           await peerConnection.current?.addIceCandidate(
// //             new RTCIceCandidate(candidate)
// //           );
// //         });

// //         // Initiate call
// //         const offer = await peerConnection.current?.createOffer();
// //         await peerConnection.current?.setLocalDescription(offer);
// //         socket.emit("offer", { chatId, offer, to: recipientId });
// //       } catch (error) {
// //         console.error("WebRTC initialization error:", error);
// //       }
// //     };

// //     initWebRTC();

// //     return () => {
// //       localStream.current?.getTracks().forEach((track) => track.stop());
// //       peerConnection.current?.close();
// //       socket?.off("offer");
// //       socket?.off("answer");
// //       socket?.off("iceCandidate");
// //     };
// //   }, [socket, chatId, recipientId]);

// //   return { isConnected };
// // };

// // // CallAvatar Component
// // interface CallAvatarProps {
// //   name: string;
// //   image?: string;
// //   size?: "sm" | "md" | "lg";
// // }

// // const CallAvatar = ({ name, image, size = "lg" }: CallAvatarProps) => {
// //   const initials = name
// //     .split(" ")
// //     .map((n) => n[0])
// //     .join("")
// //     .toUpperCase();

// //   const sizeClasses = {
// //     sm: "h-16 w-16",
// //     md: "h-24 w-24",
// //     lg: "h-32 w-32",
// //   };

// //   return (
// //     <div className="flex items-center justify-center">
// //       <Avatar className={cn("border-2 border-primary/10", sizeClasses[size])}>
// //         {image ? (
// //           <AvatarImage src={image} alt={name} className="object-cover" />
// //         ) : null}
// //         <AvatarFallback className="text-4xl bg-secondary text-secondary-foreground">
// //           {initials.slice(0, 2)}
// //         </AvatarFallback>
// //       </Avatar>
// //     </div>
// //   );
// // };

// // // CallBackground Component
// // interface CallBackgroundProps {
// //   children: React.ReactNode;
// //   className?: string;
// // }

// // const CallBackground = ({ children, className }: CallBackgroundProps) => {
// //   return (
// //     <div
// //       className={cn(
// //         "flex flex-col items-center justify-between p-8 md:p-12 bg-black w-full h-full relative overflow-hidden",
// //         className
// //       )}
// //       style={{
// //         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
// //       }}
// //     >
// //       {children}
// //     </div>
// //   );
// // };

// // // CallControls Component
// // interface CallControlsProps {
// //   onEndCall: () => void;
// //   className?: string;
// // }

// // const CallControls = ({ onEndCall, className }: CallControlsProps) => {
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isVideoOff, setIsVideoOff] = useState(true); // Video off by default for audio call

// //   return (
// //     <div className={cn("flex items-center justify-center gap-4", className)}>
// //       <Button
// //         variant="outline"
// //         size="icon"
// //         className={cn(
// //           "h-12 w-12 rounded-full bg-neutral-800 border-0 hover:bg-neutral-700 transition-colors",
// //           isMuted && "bg-neutral-700"
// //         )}
// //         onClick={() => setIsMuted((prev) => !prev)}
// //       >
// //         {isMuted ? (
// //           <MicOff className="h-5 w-5 text-red-500" />
// //         ) : (
// //           <Mic className="h-5 w-5 text-white" />
// //         )}
// //       </Button>

// //       <Button
// //         variant="outline"
// //         size="icon"
// //         className={cn(
// //           "h-12 w-12 rounded-full bg-neutral-800 border-0 hover:bg-neutral-700 transition-colors",
// //           isVideoOff && "bg-neutral-700"
// //         )}
// //         disabled
// //       >
// //         <VideoOff className="h-5 w-5 text-red-500" />
// //       </Button>

// //       <Button
// //         variant="destructive"
// //         size="icon"
// //         className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700"
// //         onClick={onEndCall}
// //       >
// //         <PhoneOff className="h-6 w-6" />
// //       </Button>
// //     </div>
// //   );
// // };

// // // CallStatus Component
// // interface CallStatusProps {
// //   status: CallStatus;
// //   callerName: string;
// //   phoneNumber?: string;
// // }

// // const CallStatus = ({ status, callerName, phoneNumber }: CallStatusProps) => {
// //   const [visible, setVisible] = useState(true);

// //   useEffect(() => {
// //     let timer: number | undefined;

// //     if (status === "disconnected") {
// //       setVisible(true);
// //       timer = setTimeout(() => {
// //         setVisible(false);
// //       }, 2000);
// //     } else {
// //       setVisible(true);
// //     }

// //     return () => {
// //       if (timer) clearTimeout(timer);
// //     };
// //   }, [status]);

// //   if (!visible) return null;

// //   return (
// //     <div className="flex flex-col items-center justify-center gap-2 transition-opacity duration-300">
// //       <h2 className="text-4xl font-semibold text-white tracking-tight">
// //         {callerName}
// //       </h2>

// //       <div
// //         className={cn(
// //           "text-sm text-neutral-300 animate-in fade-in slide-in-from-bottom duration-300",
// //           status === "disconnected" && "text-red-400"
// //         )}
// //       >
// //         {status === "calling" && (
// //           <div className="flex items-center gap-1">
// //             <span>calling {phoneNumber}</span>
// //             <span className="inline-flex gap-0.5">
// //               <span className="animate-ping">.</span>
// //               <span className="animate-ping animation-delay-100">.</span>
// //               <span className="animate-ping animation-delay-200">.</span>
// //             </span>
// //           </div>
// //         )}
// //         {status === "connected" && "Call connected"}
// //         {status === "disconnected" && "Call disconnected"}
// //       </div>
// //     </div>
// //   );
// // };

// // // CallTimer Component
// // interface CallTimerProps {
// //   isActive: boolean;
// //   onReset?: () => void;
// // }

// // const CallTimer = ({ isActive, onReset }: CallTimerProps) => {
// //   const [seconds, setSeconds] = useState(0);

// //   useEffect(() => {
// //     let interval: number | undefined;

// //     if (isActive) {
// //       interval = setInterval(() => {
// //         setSeconds((prev) => prev + 1);
// //       }, 1000);
// //     } else if (!isActive && seconds !== 0) {
// //       setSeconds(0);
// //       if (onReset) onReset();
// //     }

// //     return () => {
// //       if (interval) clearInterval(interval);
// //     };
// //   }, [isActive, seconds, onReset]);

// //   const formatTime = (totalSeconds: number) => {
// //     const minutes = Math.floor(totalSeconds / 60);
// //     const remainingSeconds = totalSeconds % 60;
// //     return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
// //       .toString()
// //       .padStart(2, "0")}`;
// //   };

// //   return (
// //     <div className="text-base text-center font-medium text-neutral-200">
// //       {formatTime(seconds)}
// //     </div>
// //   );
// // };

// // // WaveAnimation Component
// // interface WaveAnimationProps {
// //   isActive: boolean;
// //   className?: string;
// // }

// // const WaveAnimation = ({ isActive, className }: WaveAnimationProps) => {
// //   if (!isActive) return null;

// //   return (
// //     <div className={cn("flex justify-center items-center gap-1", className)}>
// //       {[1, 2, 3, 4, 5].map((i) => (
// //         <div
// //           key={i}
// //           className={cn(
// //             "bg-green-500 rounded-full w-1 h-6 animate-pulse",
// //             i % 2 === 0 ? "h-4" : "h-6",
// //             i === 3 && "h-8"
// //           )}
// //           style={{
// //             animationDelay: `${i * 0.1}s`,
// //             animationDuration: "1s",
// //           }}
// //         />
// //       ))}
// //     </div>
// //   );
// // };

// // // Main CallModal Component
// // export function AudioCallModal({
// //   open,
// //   caller,
// //   onOpenChange,
// //   children,
// //   initialStatus = "calling",
// //   autoConnect = true,
// //   chatId,
// //   userId,
// //   recipientId,
// // }: CallModalProps) {
// //   const [status, setStatus] = useState<CallStatus>(initialStatus);
// //   const [timeoutId, setTimeoutId] = useState<number | null>(null);
// //   const [socket, setSocket] = useState<Socket | null>(null);

// //   useEffect(() => {
// //     const token = localStorage.getItem("accessToken");
// //     const socketInstance = io(import.meta.env.VITE_API_URL, {
// //       auth: { token },
// //       transports: ["websocket", "polling"],
// //       reconnection: true,
// //     });
// //     setSocket(socketInstance);

// //     return () => {
// //       socketInstance.disconnect();
// //     };
// //   }, []);

// //   const { isConnected } = useWebRTCAudio(chatId, userId, recipientId, socket);

// //   useEffect(() => {
// //     if (isConnected && status === "calling") {
// //       setStatus("connected");
// //     }
// //   }, [isConnected, status]);

// //   useEffect(() => {
// //     if (open && status === "calling" && autoConnect) {
// //       const id = setTimeout(() => {
// //         if (!isConnected) {
// //           setStatus("disconnected");
// //           onOpenChange(false);
// //         }
// //       }, 10000); // Timeout after 10 seconds if no connection

// //       return () => clearTimeout(id);
// //     }
// //   }, [open, status, autoConnect, isConnected, onOpenChange]);

// //   useEffect(() => {
// //     if (!open) {
// //       if (timeoutId) {
// //         clearTimeout(timeoutId);
// //         setTimeoutId(null);
// //       }

// //       const resetTimer = setTimeout(() => {
// //         setStatus(initialStatus);
// //       }, 300);

// //       return () => clearTimeout(resetTimer);
// //     }
// //   }, [open, initialStatus, timeoutId]);

// //   const handleEndCall = () => {
// //     setStatus("disconnected");
// //     const id = setTimeout(() => {
// //       onOpenChange(false);
// //     }, 2000);
// //     setTimeoutId(id);
// //   };

// //   return (
// //     <Dialog open={open} onOpenChange={onOpenChange}>
// //       {children && <DialogTrigger asChild>{children}</DialogTrigger>}
// //       <DialogContent className="p-0 border-0 max-w-md md:max-w-2xl h-[500px] md:h-[600px] bg-transparent shadow-2xl">
// //         <CallBackground>
// //           <div className="absolute left-0 top-0 w-full flex justify-center pt-4">
// //             {status === "connected" && (
// //               <CallTimer isActive={status === "connected"} />
// //             )}
// //           </div>

// //           <div className="flex-1 flex flex-col items-center justify-center gap-8">
// //             <div className="relative">
// //               <CallAvatar name={caller.name} image={caller.image} />
// //               {status === "connected" && (
// //                 <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
// //                   <WaveAnimation isActive={status === "connected"} />
// //                 </div>
// //               )}
// //             </div>

// //             <CallStatus
// //               status={status}
// //               callerName={caller.name}
// //               phoneNumber={caller.phoneNumber}
// //             />
// //           </div>

// //           <div className="w-full">
// //             <CallControls onEndCall={handleEndCall} />
// //           </div>
// //         </CallBackground>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }
// import React, { useEffect, useState, useRef } from "react";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { io, Socket } from "socket.io-client";

// export type CallStatus = "calling" | "connected" | "disconnected";

// interface CallModalProps {
//   open: boolean;
//   caller: {
//     name: string;
//     image?: string;
//     phoneNumber?: string;
//   };
//   onOpenChange: (open: boolean) => void;
//   children?: React.ReactNode;
//   initialStatus?: CallStatus;
//   chatId: string;
//   userId: string;
//   recipientId: string;
//   isCaller: boolean;
// }

// // WebRTC Hook
// const useWebRTCAudio = (
//   chatId: string,
//   userId: string,
//   recipientId: string,
//   socket: Socket | null,
//   isCaller: boolean,
//   onCallAccepted: () => void
// ) => {
//   const localStream = useRef<MediaStream | null>(null);
//   const peerConnection = useRef<RTCPeerConnection | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     if (!socket) return;

//     const initWebRTC = async () => {
//       try {
//         localStream.current = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//         });

//         peerConnection.current = new RTCPeerConnection({
//           iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//         });

//         localStream.current.getTracks().forEach((track) => {
//           peerConnection.current?.addTrack(track, localStream.current!);
//         });

//         peerConnection.current.ontrack = (event) => {
//           const [remoteStream] = event.streams;
//           const audio = new Audio();
//           audio.srcObject = remoteStream;
//           audio.play().catch((e) => console.error("Audio playback error:", e));
//         };

//         peerConnection.current.onicecandidate = (event) => {
//           if (event.candidate) {
//             socket.emit("iceCandidate", {
//               chatId,
//               candidate: event.candidate,
//               to: recipientId,
//             });
//           }
//         };

//         peerConnection.current.onconnectionstatechange = () => {
//           if (peerConnection.current?.connectionState === "connected") {
//             setIsConnected(true);
//           }
//         };

//         // Socket.IO signaling
//         socket.on("offer", async ({ offer, from }) => {
//           if (from !== recipientId || isCaller) return;
//           await peerConnection.current?.setRemoteDescription(
//             new RTCSessionDescription(offer)
//           );
//           const answer = await peerConnection.current?.createAnswer();
//           await peerConnection.current?.setLocalDescription(answer);
//           socket.emit("answer", { chatId, answer, to: recipientId });
//           onCallAccepted();
//         });

//         socket.on("answer", async ({ answer, from }) => {
//           if (from !== recipientId || !isCaller) return;
//           await peerConnection.current?.setRemoteDescription(
//             new RTCSessionDescription(answer)
//           );
//         });

//         socket.on("iceCandidate", async ({ candidate, from }) => {
//           if (from !== recipientId) return;
//           await peerConnection.current?.addIceCandidate(
//             new RTCIceCandidate(candidate)
//           );
//         });

//         // Initiate call if caller
//         if (isCaller) {
//           const offer = await peerConnection.current?.createOffer();
//           await peerConnection.current?.setLocalDescription(offer);
//           socket.emit("offer", { chatId, offer, to: recipientId });
//         }
//       } catch (error) {
//         console.error("WebRTC initialization error:", error);
//       }
//     };

//     initWebRTC();

//     return () => {
//       localStream.current?.getTracks().forEach((track) => track.stop());
//       peerConnection.current?.close();
//       socket?.off("offer");
//       socket?.off("answer");
//       socket?.off("iceCandidate");
//     };
//   }, [socket, chatId, recipientId, isCaller, onCallAccepted]);

//   return { isConnected };
// };

// // CallAvatar Component
// interface CallAvatarProps {
//   name: string;
//   image?: string;
//   size?: "sm" | "md" | "lg";
// }

// const CallAvatar = ({ name, image, size = "lg" }: CallAvatarProps) => {
//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   const sizeClasses = {
//     sm: "h-16 w-16",
//     md: "h-24 w-24",
//     lg: "h-32 w-32",
//   };

//   return (
//     <div className="flex items-center justify-center">
//       <Avatar className={cn("border-2 border-primary/10", sizeClasses[size])}>
//         {image ? (
//           <AvatarImage src={image} alt={name} className="object-cover" />
//         ) : null}
//         <AvatarFallback className="text-4xl bg-secondary text-secondary-foreground">
//           {initials.slice(0, 2)}
//         </AvatarFallback>
//       </Avatar>
//     </div>
//   );
// };

// // CallBackground Component
// interface CallBackgroundProps {
//   children: React.ReactNode;
//   className?: string;
// }

// const CallBackground = ({ children, className }: CallBackgroundProps) => {
//   return (
//     <div
//       className={cn(
//         "flex flex-col items-center justify-between p-8 md:p-12 bg-black w-full h-full relative overflow-hidden",
//         className
//       )}
//       style={{
//         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//       }}
//     >
//       {children}
//     </div>
//   );
// };

// // CallControls Component
// interface CallControlsProps {
//   onEndCall: () => void;
//   className?: string;
//   isConnected: boolean;
// }

// const CallControls = ({
//   onEndCall,
//   className,
//   isConnected,
// }: CallControlsProps) => {
//   const [isMuted, setIsMuted] = useState(false);

//   return (
//     <div className={cn("flex items-center justify-center gap-4", className)}>
//       <Button
//         variant="outline"
//         size="icon"
//         className={cn(
//           "h-12 w-12 rounded-full bg-neutral-800 border-0 hover:bg-neutral-700 transition-colors",
//           isMuted && "bg-neutral-700"
//         )}
//         onClick={() => setIsMuted((prev) => !prev)}
//         disabled={!isConnected}
//       >
//         {isMuted ? (
//           <MicOff className="h-5 w-5 text-red-500" />
//         ) : (
//           <Mic className="h-5 w-5 text-white" />
//         )}
//       </Button>

//       <Button
//         variant="outline"
//         size="icon"
//         className="h-12 w-12 rounded-full bg-neutral-800 border-0 hover:bg-neutral-700 transition-colors"
//         disabled
//       >
//         <VideoOff className="h-5 w-5 text-red-500" />
//       </Button>

//       <Button
//         variant="destructive"
//         size="icon"
//         className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700"
//         onClick={onEndCall}
//       >
//         <PhoneOff className="h-6 w-6" />
//       </Button>
//     </div>
//   );
// };

// // CallStatus Component
// interface CallStatusProps {
//   status: CallStatus;
//   callerName: string;
//   phoneNumber?: string;
// }

// const CallStatus = ({ status, callerName, phoneNumber }: CallStatusProps) => {
//   const [visible, setVisible] = useState(true);

//   useEffect(() => {
//     let timer: number | undefined;

//     if (status === "disconnected") {
//       setVisible(true);
//       timer = setTimeout(() => {
//         setVisible(false);
//       }, 2000);
//     } else {
//       setVisible(true);
//     }

//     return () => {
//       if (timer) clearTimeout(timer);
//     };
//   }, [status]);

//   if (!visible) return null;

//   return (
//     <div className="flex flex-col items-center justify-center gap-2 transition-opacity duration-300">
//       <h2 className="text-4xl font-semibold text-white tracking-tight">
//         {callerName}
//       </h2>

//       <div
//         className={cn(
//           "text-sm text-neutral-300 animate-in fade-in slide-in-from-bottom duration-300",
//           status === "disconnected" && "text-red-400"
//         )}
//       >
//         {status === "calling" && (
//           <div className="flex items-center gap-1">
//             <span>calling {phoneNumber}</span>
//             <span className="inline-flex gap-0.5">
//               <span className="animate-ping">.</span>
//               <span className="animate-ping animation-delay-100">.</span>
//               <span className="animate-ping animation-delay-200">.</span>
//             </span>
//           </div>
//         )}
//         {status === "connected" && "Call connected"}
//         {status === "disconnected" && "Call disconnected"}
//       </div>
//     </div>
//   );
// };

// // CallTimer Component
// interface CallTimerProps {
//   isActive: boolean;
//   onReset?: () => void;
// }

// const CallTimer = ({ isActive, onReset }: CallTimerProps) => {
//   const [seconds, setSeconds] = useState(0);

//   useEffect(() => {
//     let interval: number | undefined;

//     if (isActive) {
//       interval = setInterval(() => {
//         setSeconds((prev) => prev + 1);
//       }, 1000);
//     } else if (!isActive && seconds !== 0) {
//       setSeconds(0);
//       if (onReset) onReset();
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [isActive, seconds, onReset]);

//   const formatTime = (totalSeconds: number) => {
//     const minutes = Math.floor(totalSeconds / 60);
//     const remainingSeconds = totalSeconds % 60;
//     return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   return (
//     <div className="text-base text-center font-medium text-neutral-200">
//       {formatTime(seconds)}
//     </div>
//   );
// };

// // WaveAnimation Component
// interface WaveAnimationProps {
//   isActive: boolean;
//   className?: string;
// }

// const WaveAnimation = ({ isActive, className }: WaveAnimationProps) => {
//   if (!isActive) return null;

//   return (
//     <div className={cn("flex justify-center items-center gap-1", className)}>
//       {[1, 2, 3, 4, 5].map((i) => (
//         <div
//           key={i}
//           className={cn(
//             "bg-green-500 rounded-full w-1 h-6 animate-pulse",
//             i % 2 === 0 ? "h-4" : "h-6",
//             i === 3 && "h-8"
//           )}
//           style={{
//             animationDelay: `${i * 0.1}s`,
//             animationDuration: "1s",
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// // Main CallModal Component
// export function AudioCallModal({
//   open,
//   caller,
//   onOpenChange,
//   children,
//   initialStatus = "calling",
//   chatId,
//   userId,
//   recipientId,
//   isCaller,
// }: CallModalProps) {
//   const [status, setStatus] = useState<CallStatus>(initialStatus);
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [showAcceptReject, setShowAcceptReject] = useState(
//     !isCaller && initialStatus === "calling"
//   );

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     const socketInstance = io(import.meta.env.VITE_API_URL, {
//       auth: { token },
//       transports: ["websocket", "polling"],
//       reconnection: true,
//     });
//     setSocket(socketInstance);

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   const handleCallAccepted = () => {
//     setShowAcceptReject(false);
//     setStatus("connected");
//   };

//   const { isConnected } = useWebRTCAudio(
//     chatId,
//     userId,
//     recipientId,
//     socket,
//     isCaller,
//     handleCallAccepted
//   );

//   useEffect(() => {
//     if (isConnected && status === "calling") {
//       setStatus("connected");
//       setShowAcceptReject(false);
//     }
//   }, [isConnected, status]);

//   useEffect(() => {
//     if (open && status === "calling" && isCaller) {
//       const id = setTimeout(() => {
//         if (!isConnected) {
//           setStatus("disconnected");
//           onOpenChange(false);
//         }
//       }, 10000);

//       return () => clearTimeout(id);
//     }
//   }, [open, status, isCaller, isConnected, onOpenChange]);

//   useEffect(() => {
//     if (!open) {
//       setStatus(initialStatus);
//       setShowAcceptReject(!isCaller && initialStatus === "calling");
//     }
//   }, [open, initialStatus, isCaller]);

//   const handleEndCall = () => {
//     setStatus("disconnected");
//     socket?.emit("endCall", { chatId, to: recipientId });
//     setTimeout(() => {
//       onOpenChange(false);
//     }, 2000);
//   };

//   const handleAccept = () => {
//     socket?.emit("acceptCall", { chatId, recipientId: userId });
//     setShowAcceptReject(false);
//     setStatus("connected");
//   };

//   const handleReject = () => {
//     socket?.emit("rejectCall", { chatId });
//     setStatus("disconnected");
//     setTimeout(() => {
//       onOpenChange(false);
//     }, 2000);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       {children && <DialogTrigger asChild>{children}</DialogTrigger>}
//       <DialogContent className="p-0 border-0 max-w-md md:max-w-2xl h-[500px] md:h-[600px] bg-transparent shadow-2xl">
//         <CallBackground>
//           <div className="absolute left-0 top-0 w-full flex justify-center pt-4">
//             {status === "connected" && (
//               <CallTimer isActive={status === "connected"} />
//             )}
//           </div>

//           <div className="flex-1 flex flex-col items-center justify-center gap-8">
//             <div className="relative">
//               <CallAvatar name={caller.name} image={caller.image} />
//               {status === "connected" && (
//                 <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
//                   <WaveAnimation isActive={status === "connected"} />
//                 </div>
//               )}
//             </div>

//             <CallStatus
//               status={status}
//               callerName={caller.name}
//               phoneNumber={caller.phoneNumber}
//             />

//             {showAcceptReject && (
//               <div className="flex space-x-4">
//                 <Button
//                   variant="default"
//                   className="bg-green-500 hover:bg-green-600"
//                   onClick={handleAccept}
//                 >
//                   Accept
//                 </Button>
//                 <Button variant="destructive" onClick={handleReject}>
//                   Reject
//                 </Button>
//               </div>
//             )}
//           </div>

//           <div className="w-full">
//             <CallControls onEndCall={handleEndCall} isConnected={isConnected} />
//           </div>
//         </CallBackground>
//       </DialogContent>
//     </Dialog>
//   );
// }
