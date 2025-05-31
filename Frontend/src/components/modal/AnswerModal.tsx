// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { X, Pencil } from "lucide-react";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { useState } from "react";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Rating, RatingStar } from "flowbite-react";
// // interface ViewAnswerModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   question: {
// //     user: string;
// //     avatar: string;
// //     timestamp: string;
// //     content: string;
// //     answer: string;
// //   };
// //   onEdit: (newAnswer: string) => void;
// // }

// // export default function ViewAnswerModal({
// //   isOpen,
// //   onClose,
// //   question,
// //   onEdit,
// // }: ViewAnswerModalProps) {
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [editedAnswer, setEditedAnswer] = useState(question.answer);

// //   const handleEdit = () => {
// //     onEdit(editedAnswer);
// //     setIsEditing(false);
// //   };

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onClose}>
// //       <DialogContent className="sm:max-w-[600px] bg-white">
// //         <DialogHeader>
// //           <div className="flex items-center justify-between">
// //             <DialogTitle>Answer</DialogTitle>
// //             <Button variant="ghost" size="icon" onClick={onClose}></Button>
// //           </div>
// //         </DialogHeader>
// //         <div className="space-y-4 py-4">
// //           <div className="flex items-center gap-3 mb-4 relative">
// //             <Avatar className="h-8 w-8">
// //               <AvatarImage src={question.avatar} />
// //               <AvatarFallback>{question.user[0]}</AvatarFallback>
// //             </Avatar>
// //             <div>
// //               <p className="text-sm font-medium">{question.user}</p>
// //               <p className="text-xs text-muted-foreground">
// //                 {question.timestamp}
// //               </p>
// //             </div>
// //             <div className="absolute top-3 right-4">
// //               <Rating>
// //                 <RatingStar />
// //                 <RatingStar />
// //                 <RatingStar />
// //                 <RatingStar />
// //                 <RatingStar filled={false} />
// //               </Rating>
// //             </div>
// //           </div>
// //           <p className="text-sm bg-gray-100 p-2">{question.content}</p>
// //           <div className="flex items-center gap-3 mt-6">
// //             <Avatar className="h-8 w-8">
// //               <AvatarImage src="https://github.com/shadcn.png" />
// //               <AvatarFallback>SK</AvatarFallback>
// //             </Avatar>
// //             <p className="text-sm font-medium">Sreekuttan</p>
// //             {!isEditing && (
// //               <Button
// //                 variant="ghost"
// //                 size="icon"
// //                 className="ml-auto"
// //                 onClick={() => setIsEditing(true)}
// //               >
// //                 <Pencil className="h-4 w-4" />
// //               </Button>
// //             )}
// //           </div>
// //           {isEditing ? (
// //             <>
// //               <Textarea
// //                 value={editedAnswer}
// //                 onChange={(e) => setEditedAnswer(e.target.value)}
// //                 className="min-h-[200px] bg-gray-100"
// //               />
// //               <div className="flex gap-2 justify-end">
// //                 <Button variant="outline" onClick={() => setIsEditing(false)}>
// //                   Cancel
// //                 </Button>
// //                 <Button onClick={handleEdit} className="bg-black text-white">
// //                   Save Changes
// //                 </Button>
// //               </div>
// //             </>
// //           ) : (
// //             <p className="text-sm whitespace-pre-wrap bg-gray-100 ">
// //               {question.answer}
// //             </p>
// //           )}
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }
// // components/modal/AnswerModal.tsx
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { X, FileText } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Rating, RatingStar } from "flowbite-react";
// import { getPresignedUrlForView } from "@/services/userServices";
// import toast from "react-hot-toast";

// interface AnswerModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   question: {
//     _id: string;
//     menteeId: { firstName: string; lastName: string; profilePicture?: string };
//     timestamp: string;
//     content: string;
//     pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
//     mentorReply: {
//       content: string;
//       pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
//       repliedAt: string;
//     };
//     menteeTestimonial?: { rating: number };
//   };
// }

// export default function AnswerModal({
//   isOpen,
//   onClose,
//   question,
// }: AnswerModalProps) {
//   const viewFile = async (s3Key: string) => {
//     try {
//       const url = await getPresignedUrlForView(s3Key);
//       window.open(url, "_blank");
//     } catch (error) {
//       toast.error("Failed to view PDF.");
//       console.error("Error viewing PDF:", error);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[600px] bg-white">
//         <DialogHeader>
//           <div className="flex items-center justify-between">
//             <DialogTitle>Answer</DialogTitle>
//             <Button variant="ghost" size="icon" onClick={onClose}>
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//         </DialogHeader>
//         <div className="space-y-4 py-4">
//           <div className="flex items-center gap-3 mb-4 relative">
//             <Avatar className="h-8 w-8">
//               <AvatarImage src={question.menteeId.profilePicture || ""} />
//               <AvatarFallback>{question.menteeId.firstName[0]}</AvatarFallback>
//             </Avatar>
//             <div>
//               <p className="text-sm font-medium">
//                 {question.menteeId.firstName} {question.menteeId.lastName}
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 {new Date(question.timestamp).toLocaleString()}
//               </p>
//             </div>
//             {question.menteeTestimonial?.rating && (
//               <div className="absolute top-3 right-4">
//                 <Rating>
//                   {[...Array(5)].map((_, i) => (
//                     <RatingStar
//                       key={i}
//                       filled={i < question.menteeTestimonial.rating}
//                     />
//                   ))}
//                 </Rating>
//               </div>
//             )}
//           </div>
//           <div className="text-sm bg-gray-100 p-2">
//             <div
//               className="ql-editor"
//               dangerouslySetInnerHTML={{ __html: question.content }}
//             />
//             {question.pdfFiles?.length > 0 && (
//               <div className="mt-2">
//                 <p className="font-medium">Mentee's Attachments:</p>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {question.pdfFiles.map((file, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center bg-gray-200 rounded-md px-2 py-1"
//                     >
//                       <FileText size={16} className="mr-1" />
//                       <span className="text-sm truncate max-w-xs">
//                         {file.fileName}
//                       </span>
//                       <button
//                         onClick={() => viewFile(file.s3Key)}
//                         className="ml-2 text-blue-500 hover:text-blue-700"
//                       >
//                         View
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className="flex items-center gap-3 mt-6">
//             <Avatar className="h-8 w-8">
//               <AvatarImage src="https://github.com/shadcn.png" />
//               <AvatarFallback>SK</AvatarFallback>
//             </Avatar>
//             <p className="text-sm font-medium">Mentor</p>
//           </div>
//           <div className="text-sm bg-gray-100 p-2">
//             <div
//               className="ql-editor"
//               dangerouslySetInnerHTML={{ __html: question.mentorReply.content }}
//             />
//             {question.mentorReply.pdfFiles?.length > 0 && (
//               <div className="mt-2">
//                 <p className="font-medium">Mentor's Attachments:</p>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {question.mentorReply.pdfFiles.map((file, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center bg-gray-200 rounded-md px-2 py-1"
//                     >
//                       <FileText size={16} className="mr-1" />
//                       <span className="text-sm truncate max-w-xs">
//                         {file.fileName}
//                       </span>
//                       <button
//                         onClick={() => viewFile(file.s3Key)}
//                         className="ml-2 text-blue-500 hover:text-blue-700"
//                       >
//                         View
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <p className="text-xs text-muted-foreground mt-2">
//               Replied on{" "}
//               {new Date(question.mentorReply.repliedAt).toLocaleString()}
//             </p>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
// src/components/modal/AnswerModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Rating, RatingStar } from "flowbite-react";
import { getPresignedUrlForView } from "@/services/userServices";
import toast from "react-hot-toast";

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: {
    _id: string;
    menteeId: { firstName: string; lastName: string; profilePicture?: string };
    timestamp: string;
    content: string;
    pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
    mentorReply: {
      content: string;
      pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
      repliedAt: string;
    };
    menteeTestimonial?: { rating: number };
  };
}

export default function AnswerModal({
  isOpen,
  onClose,
  question,
}: AnswerModalProps) {
  const viewFile = async (s3Key: string) => {
    try {
      const url = await getPresignedUrlForView(s3Key);
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Failed to view PDF.");
      console.error("Error viewing PDF:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Answer</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 mb-4 relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={question.menteeId.profilePicture || ""} />
              <AvatarFallback>{question.menteeId.firstName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {question.menteeId.firstName} {question.menteeId.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(question.timestamp).toLocaleString()}
              </p>
            </div>
            {question.menteeTestimonial?.rating && (
              <div className="absolute top-3 right-4">
                <Rating>
                  {[...Array(5)].map((_, i) => (
                    <RatingStar
                      key={i}
                      filled={i < question.menteeTestimonial.rating}
                    />
                  ))}
                </Rating>
              </div>
            )}
          </div>
          <div className="text-sm bg-gray-100 p-2">
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{ __html: question.content }}
            />
            {question.pdfFiles?.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Mentee's Attachments:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {question.pdfFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 rounded-md px-2 py-1"
                    >
                      <FileText size={16} className="mr-1" />
                      <span className="text-sm truncate max-w-xs">
                        {file.fileName}
                      </span>
                      <button
                        onClick={() => viewFile(file.s3Key)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 mt-6">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">Mentor</p>
          </div>
          <div className="text-sm bg-gray-100 p-2">
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{ __html: question.mentorReply.content }}
            />
            {question.mentorReply.pdfFiles?.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Mentor's Attachments:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {question.mentorReply.pdfFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 rounded-md px-2 py-1"
                    >
                      <FileText size={16} className="mr-1" />
                      <span className="text-sm truncate max-w-xs">
                        {file.fileName}
                      </span>
                      <button
                        onClick={() => viewFile(file.s3Key)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Replied on{" "}
              {new Date(question.mentorReply.repliedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
