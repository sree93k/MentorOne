// // import { useState, useEffect } from "react";
// // import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { Button } from "@/components/ui/button";
// // import PriorityDMModal from "@/components/modal/PriorityDMModal";
// // import ViewAnswerModal from "@/components/modal/AnswerModal";
// // import { Rating, RatingStar } from "flowbite-react";
// // import { getPriorityDMs, replyToPriorityDM } from "@/services/mentorService";
// // import { format } from "date-fns";

// // interface PriorityDM {
// //   _id: string;
// //   menteeId: {
// //     _id: string;
// //     firstName: string;
// //     lastName: string;
// //     profilePicture?: string;
// //   };
// //   content: string;
// //   pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
// //   status: "pending" | "replied" | "closed";
// //   mentorReply?: {
// //     content: string;
// //     pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
// //     repliedAt: string;
// //   };
// //   menteeTestimonial?: {
// //     comment: string;
// //     rating: number;
// //     submittedAt: string;
// //   };
// //   timestamp: string;
// // }

// // export default function PriorityDMPage() {
// //   const [selectedTab, setSelectedTab] = useState("pending");
// //   const [priorityDMs, setPriorityDMs] = useState<PriorityDM[]>([]);
// //   const [isPriorityDMModalOpen, setIsPriorityDMModalOpen] = useState(false);
// //   const [isViewAnswerModalOpen, setIsViewAnswerModalOpen] = useState(false);
// //   const [selectedDM, setSelectedDM] = useState<PriorityDM | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   // Replace with actual serviceId from mentor's services
// //   const serviceId = "683872f3a49c2881be889491"; // Example: Fetch dynamically from mentor's services

// //   useEffect(() => {
// //     const fetchPriorityDMs = async () => {
// //       try {
// //         setLoading(true);
// //         const dms = await getPriorityDMs(serviceId);
// //         setPriorityDMs(dms);
// //         setError(null);
// //       } catch (err: any) {
// //         console.error("Error fetching Priority DMs:", err);
// //         setError("Failed to load Priority DMs");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchPriorityDMs();
// //   }, [serviceId]);

// //   const handleReply = (dm: PriorityDM) => {
// //     setSelectedDM(dm);
// //     setIsPriorityDMModalOpen(true);
// //   };

// //   const handleViewAnswer = (dm: PriorityDM) => {
// //     setSelectedDM(dm);
// //     setIsViewAnswerModalOpen(true);
// //   };

// //   const handleSubmitReply = async (data: {
// //     content: string;
// //     pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
// //   }) => {
// //     if (!selectedDM) return;

// //     try {
// //       const updatedDM = await replyToPriorityDM(selectedDM._id, data);
// //       setPriorityDMs((prev) =>
// //         prev.map((dm) =>
// //           dm._id === updatedDM._id ? { ...dm, ...updatedDM } : dm
// //         )
// //       );
// //       setIsPriorityDMModalOpen(false);
// //       setSelectedDM(null);
// //     } catch (error) {
// //       console.error("Error submitting reply:", error);
// //       setError("Failed to submit reply");
// //     }
// //   };

// //   const renderDMCard = (dm: PriorityDM, index: number) => (
// //     <div key={dm._id}>
// //       {index !== 0 && <hr className="border-t border-gray-300 my-4" />}
// //       <div className="bg-gray-200 rounded-lg p-4">
// //         <div className="flex items-center gap-3 mb-4">
// //           <Avatar className="h-8 w-8">
// //             <AvatarImage src={dm.menteeId.profilePicture || ""} />
// //             <AvatarFallback>
// //               {dm.menteeId.firstName[0]}
// //               {dm.menteeId.lastName[0]}
// //             </AvatarFallback>
// //           </Avatar>
// //           <div>
// //             <p className="text-sm font-medium">
// //               {dm.menteeId.firstName} {dm.menteeId.lastName}
// //             </p>
// //             <p className="text-xs text-muted-foreground">
// //               {format(new Date(dm.timestamp), "dd MMMM yyyy, hh:mm a")}
// //             </p>
// //           </div>
// //         </div>
// //         <div
// //           className="text-sm mb-4"
// //           dangerouslySetInnerHTML={{ __html: dm.content }}
// //         />
// //         {dm.pdfFiles.length > 0 && (
// //           <div className="mb-4">
// //             <p className="text-sm font-medium">Attached Files:</p>
// //             <ul className="list-disc pl-5">
// //               {dm.pdfFiles.map((file, i) => (
// //                 <li key={i}>
// //                   <a
// //                     href={file.url}
// //                     target="_blank"
// //                     rel="noopener noreferrer"
// //                     className="text-blue-600 hover:underline"
// //                   >
// //                     {file.fileName}
// //                   </a>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         )}
// //         <div className="flex justify-between items-center">
// //           {dm.status === "replied" && dm.menteeTestimonial?.rating && (
// //             <Rating>
// //               {[...Array(5)].map((_, i) => (
// //                 <RatingStar
// //                   key={i}
// //                   filled={i < dm.menteeTestimonial!.rating}
// //                 />
// //               ))}
// //             </Rating>
// //           )}
// //           <div>
// //             {dm.status === "pending" ? (
// //               <Button
// //                 variant="default"
// //                 className="bg-blue-600 text-white rounded-full hover:bg-blue-700"
// //                 onClick={() => handleReply(dm)}
// //               >
// //                 Reply
// //               </Button>
// //             ) : (
// //               <Button
// //                 variant="default"
// //                 className="bg-green-600 text-white rounded-full hover:bg-green-700"
// //                 onClick={() => handleViewAnswer(dm)}
// //               >
// //                 Show Answer
// //               </Button>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <div className="mx-36 py-6">
// //       <h1 className="text-2xl font-bold mb-6">Priority DM</h1>

// //       {loading && <p>Loading...</p>}
// //       {error && <p className="text-red-500">{error}</p>}

// //       <Tabs value={selectedTab} onValueChange={setSelectedTab}>
// //         <TabsList className="w-full flex justify-start gap-8 border-b mb-8">
// //           {["pending", "answered"].map((tab) => (
// //             <TabsTrigger
// //               key={tab}
// //               value={tab}
// //               className={`pb-3 capitalize transition-all rounded-none ${
// //                 selectedTab === tab
// //                   ? "border-b-2 border-black font-semibold text-black"
// //                   : "text-muted-foreground"
// //               }`}
// //             >
// //               {tab}
// //             </TabsTrigger>
// //           ))}
// //         </TabsList>

// //         <TabsContent value="pending">
// //           <div className="space-y-6">
// //             {priorityDMs
// //               .filter((dm) => dm.status === "pending")
// //               .map((dm, index) => renderDMCard(dm, index))}
// //             {priorityDMs.filter((dm) => dm.status === "pending").length === 0 && (
// //               <p>No pending Priority DMs.</p>
// //             )}
// //           </div>
// //         </TabsContent>

// //         <TabsContent value="answered">
// //           <div className="space-y-6">
// //             {priorityDMs
// //               .filter((dm) => dm.status === "replied")
// //               .map((dm, index) => renderDMCard(dm, index))}
// //             {priorityDMs.filter((dm) => dm.status === "replied").length === 0 && (
// //               <p>No answered Priority DMs.</p>
// //             )}
// //           </div>
// //         </TabsContent>
// //       </Tabs>

// //       {selectedDM && (
// //         <>
// //           <PriorityDMModal
// //             isOpen={isPriorityDMModalOpen}
// //             onClose={() => {
// //               setIsPriorityDMModalOpen(false);
// //               setSelectedDM(null);
// //             }}
// //             serviceId={serviceId}
// //             bookingId={selectedDM._id} // Use DM ID for reply
// //             title="Reply to Priority DM"
// //             productType="Direct Message"
// //             onSubmit={handleSubmitReply}
// //             isMentor={true} // Indicate mentor flow
// //           />
// //           <ViewAnswerModal
// //             isOpen={isViewAnswerModalOpen}
// //             onClose={() => {
// //               setIsViewAnswerModalOpen(false);
// //               setSelectedDM(null);
// //             }}
// //             question={{
// //               content: selectedDM.content,
// //               answer: selectedDM.mentorReply?.content || "",
// //               pdfFiles: selectedDM.mentorReply?.pdfFiles || [],
// //               rating: selectedDM.menteeTestimonial?.rating,
// //               comment: selectedDM.menteeTestimonial?.comment,
// //             }}
// //             onEdit={() => {}} // No edit functionality
// //           />
// //         </>
// //       )}
// //     </div>
// //   );
// // }
// // pages/PriorityDMPage.tsx
// import { useState, useEffect } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import PriorityDMModal from "@/components/modal/PriorityDMModal";
// import AnswerModal from "@/components/modal/AnswerModal";
// import { Rating, RatingStar } from "flowbite-react";
// import { getPriorityDMs, getAllServices } from "@/services/mentorService";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";

// interface PriorityDM {
//   _id: string;
//   serviceId: { _id: string; title: string };
//   menteeId: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     profilePicture?: string;
//   };
//   bookingId: { _id: string };
//   content: string;
//   pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
//   mentorReply?: {
//     content: string;
//     pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
//     repliedAt: string;
//   };
//   status: "pending" | "replied" | "closed";
//   menteeTestimonial?: { rating: number; comment: string; submittedAt: string };
//   timestamp: string;
// }

// export default function PriorityDMPage() {
//   const [selectedTab, setSelectedTab] = useState("pending");
//   const [priorityDMs, setPriorityDMs] = useState<PriorityDM[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [answerModalOpen, setAnswerModalOpen] = useState(false);
//   const [selectedDM, setSelectedDM] = useState<PriorityDM | null>(null);
//   const { user } = useSelector((state: RootState) => state.user);

//   // Fetch all Priority DMs for the mentor
//   useEffect(() => {
//     const fetchPriorityDMs = async () => {
//       if (!user?._id) return;
//       setIsLoading(true);
//       try {
//         // Fetch mentor's services
//         const services = await getAllServices();
//         const priorityDMServices = services.filter(
//           (service) => service.type === "priorityDM"
//         );

//         // Fetch Priority DMs for all priorityDM services
//         const allDMs: PriorityDM[] = [];
//         for (const service of priorityDMServices) {
//           const dms = await getPriorityDMs(service._id);
//           allDMs.push(...dms);
//         }

//         setPriorityDMs(allDMs);
//       } catch (error) {
//         console.error("Error fetching Priority DMs:", error);
//         toast.error("Failed to load Priority DMs.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPriorityDMs();
//   }, [user?._id]);

//   const handleReply = (dm: PriorityDM) => {
//     setSelectedDM(dm);
//     setModalOpen(true);
//   };

//   const handleViewAnswer = (dm: PriorityDM) => {
//     setSelectedDM(dm);
//     setAnswerModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setModalOpen(false);
//     setSelectedDM(null);
//     // Refresh DMs after reply
//     const fetchDMs = async () => {
//       try {
//         const services = await getAllServices();
//         const priorityDMServices = services.filter(
//           (service) => service.type === "priorityDM"
//         );
//         const allDMs: PriorityDM[] = [];
//         for (const service of priorityDMServices) {
//           const dms = await getPriorityDMs(service._id);
//           allDMs.push(...dms);
//         }
//         setPriorityDMs(allDMs);
//       } catch (error) {
//         console.error("Error refreshing Priority DMs:", error);
//         toast.error("Failed to refresh Priority DMs.");
//       }
//     };
//     fetchDMs();
//   };

//   const renderDM = (dm: PriorityDM, index: number) => (
//     <div key={dm._id}>
//       {index !== 0 && <hr className="border-t border-gray-300 my-4" />}
//       <div className="bg-gray-200 rounded-lg p-4">
//         <div className="flex items-center gap-3 mb-4">
//           <Avatar className="h-8 w-8">
//             <AvatarImage src={dm.menteeId.profilePicture || ""} />
//             <AvatarFallback>{dm.menteeId.firstName[0]}</AvatarFallback>
//           </Avatar>
//           <div>
//             <p className="text-sm font-medium">
//               {dm.menteeId.firstName} {dm.menteeId.lastName}
//             </p>
//             <p className="text-xs text-muted-foreground">
//               {new Date(dm.timestamp).toLocaleString()}
//             </p>
//           </div>
//         </div>
//         <div
//           className="text-sm mb-4 ql-editor"
//           dangerouslySetInnerHTML={{ __html: dm.content }}
//         />
//         {dm.pdfFiles?.length > 0 && (
//           <div className="mb-4">
//             <p className="font-medium">Attachments:</p>
//             <div className="flex flex-wrap gap-2 mt-1">
//               {dm.pdfFiles.map((file, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center bg-gray-100 rounded-md px-2 py-1"
//                 >
//                   <FileText size={16} className="mr-1" />
//                   <span className="text-sm truncate max-w-xs">
//                     {file.fileName}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//         <div className="flex justify-between">
//           {dm.status === "pending" ? (
//             <Button
//               variant="default"
//               className="bg-blue-600 text-white rounded-full hover:bg-blue-700"
//               onClick={() => handleReply(dm)}
//             >
//               Reply
//             </Button>
//           ) : (
//             <>
//               {dm.menteeTestimonial?.rating && (
//                 <Rating>
//                   {[...Array(5)].map((_, i) => (
//                     <RatingStar
//                       key={i}
//                       filled={i < dm.menteeTestimonial.rating}
//                     />
//                   ))}
//                 </Rating>
//               )}
//               <Button
//                 variant="default"
//                 className="bg-green-600 text-white rounded-full hover:bg-green-700"
//                 onClick={() => handleViewAnswer(dm)}
//               >
//                 Show Answer
//               </Button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="mx-36 py-6">
//       <h1 className="text-2xl font-bold mb-6">Priority DM</h1>

//       <Tabs value={selectedTab} onValueChange={setSelectedTab}>
//         <TabsList className="w-full flex justify-start gap-8 border-b mb-8">
//           {["pending", "answered"].map((tab) => (
//             <TabsTrigger
//               key={tab}
//               value={tab}
//               className={`pb-3 capitalize transition-all rounded-none ${
//                 selectedTab === tab
//                   ? "border-b-2 border-black font-semibold text-black"
//                   : "text-muted-foreground"
//               }`}
//             >
//               {tab}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         <TabsContent value="pending">
//           <div className="space-y-6">
//             {isLoading ? (
//               <p>Loading...</p>
//             ) : priorityDMs.filter((dm) => dm.status === "pending").length ===
//               0 ? (
//               <p>No pending Priority DMs.</p>
//             ) : (
//               priorityDMs
//                 .filter((dm) => dm.status === "pending")
//                 .map((dm, index) => renderDM(dm, index))
//             )}
//           </div>
//         </TabsContent>

//         <TabsContent value="answered">
//           <div className="space-y-6">
//             {isLoading ? (
//               <p>Loading...</p>
//             ) : priorityDMs.filter((dm) => dm.status === "replied").length ===
//               0 ? (
//               <p>No answered Priority DMs.</p>
//             ) : (
//               priorityDMs
//                 .filter((dm) => dm.status === "replied")
//                 .map((dm, index) => renderDM(dm, index))
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>

//       {selectedDM && (
//         <>
//           <PriorityDMModal
//             isOpen={modalOpen}
//             onClose={handleModalClose}
//             serviceId={selectedDM.serviceId._id}
//             bookingId={selectedDM.bookingId._id}
//             title={selectedDM.serviceId.title}
//             productType="Direct Message"
//             existingDM={selectedDM}
//           />
//           <AnswerModal
//             isOpen={answerModalOpen}
//             onClose={() => setAnswerModalOpen(false)}
//             question={selectedDM}
//           />
//         </>
//       )}
//     </div>
//   );
// }
// src/pages/PriorityDMPage.tsx
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PriorityDMModal from "@/components/modal/PriorityDMModal";
import AnswerModal from "@/components/modal/AnswerModal";
import { Rating, RatingStar } from "flowbite-react";
import { getAllPriorityDMsByMentor } from "@/services/mentorService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { FileText } from "lucide-react";

interface PriorityDM {
  _id: string;
  serviceId: { _id: string; title: string };
  menteeId: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  bookingId: { _id: string };
  content: string;
  pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
  mentorReply?: {
    content: string;
    pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
    repliedAt: string;
  };
  status: "pending" | "replied" | "closed";
  menteeTestimonial?: { rating: number; comment: string; submittedAt: string };
  timestamp: string;
}

export default function PriorityDMPage() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [priorityDMs, setPriorityDMs] = useState<PriorityDM[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [selectedDM, setSelectedDM] = useState<PriorityDM | null>(null);
  const { user } = useSelector((state: RootState) => state.user);

  // Fetch all Priority DMs for the mentor
  useEffect(() => {
    const fetchPriorityDMs = async () => {
      if (!user?._id) return;
      setIsLoading(true);
      try {
        const dms = await getAllPriorityDMsByMentor();
        setPriorityDMs(dms);
      } catch (error) {
        console.error("Error fetching Priority DMs:", error);
        toast.error("Failed to load Priority DMs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriorityDMs();
  }, [user?._id]);

  const handleReply = (dm: PriorityDM) => {
    setSelectedDM(dm);
    setModalOpen(true);
  };

  const handleViewAnswer = (dm: PriorityDM) => {
    setSelectedDM(dm);
    setAnswerModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDM(null);
    // Refresh DMs after reply
    const fetchDMs = async () => {
      try {
        const dms = await getAllPriorityDMsByMentor();
        setPriorityDMs(dms);
      } catch (error) {
        console.error("Error refreshing Priority DMs:", error);
        toast.error("Failed to refresh Priority DMs.");
      }
    };
    fetchDMs();
  };

  const renderDM = (dm: PriorityDM, index: number) => (
    <div key={dm._id}>
      {index !== 0 && <hr className="border-t border-gray-300 my-4" />}
      <div className="bg-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={dm.menteeId.profilePicture || ""} />
            <AvatarFallback>{dm.menteeId.firstName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {dm.menteeId.firstName} {dm.menteeId.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(dm.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <div
          className="text-sm mb-4 ql-editor"
          dangerouslySetInnerHTML={{ __html: dm.content }}
        />
        {dm.pdfFiles?.length > 0 && (
          <div className="mb-4">
            <p className="font-medium">Attachments:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {dm.pdfFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center bg-gray-100 rounded-md px-2 py-1"
                >
                  <FileText size={16} className="mr-1" />
                  <span className="text-sm truncate max-w-xs">
                    {file.fileName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-between">
          {dm.status === "pending" ? (
            <Button
              variant="default"
              className="bg-blue-600 text-white rounded-full hover:bg-blue-700"
              onClick={() => handleReply(dm)}
            >
              Reply
            </Button>
          ) : (
            <>
              {dm.menteeTestimonial?.rating && (
                <Rating>
                  {[...Array(5)].map((_, i) => (
                    <RatingStar
                      key={i}
                      filled={i < dm.menteeTestimonial.rating}
                    />
                  ))}
                </Rating>
              )}
              <Button
                variant="default"
                className="bg-green-600 text-white rounded-full hover:bg-green-700"
                onClick={() => handleViewAnswer(dm)}
              >
                Show Answer
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-36 py-6">
      <h1 className="text-2xl font-bold mb-6">Priority DM</h1>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full flex justify-start gap-8 border-b mb-8">
          {["pending", "answered"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={`pb-3 capitalize transition-all rounded-none ${
                selectedTab === tab
                  ? "border-b-2 border-black font-semibold text-black"
                  : "text-muted-foreground"
              }`}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-6">
            {isLoading ? (
              <p>Loading...</p>
            ) : priorityDMs.filter((dm) => dm.status === "pending").length ===
              0 ? (
              <p>No pending Priority DMs.</p>
            ) : (
              priorityDMs
                .filter((dm) => dm.status === "pending")
                .map((dm, index) => renderDM(dm, index))
            )}
          </div>
        </TabsContent>

        <TabsContent value="answered">
          <div className="space-y-6">
            {isLoading ? (
              <p>Loading...</p>
            ) : priorityDMs.filter((dm) => dm.status === "replied").length ===
              0 ? (
              <p>No answered Priority DMs.</p>
            ) : (
              priorityDMs
                .filter((dm) => dm.status === "replied")
                .map((dm, index) => renderDM(dm, index))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {selectedDM && (
        <>
          <PriorityDMModal
            isOpen={modalOpen}
            onClose={handleModalClose}
            serviceId={selectedDM.serviceId._id}
            bookingId={selectedDM.bookingId._id}
            title={selectedDM.serviceId.title}
            productType="Direct Message"
            existingDM={selectedDM}
          />
          <AnswerModal
            isOpen={answerModalOpen}
            onClose={() => setAnswerModalOpen(false)}
            question={selectedDM}
          />
        </>
      )}
    </div>
  );
}
