// import { useState, useEffect } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import PriorityDMModal from "@/components/modal/PriorityDMModal";
// import AnswerModal from "@/components/modal/AnswerModal";
// import { Rating, RatingStar } from "flowbite-react";
// import { getAllPriorityDMsByMentor } from "@/services/mentorService";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { FileText } from "lucide-react";

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
//   const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
//   const [pendingPage, setPendingPage] = useState(1);
//   const [answeredPage, setAnsweredPage] = useState(1);
//   const [pendingTotal, setPendingTotal] = useState(0);
//   const [answeredTotal, setAnsweredTotal] = useState(0);
//   const [pendingSearch, setPendingSearch] = useState("");
//   const [answeredSearch, setAnsweredSearch] = useState("");
//   const [answeredSort, setAnsweredSort] = useState<"asc" | "desc">("desc");
//   const limit = 8;
//   const { user } = useSelector((state: RootState) => state.user);

//   // Fetch Priority DMs for the current tab
//   useEffect(() => {
//     const fetchPriorityDMs = async () => {
//       if (!user?._id) return;
//       setIsLoading(true);
//       try {
//         const status = selectedTab === "pending" ? "pending" : "replied";
//         const page = selectedTab === "pending" ? pendingPage : answeredPage;
//         const searchQuery =
//           selectedTab === "pending" ? pendingSearch : answeredSearch;
//         const sort = selectedTab === "answered" ? answeredSort : undefined;

//         const { priorityDMs, total } = await getAllPriorityDMsByMentor(
//           page,
//           limit,
//           searchQuery,
//           status,
//           sort
//         );

//         setPriorityDMs(priorityDMs);
//         if (selectedTab === "pending") {
//           setPendingTotal(total);
//         } else {
//           setAnsweredTotal(total);
//         }
//       } catch (error) {
//         console.error("Error fetching Priority DMs:", error);
//         toast.error("Failed to load Priority DMs.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPriorityDMs();
//   }, [
//     user?._id,
//     selectedTab,
//     pendingPage,
//     answeredPage,
//     pendingSearch,
//     answeredSearch,
//     answeredSort,
//   ]);

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
//         const { priorityDMs, total } = await getAllPriorityDMsByMentor(
//           pendingPage,
//           limit,
//           pendingSearch,
//           "pending"
//         );
//         setPriorityDMs(priorityDMs);
//         setPendingTotal(total);
//       } catch (error) {
//         console.error("Error refreshing Priority DMs:", error);
//         toast.error("Failed to refresh Priority DMs.");
//       }
//     };
//     fetchDMs();
//   };

//   const handleCardClick = (dmId: string) => {
//     setExpandedCardId(expandedCardId === dmId ? null : dmId);
//   };

//   const handlePageChange = (page: number) => {
//     if (selectedTab === "pending") {
//       setPendingPage(page);
//     } else {
//       setAnsweredPage(page);
//     }
//   };

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     if (selectedTab === "pending") {
//       setPendingSearch(value);
//       setPendingPage(1); // Reset to first page on search
//     } else {
//       setAnsweredSearch(value);
//       setAnsweredPage(1); // Reset to first page on search
//     }
//   };

//   const toggleSort = () => {
//     setAnsweredSort(answeredSort === "asc" ? "desc" : "asc");
//     setAnsweredPage(1); // Reset to first page on sort change
//   };

//   // Helper to extract first line of content, stripping HTML
//   const getFirstLine = (html: string): string => {
//     const div = document.createElement("div");
//     div.innerHTML = html;
//     const text = div.textContent || div.innerText || "";
//     const lines = text.split("\n").filter((line) => line.trim());
//     return lines[0] || "No content";
//   };

//   const renderMinimalCard = (dm: PriorityDM) => (
//     <div
//       className="bg-gray-100 rounded-lg p-3 h-24 flex items-center gap-3 cursor-pointer hover:bg-gray-200 transition-colors"
//       onClick={() => handleCardClick(dm._id)}
//     >
//       <Avatar className="h-8 w-8">
//         <AvatarImage src={dm.menteeId.profilePicture || ""} />
//         <AvatarFallback>{dm.menteeId.firstName[0]}</AvatarFallback>
//       </Avatar>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium truncate">
//           {dm.menteeId.firstName} {dm.menteeId.lastName}
//         </p>
//         <p className="text-xs text-muted-foreground truncate">
//           {getFirstLine(dm.content)}
//         </p>
//         {dm.pdfFiles?.length > 0 && (
//           <div className="flex flex-wrap gap-1 mt-1">
//             {dm.pdfFiles.map((file, i) => (
//               <div
//                 key={i}
//                 className="flex items-center bg-gray-200 rounded-md px-1 py-0.5 text-xs"
//                 title={file.fileName}
//               >
//                 <FileText size={12} className="mr-1" />
//                 <span className="truncate max-w-[100px]">{file.fileName}</span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <div className="flex gap-2">
//         {dm.status === "pending" ? (
//           <Button
//             variant="default"
//             size="sm"
//             className="bg-blue-600 text-white rounded-full hover:bg-blue-700"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleReply(dm);
//             }}
//           >
//             Reply
//           </Button>
//         ) : (
//           <>
//             {dm.menteeTestimonial?.rating && (
//               <Rating className="flex items-center">
//                 {[...Array(5)].map((_, i) => (
//                   <RatingStar
//                     key={i}
//                     filled={i < dm.menteeTestimonial.rating}
//                     size={16}
//                   />
//                 ))}
//               </Rating>
//             )}
//             <Button
//               variant="default"
//               size="sm"
//               className="bg-green-600 text-white rounded-full hover:bg-green-700"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleViewAnswer(dm);
//               }}
//             >
//               Show Answer
//             </Button>
//           </>
//         )}
//       </div>
//     </div>
//   );

//   const renderExpandedCard = (dm: PriorityDM, index: number) => (
//     <div key={dm._id}>
//       {index !== 0 && <hr className="border-t border-gray-300 my-4" />}
//       <div
//         className="bg-gray-200 rounded-lg p-4 cursor-pointer"
//         onClick={() => handleCardClick(dm._id)}
//       >
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
//               {new Date(dm.timestamp).toLocaleString("en-US", {
//                 year: "numeric",
//                 month: "2-digit",
//                 day: "2-digit",
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: true,
//               })}
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
//                   title={file.fileName}
//                 >
//                   <FileText size={16} className="mr-1" />
//                   <span className="text-sm truncate max-w-[200px]">
//                     {file.fileName}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//         <div className="flex justify-between items-center">
//           {dm.status === "pending" ? (
//             <Button
//               variant="default"
//               className="bg-blue-600 text-white rounded-full hover:bg-blue-700"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleReply(dm);
//               }}
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
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleViewAnswer(dm);
//                 }}
//               >
//                 Show Answer
//               </Button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   const renderPagination = (total: number, currentPage: number) => {
//     const totalPages = Math.ceil(total / limit);
//     return (
//       <div className="flex justify-center gap-2 mt-6">
//         <Button
//           disabled={currentPage === 1}
//           onClick={() => handlePageChange(currentPage - 1)}
//           variant="outline"
//         >
//           Previous
//         </Button>
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//           <Button
//             key={page}
//             variant={currentPage === page ? "default" : "outline"}
//             onClick={() => handlePageChange(page)}
//           >
//             {page}
//           </Button>
//         ))}
//         <Button
//           disabled={currentPage === totalPages}
//           onClick={() => handlePageChange(currentPage + 1)}
//           variant="outline"
//         >
//           Next
//         </Button>
//       </div>
//     );
//   };

//   return (
//     <div className="mx-36 py-6">
//       <h1 className="text-2xl font-bold mb-6">Priority DM</h1>

//       <Tabs value={selectedTab} onValueChange={setSelectedTab}>
//         <TabsList className="w-full flex justify-start gap-8 border-b mb-4">
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
//           <div className="mb-4">
//             <Input
//               type="text"
//               placeholder="Search by mentee name or content..."
//               value={pendingSearch}
//               onChange={handleSearch}
//               className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
//             />
//           </div>
//           <div className="space-y-4">
//             {isLoading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="flex flex-col items-center text-center">
//                   <div className="relative mb-4">
//                     <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin"></div>
//                   </div>
//                   <p className="text-gray-500 text-lg">
//                     Loading Priority DMs...
//                   </p>
//                 </div>
//               </div>
//             ) : priorityDMs.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg p-6 animate-fade-in">
//                 <div className="relative mb-4">
//                   <FileText className="w-16 h-16 text-gray-400 animate-pulse" />
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse"></div>
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//                   No Pending Priority DMs
//                 </h3>
//                 <p className="text-sm text-gray-500 mt-2 max-w-xs text-center">
//                   No pending messages to display. Check back later or engage
//                   with your mentees to receive new Priority DMs.
//                 </p>
//               </div>
//             ) : (
//               priorityDMs.map((dm, index) =>
//                 expandedCardId === dm._id
//                   ? renderExpandedCard(dm, index)
//                   : renderMinimalCard(dm)
//               )
//             )}
//           </div>
//           {pendingTotal > 0 && renderPagination(pendingTotal, pendingPage)}
//         </TabsContent>

//         <TabsContent value="answered">
//           <div className="flex justify-between items-center mb-4">
//             <Input
//               type="text"
//               placeholder="Search by mentee name or content..."
//               value={answeredSearch}
//               onChange={handleSearch}
//               className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
//             />
//             <Button variant="outline" onClick={toggleSort} className="ml-4">
//               Sort:{" "}
//               {answeredSort === "asc" ? "Oldest to Latest" : "Latest to Oldest"}
//             </Button>
//           </div>
//           <div className="space-y-4">
//             {isLoading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="flex flex-col items-center text-center">
//                   <div className="relative mb-4">
//                     <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin"></div>
//                   </div>
//                   <p className="text-gray-500 text-lg">
//                     Loading Priority DMs...
//                   </p>
//                 </div>
//               </div>
//             ) : priorityDMs.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg p-6 animate-fade-in">
//                 <div className="relative mb-4">
//                   <FileText className="w-16 h-16 text-gray-400 animate-pulse" />
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse"></div>
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//                   No Answered Priority DMs
//                 </h3>
//                 <p className="text-sm text-gray-500 mt-2 max-w-xs text-center">
//                   No answered messages to display. Respond to pending Priority
//                   DMs to see them here.
//                 </p>
//               </div>
//             ) : (
//               priorityDMs.map((dm, index) =>
//                 expandedCardId === dm._id
//                   ? renderExpandedCard(dm, index)
//                   : renderMinimalCard(dm)
//               )
//             )}
//           </div>
//           {answeredTotal > 0 && renderPagination(answeredTotal, answeredPage)}
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

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PriorityDMModal from "@/components/modal/PriorityDMModal";
import AnswerModal from "@/components/modal/AnswerModal";
import { Rating, RatingStar } from "flowbite-react";
import { getAllPriorityDMsByMentor } from "@/services/mentorService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  FileText,
  Search,
  MessageCircle,
  Clock,
  CheckCircle,
  Star,
  ArrowUpDown,
  Users,
  Calendar,
  Reply,
  Eye,
  Paperclip,
  XCircle,
} from "lucide-react";

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
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [pendingPage, setPendingPage] = useState(1);
  const [answeredPage, setAnsweredPage] = useState(1);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [answeredTotal, setAnsweredTotal] = useState(0);
  const [pendingSearch, setPendingSearch] = useState("");
  const [answeredSearch, setAnsweredSearch] = useState("");
  const [answeredSort, setAnsweredSort] = useState<"asc" | "desc">("desc");
  const limit = 8;
  const { user } = useSelector((state: RootState) => state.user);

  // Fetch Priority DMs for the current tab
  useEffect(() => {
    const fetchPriorityDMs = async () => {
      if (!user?._id) return;
      setIsLoading(true);
      try {
        const status = selectedTab === "pending" ? "pending" : "replied";
        const page = selectedTab === "pending" ? pendingPage : answeredPage;
        const searchQuery =
          selectedTab === "pending" ? pendingSearch : answeredSearch;
        const sort = selectedTab === "answered" ? answeredSort : undefined;

        const { priorityDMs, total } = await getAllPriorityDMsByMentor(
          page,
          limit,
          searchQuery,
          status,
          sort
        );

        setPriorityDMs(priorityDMs);
        if (selectedTab === "pending") {
          setPendingTotal(total);
        } else {
          setAnsweredTotal(total);
        }
      } catch (error) {
        console.error("Error fetching Priority DMs:", error);
        toast.error("Failed to load Priority DMs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriorityDMs();
  }, [
    user?._id,
    selectedTab,
    pendingPage,
    answeredPage,
    pendingSearch,
    answeredSearch,
    answeredSort,
  ]);

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
        const { priorityDMs, total } = await getAllPriorityDMsByMentor(
          pendingPage,
          limit,
          pendingSearch,
          "pending"
        );
        setPriorityDMs(priorityDMs);
        setPendingTotal(total);
      } catch (error) {
        console.error("Error refreshing Priority DMs:", error);
        toast.error("Failed to refresh Priority DMs.");
      }
    };
    fetchDMs();
  };

  const handleCardClick = (dmId: string) => {
    setExpandedCardId(expandedCardId === dmId ? null : dmId);
  };

  const handlePageChange = (page: number) => {
    if (selectedTab === "pending") {
      setPendingPage(page);
    } else {
      setAnsweredPage(page);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (selectedTab === "pending") {
      setPendingSearch(value);
      setPendingPage(1);
    } else {
      setAnsweredSearch(value);
      setAnsweredPage(1);
    }
  };

  const toggleSort = () => {
    setAnsweredSort(answeredSort === "asc" ? "desc" : "asc");
    setAnsweredPage(1);
  };

  // Helper to extract first line of content, stripping HTML
  const getFirstLine = (html: string): string => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    const lines = text.split("\n").filter((line) => line.trim());
    return lines[0] || "No content";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-slate-300 dark:text-slate-600"
        }`}
      />
    ));
  };

  const renderMinimalCard = (dm: PriorityDM) => (
    <div
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
      onClick={() => handleCardClick(dm._id)}
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-slate-200 dark:ring-slate-700">
          <AvatarImage src={dm.menteeId.profilePicture || ""} />
          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
            {dm.menteeId.firstName[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-slate-400" />
            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {dm.menteeId.firstName} {dm.menteeId.lastName}
            </p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 truncate mb-2">
            {getFirstLine(dm.content)}
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(dm.timestamp).toLocaleDateString()}
            </div>
            {dm.pdfFiles?.length > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                <span>
                  {dm.pdfFiles.length} file{dm.pdfFiles.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {dm.status === "pending" ? (
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleReply(dm);
              }}
            >
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
          ) : (
            <>
              {dm.menteeTestimonial?.rating && (
                <div className="flex items-center gap-1">
                  {renderStars(dm.menteeTestimonial.rating)}
                </div>
              )}
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewAnswer(dm);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Answer
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderExpandedCard = (dm: PriorityDM, index: number) => (
    <div key={dm._id} className="space-y-4">
      {index !== 0 && (
        <div className="border-t border-slate-200 dark:border-slate-700" />
      )}
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
        onClick={() => handleCardClick(dm._id)}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-12 w-12 ring-2 ring-slate-200 dark:ring-slate-700">
            <AvatarImage src={dm.menteeId.profilePicture || ""} />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
              {dm.menteeId.firstName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-slate-400" />
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {dm.menteeId.firstName} {dm.menteeId.lastName}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              {new Date(dm.timestamp).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 ql-editor"
            dangerouslySetInnerHTML={{ __html: dm.content }}
          />
        </div>

        {/* Attachments */}
        {dm.pdfFiles?.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Paperclip className="h-4 w-4 text-slate-500" />
              <p className="font-medium text-slate-900 dark:text-slate-100">
                Attachments ({dm.pdfFiles.length})
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dm.pdfFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600"
                  title={file.fileName}
                >
                  <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                    {file.fileName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            {dm.menteeTestimonial?.rating && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Rating:
                </span>
                <div className="flex items-center gap-1">
                  {renderStars(dm.menteeTestimonial.rating)}
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 ml-1">
                    {dm.menteeTestimonial.rating}/5
                  </span>
                </div>
              </div>
            )}
          </div>

          {dm.status === "pending" ? (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleReply(dm);
              }}
            >
              <Reply className="h-4 w-4 mr-2" />
              Reply to Message
            </Button>
          ) : (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleViewAnswer(dm);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Full Answer
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderPagination = (total: number, currentPage: number) => {
    const totalPages = Math.ceil(total / limit);
    if (totalPages <= 1) return null;

    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-slate-600 dark:text-slate-400 text-sm">
            Showing page {currentPage} of {totalPages} ({total} total messages)
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              className="px-4 py-2 rounded-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              Previous
            </Button>

            <div className="flex gap-1">
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
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    className={`w-10 h-10 rounded-lg font-semibold ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="px-4 py-2 rounded-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderNoMessages = (type: string) => (
    <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-lg mb-6">
        <MessageCircle className="h-12 w-12 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
        No {type} Priority DMs
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
        {type === "Pending"
          ? "No pending messages to display. Check back later or engage with your mentees to receive new Priority DMs."
          : "No answered messages to display. Respond to pending Priority DMs to see them here."}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Loading Priority DMs...
          </p>
        </div>
      </div>
    );
  }

  const pendingCount =
    selectedTab === "pending" ? priorityDMs.length : pendingTotal;
  const answeredCount =
    selectedTab === "answered" ? priorityDMs.length : answeredTotal;

  return (
    <div className="pl-20 max-w-7xl mx-auto px-6 py-8 space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Priority DM Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Manage and respond to priority messages from mentees
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
          <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-800 dark:text-blue-300 font-semibold">
            {pendingTotal + answeredTotal} Total Messages
          </span>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-lg border border-slate-200 dark:border-slate-700">
          <TabsList className="w-full h-16 grid grid-cols-2 bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
            {[
              {
                key: "pending",
                label: "Pending",
                icon: Clock,
                count: pendingCount,
              },
              {
                key: "answered",
                label: "Answered",
                icon: CheckCircle,
                count: answeredCount,
              },
            ].map(({ key, label, icon: Icon, count }) => (
              <TabsTrigger
                key={key}
                value={key}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedTab === key
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 dark:bg-slate-800 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {count > 0 && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold px-2 py-1 rounded-full">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Search and Sort */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by mentee name or content..."
                  value={
                    selectedTab === "pending" ? pendingSearch : answeredSearch
                  }
                  onChange={handleSearch}
                  className="pl-12 pr-4 py-3 rounded-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500"
                />
              </div>

              {selectedTab === "answered" && (
                <Button
                  onClick={toggleSort}
                  variant="outline"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Sort:{" "}
                  {answeredSort === "asc" ? "Oldest First" : "Latest First"}
                </Button>
              )}
            </div>
          </div>

          {/* Messages Content */}
          <TabsContent value="pending" className="space-y-6">
            {priorityDMs.length === 0 ? (
              renderNoMessages("Pending")
            ) : (
              <div className="space-y-4">
                {priorityDMs.map((dm, index) =>
                  expandedCardId === dm._id
                    ? renderExpandedCard(dm, index)
                    : renderMinimalCard(dm)
                )}
              </div>
            )}
            {pendingTotal > 0 && renderPagination(pendingTotal, pendingPage)}
          </TabsContent>

          <TabsContent value="answered" className="space-y-6">
            {priorityDMs.length === 0 ? (
              renderNoMessages("Answered")
            ) : (
              <div className="space-y-4">
                {priorityDMs.map((dm, index) =>
                  expandedCardId === dm._id
                    ? renderExpandedCard(dm, index)
                    : renderMinimalCard(dm)
                )}
              </div>
            )}
            {answeredTotal > 0 && renderPagination(answeredTotal, answeredPage)}
          </TabsContent>
        </div>
      </Tabs>

      {/* Modals */}
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
