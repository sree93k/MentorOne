// import { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import BookingCard from "@/components/mentee/BookingCard";
// import FeedbackModal from "@/components/mentee/FeedbackModal";
// import { getBookings } from "@/services/bookingService"; // Remove getBookingsWithTestimonials
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { CalendarDays } from "lucide-react";
// import { useSearchParams } from "react-router-dom";

// import PaymentStatusModal from "@/components/modal/PaymentStatusModal";
// interface Booking {
//   id: string;
//   serviceId: string;
//   mentorName: string;
//   mentorImage: string;
//   mentorId: string;
//   title: string;
//   technology: string;
//   date: string;
//   time: string;
//   price: number;
//   status: string;
//   serviceType: string;
//   rating?: number;
//   feedback?: string;
//   oneToOneType?: string | null;
//   digitalProductType?: string | null;
//   slot: string;
//   testimonial?: {
//     _id: string;
//     comment: string;
//     rating: number;
//   };
// }

// export default function BookingsPage() {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
//   const [selectedTab, setSelectedTab] = useState("confirmed");
//   const [selectedMainTab, setSelectedMainTab] = useState("all");
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalBookings, setTotalBookings] = useState(0);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const status = searchParams.get("status");
//   const sessionId = searchParams.get("session_id");
//   const [showModal, setShowModal] = useState(false);
//   const bookingsPerPage = 40;
//   const navigate = useNavigate();

//   const fetchBookings = async () => {
//     try {
//       setIsLoading(true);
//       const response = await getBookings(
//         currentPage,
//         bookingsPerPage,
//         searchQuery
//       );

//       console.log("MMMMMMM Mentee bookings fetchBookings step 1", response);
//       const fetchedBookings = response.data.map((booking: any) => ({
//         id: booking._id,
//         serviceId: booking.serviceId._id,
//         mentorName: `${booking.mentorId.firstName} ${booking.mentorId.lastName}`,
//         mentorImage: booking.mentorId.profilePicture,
//         mentorId: booking.mentorId._id,
//         title: booking.serviceId.title,
//         technology: booking.serviceId.technology,
//         date: new Date(booking.bookingDate).toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//         }),
//         time: booking.startTime,
//         price: booking.serviceId.amount,
//         status: booking.status,
//         serviceType: booking.serviceId.type,
//         rating: booking.testimonials?.rating || undefined,
//         feedback: booking.testimonials?.comment || undefined,
//         testimonial: booking.testimonials
//           ? {
//               _id: booking.testimonials._id,
//               comment: booking.testimonials.comment,
//               rating: booking.testimonials.rating,
//             }
//           : undefined,
//         oneToOneType: booking.serviceId.oneToOneType || null,
//         digitalProductType: booking.serviceId.digitalProductType || null,
//         slot: booking.serviceId.slot || "",
//       }));
//       setBookings(fetchedBookings);
//       setTotalBookings(response.total);
//     } catch (error) {
//       console.error("Failed to fetch bookings:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchBookings();
//   }, [currentPage, searchQuery]);

//   const handleFeedbackSubmit = async (
//     bookingId: string,
//     rating: number,
//     feedback: string
//   ) => {
//     console.log("Feedback submitted:", { bookingId, rating, feedback });
//     await fetchBookings(); // Refresh bookings to show updated testimonial
//     setIsFeedbackModalOpen(false);
//     setSelectedBooking(null);
//   };
//   const handleNavigateToProfile = (mentorId: string) => {
//     navigate(`/seeker/mentorprofile/${mentorId}`);
//   };

//   const filterBookings = useMemo(() => {
//     return (bookings: Booking[], tab: string, mainTab: string) => {
//       let filtered = bookings;

//       // Search filter
//       if (searchQuery) {
//         const query = searchQuery.toLowerCase();
//         filtered = filtered.filter(
//           (booking) =>
//             booking.mentorName.toLowerCase().includes(query) ||
//             booking.title.toLowerCase().includes(query)
//         );
//       }

//       // Status filter
//       if (tab === "confirmed") {
//         filtered = filtered.filter(
//           (booking) => booking.status.toLowerCase() === "confirmed"
//         );
//       } else if (tab === "rescheduled") {
//         filtered = filtered.filter(
//           (booking) => booking.status.toLowerCase() === "rescheduled"
//         );
//       } else if (tab === "pending") {
//         filtered = filtered.filter(
//           (booking) => booking.status.toLowerCase() === "pending"
//         );
//       } else if (tab === "completed") {
//         filtered = filtered.filter(
//           (booking) => booking.status.toLowerCase() === "completed"
//         );
//       } else if (tab === "cancelled") {
//         filtered = filtered.filter(
//           (booking) => booking.status.toLowerCase() === "cancelled"
//         );
//       }

//       // Service type filter
//       if (mainTab !== "all") {
//         const serviceTypeMap: { [key: string]: string } = {
//           "1-1-call": "1-1Call",
//           "Priority DM": "priorityDM",
//           "Digital Products": "DigitalProducts",
//         };
//         const mappedType = serviceTypeMap[mainTab] || mainTab;
//         filtered = filtered.filter(
//           (booking) => booking.serviceType === mappedType
//         );
//       }

//       return filtered;
//     };
//   }, [searchQuery]);
//   useEffect(() => {
//     if (status === "success") {
//       setShowModal(true);
//     }
//   }, [status]);

//   const handleModalClose = () => {
//     setShowModal(false);
//     searchParams.delete("status");
//     searchParams.delete("session_id");
//     setSearchParams(searchParams);
//   };

//   const filteredBookings = filterBookings(
//     bookings,
//     selectedTab,
//     selectedMainTab
//   );

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const totalPages = Math.ceil(totalBookings / bookingsPerPage);

//   return (
//     <div className="mx-16 p-2">
//       {isLoading ? (
//         <div className="text-center py-4 text-gray-600 dark:text-gray-300">
//           Loading bookings...
//         </div>
//       ) : (
//         <Tabs value={selectedMainTab} onValueChange={setSelectedMainTab}>
//           <TabsList className="flex justify-between items-center mb-6 gap-3 border-b border-gray-200 dark:border-gray-700 rounded-none w-full pb-6 bg-transparent">
//             <div className="flex gap-3">
//               {["all", "Priority DM", "1-1-call", "Digital Products"].map(
//                 (tab) => (
//                   <TabsTrigger
//                     key={tab}
//                     value={tab}
//                     className={`rounded-full px-4 py-1 border border-gray-300 dark:border-gray-600 font-medium transition-all duration-200 ${
//                       selectedMainTab === tab
//                         ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
//                         : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
//                     }`}
//                   >
//                     {tab === "1-1-call"
//                       ? "1:1 Call"
//                       : tab === "Priority DM"
//                       ? "Priority DM"
//                       : tab.charAt(0).toUpperCase() + tab.slice(1)}
//                   </TabsTrigger>
//                 )
//               )}
//             </div>
//             <Input
//               type="text"
//               placeholder="Search by mentor name or service title..."
//               value={searchQuery}
//               onChange={handleSearch}
//               className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 pr-4"
//             />
//           </TabsList>
//           {["all", "1-1-call", "Priority DM", "Digital Products"].map(
//             (mainTab) => (
//               <TabsContent key={mainTab} value={mainTab}>
//                 <Tabs value={selectedTab} onValueChange={setSelectedTab}>
//                   <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 dark:border-gray-700 mb-8 bg-transparent">
//                     {[
//                       "confirmed",
//                       "rescheduled",
//                       "pending",
//                       "completed",
//                       "cancelled",
//                     ].map((tab) => (
//                       <TabsTrigger
//                         key={tab}
//                         value={tab}
//                         className={`pb-3 capitalize transition-all rounded-none text-lg font-semibold ${
//                           selectedTab === tab
//                             ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
//                             : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
//                         }`}
//                       >
//                         {tab}
//                       </TabsTrigger>
//                     ))}
//                   </TabsList>

//                   <TabsContent value="confirmed">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-6">
//                       {filteredBookings.length > 0 ? (
//                         filteredBookings.map((booking) => (
//                           <BookingCard
//                             key={booking.id}
//                             booking={booking}
//                             serviceSlot={booking.slot}
//                             type="upcoming"
//                             navigateToProfile={() =>
//                               handleNavigateToProfile(booking.mentorId)
//                             }
//                             refreshBookings={fetchBookings}
//                           />
//                         ))
//                       ) : (
//                         <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm col-span-full">
//                           <div className="relative mb-4">
//                             <CalendarDays className="w-16 h-16 text-gray-400 animate-pulse" />
//                             <div className="absolute inset-0 flex items-center justify-center">
//                               <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
//                             </div>
//                           </div>
//                           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//                             No Confirmed Bookings
//                           </h3>
//                           <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
//                             You haven't confirmed any bookings yet. Explore
//                             mentors to schedule a session!
//                           </p>
//                           <Button
//                             variant="outline"
//                             className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
//                             onClick={() => navigate("/seeker/mentors")}
//                           >
//                             Explore Mentors
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </TabsContent>
//                   <TabsContent value="rescheduled">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-6">
//                       {filteredBookings.length > 0 ? (
//                         filteredBookings.map((booking) => (
//                           <BookingCard
//                             key={booking.id}
//                             booking={booking}
//                             serviceSlot={booking.slot}
//                             type="upcoming"
//                             navigateToProfile={() =>
//                               handleNavigateToProfile(booking.mentorId)
//                             }
//                             refreshBookings={fetchBookings}
//                           />
//                         ))
//                       ) : (
//                         <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm col-span-full">
//                           <div className="relative mb-4">
//                             <CalendarDays className="w-16 h-16 text-gray-400 animate-pulse" />
//                             <div className="absolute inset-0 flex items-center justify-center">
//                               <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
//                             </div>
//                           </div>
//                           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//                             No Rescheduled Bookings
//                           </h3>
//                           <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
//                             You have no rescheduled bookings. Book a session
//                             with a mentor today!
//                           </p>
//                           <Button
//                             variant="outline"
//                             className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
//                             onClick={() => navigate("/seeker/mentors")}
//                           >
//                             Explore Mentors
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </TabsContent>
//                   <TabsContent value="pending">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-6">
//                       {filteredBookings.length > 0 ? (
//                         filteredBookings.map((booking) => (
//                           <BookingCard
//                             key={booking.id}
//                             booking={booking}
//                             serviceSlot={booking.slot}
//                             type="upcoming"
//                             navigateToProfile={() =>
//                               handleNavigateToProfile(booking.mentorId)
//                             }
//                             refreshBookings={fetchBookings}
//                           />
//                         ))
//                       ) : (
//                         <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm col-span-full">
//                           <div className="relative mb-4">
//                             <CalendarDays className="w-16 h-16 text-gray-400 animate-pulse" />
//                             <div className="absolute inset-0 flex items-center justify-center">
//                               <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
//                             </div>
//                           </div>
//                           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//                             No Pending Bookings
//                           </h3>
//                           <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
//                             You have no pending bookings. Schedule a session
//                             with a mentor now!
//                           </p>
//                           <Button
//                             variant="outline"
//                             className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
//                             onClick={() => navigate("/seeker/mentors")}
//                           >
//                             Explore Mentors
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </TabsContent>
//                   <TabsContent value="completed">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
//                       {filteredBookings.length > 0 ? (
//                         filteredBookings.map((booking) => (
//                           <BookingCard
//                             key={booking.id}
//                             booking={booking}
//                             serviceSlot={booking.slot}
//                             type="completed"
//                             navigateToProfile={() =>
//                               handleNavigateToProfile(booking.mentorId)
//                             }
//                             onFeedbackClick={() => {
//                               setSelectedBooking(booking);
//                               setIsFeedbackModalOpen(true);
//                             }}
//                             refreshBookings={fetchBookings}
//                           />
//                         ))
//                       ) : (
//                         <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm col-span-full">
//                           <div className="relative mb-4">
//                             <CalendarDays className="w-16 h-16 text-gray-400 animate-pulse" />
//                             <div className="absolute inset-0 flex items-center justify-center">
//                               <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
//                             </div>
//                           </div>
//                           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//                             No Completed Bookings
//                           </h3>
//                           <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
//                             You haven't completed any bookings yet. Book a
//                             session to get started!
//                           </p>
//                           <Button
//                             variant="outline"
//                             className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
//                             onClick={() => navigate("/seeker/mentors")}
//                           >
//                             Explore Mentors
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </TabsContent>
//                   <TabsContent value="cancelled">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-6">
//                       {filteredBookings.length > 0 ? (
//                         filteredBookings.map((booking) => (
//                           <BookingCard
//                             key={booking.id}
//                             booking={booking}
//                             serviceSlot={booking.slot}
//                             type="completed"
//                             navigateToProfile={() =>
//                               handleNavigateToProfile(booking.mentorId)
//                             }
//                             onFeedbackClick={() => {
//                               setSelectedBooking(booking);
//                               setIsFeedbackModalOpen(true);
//                             }}
//                             refreshBookings={fetchBookings}
//                           />
//                         ))
//                       ) : (
//                         <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 animate-fade-in shadow-sm col-span-full">
//                           <div className="relative mb-4">
//                             <CalendarDays className="w-16 h-16 text-gray-400 animate-pulse" />
//                             <div className="absolute inset-0 flex items-center justify-center">
//                               <div className="w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse opacity-50"></div>
//                             </div>
//                           </div>
//                           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//                             No Cancelled Bookings
//                           </h3>
//                           <p className="text-sm text-gray-500 mt-2 max-w-sm text-center">
//                             You have no cancelled bookings. Explore mentors to
//                             book a session!
//                           </p>
//                           <Button
//                             variant="outline"
//                             className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
//                             onClick={() => navigate("/seeker/mentors")}
//                           >
//                             Explore Mentors
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </TabsContent>
//                 </Tabs>
//               </TabsContent>
//             )
//           )}
//           {totalPages > 1 && (
//             <div className="flex justify-center gap-2 mt-6">
//               <Button
//                 disabled={currentPage === 1}
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
//               >
//                 Previous
//               </Button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <Button
//                     key={page}
//                     variant={currentPage === page ? "default" : "outline"}
//                     onClick={() => handlePageChange(page)}
//                     className={`${
//                       currentPage === page
//                         ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
//                         : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
//                     } border-gray-300 dark:border-gray-600`}
//                   >
//                     {page}
//                   </Button>
//                 )
//               )}
//               <Button
//                 disabled={currentPage === totalPages}
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
//               >
//                 Next
//               </Button>
//             </div>
//           )}
//         </Tabs>
//       )}

//       <FeedbackModal
//         isOpen={isFeedbackModalOpen}
//         onClose={() => {
//           setIsFeedbackModalOpen(false);
//           setSelectedBooking(null);
//         }}
//         onSubmit={(rating, feedback) => {
//           if (selectedBooking) {
//             handleFeedbackSubmit(selectedBooking.id, rating, feedback);
//           }
//         }}
//         bookingId={selectedBooking?.id}
//         existingTestimonial={selectedBooking?.testimonial}
//       />
//       <PaymentStatusModal
//         isOpen={showModal}
//         status="success"
//         onCancel={handleModalClose}
//       />
//     </div>
//   );
// }
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BookingCard from "@/components/mentee/BookingCard";
import FeedbackModal from "@/components/mentee/FeedbackModal";
import { getBookings } from "@/services/bookingService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Activity,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Video,
  MessageSquare,
  FileText,
  BookOpen,
  Users,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import PaymentStatusModal from "@/components/modal/PaymentStatusModal";

interface Booking {
  id: string;
  serviceId: string;
  mentorName: string;
  mentorImage: string;
  mentorId: string;
  title: string;
  technology: string;
  date: string;
  time: string;
  price: number;
  status: string;
  serviceType: string;
  rating?: number;
  feedback?: string;
  oneToOneType?: string | null;
  digitalProductType?: string | null;
  slot: string;
  testimonial?: {
    _id: string;
    comment: string;
    rating: number;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("confirmed");
  const [selectedMainTab, setSelectedMainTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status");
  const sessionId = searchParams.get("session_id");
  const [showModal, setShowModal] = useState(false);
  const bookingsPerPage = 40;
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await getBookings(
        currentPage,
        bookingsPerPage,
        searchQuery
      );

      console.log("MMMMMMM Mentee bookings fetchBookings step 1", response);
      const fetchedBookings = response.data.map((booking: any) => ({
        id: booking._id,
        serviceId: booking.serviceId._id,
        mentorName: `${booking.mentorId.firstName} ${booking.mentorId.lastName}`,
        mentorImage: booking.mentorId.profilePicture,
        mentorId: booking.mentorId._id,
        title: booking.serviceId.title,
        technology: booking.serviceId.technology,
        date: new Date(booking.bookingDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        time: booking.startTime,
        price: booking.serviceId.amount,
        status: booking.status,
        serviceType: booking.serviceId.type,
        rating: booking.testimonials?.rating || undefined,
        feedback: booking.testimonials?.comment || undefined,
        testimonial: booking.testimonials
          ? {
              _id: booking.testimonials._id,
              comment: booking.testimonials.comment,
              rating: booking.testimonials.rating,
            }
          : undefined,
        oneToOneType: booking.serviceId.oneToOneType || null,
        digitalProductType: booking.serviceId.digitalProductType || null,
        slot: booking.serviceId.slot || "",
      }));
      setBookings(fetchedBookings);
      setTotalBookings(response.total);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage, searchQuery]);

  const handleFeedbackSubmit = async (
    bookingId: string,
    rating: number,
    feedback: string
  ) => {
    console.log("Feedback submitted:", { bookingId, rating, feedback });
    await fetchBookings();
    setIsFeedbackModalOpen(false);
    setSelectedBooking(null);
  };

  const handleNavigateToProfile = (mentorId: string) => {
    navigate(`/seeker/mentorprofile/${mentorId}`);
  };

  const filterBookings = useMemo(() => {
    return (bookings: Booking[], tab: string, mainTab: string) => {
      let filtered = bookings;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (booking) =>
            booking.mentorName.toLowerCase().includes(query) ||
            booking.title.toLowerCase().includes(query)
        );
      }

      if (tab === "confirmed") {
        filtered = filtered.filter(
          (booking) => booking.status.toLowerCase() === "confirmed"
        );
      } else if (tab === "rescheduled") {
        filtered = filtered.filter(
          (booking) => booking.status.toLowerCase() === "rescheduled"
        );
      } else if (tab === "pending") {
        filtered = filtered.filter(
          (booking) => booking.status.toLowerCase() === "pending"
        );
      } else if (tab === "completed") {
        filtered = filtered.filter(
          (booking) => booking.status.toLowerCase() === "completed"
        );
      } else if (tab === "cancelled") {
        filtered = filtered.filter(
          (booking) => booking.status.toLowerCase() === "cancelled"
        );
      }

      if (mainTab !== "all") {
        const serviceTypeMap: { [key: string]: string } = {
          "1-1-call": "1-1Call",
          "Priority DM": "priorityDM",
          "Digital Products": "DigitalProducts",
        };
        const mappedType = serviceTypeMap[mainTab] || mainTab;
        filtered = filtered.filter(
          (booking) => booking.serviceType === mappedType
        );
      }

      return filtered;
    };
  }, [searchQuery]);

  useEffect(() => {
    if (status === "success") {
      setShowModal(true);
    }
  }, [status]);

  const handleModalClose = () => {
    setShowModal(false);
    searchParams.delete("status");
    searchParams.delete("session_id");
    setSearchParams(searchParams);
  };

  const filteredBookings = filterBookings(
    bookings,
    selectedTab,
    selectedMainTab
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalBookings / bookingsPerPage);

  // Get service type icon
  const getServiceIcon = (type: string, subType?: string) => {
    if (type === "1-1Call") {
      return subType === "video" ? (
        <Video className="w-4 h-4" />
      ) : (
        <MessageSquare className="w-4 h-4" />
      );
    } else if (type === "priorityDM") {
      return <MessageSquare className="w-4 h-4" />;
    } else if (type === "DigitalProducts") {
      return subType === "documents" ? (
        <FileText className="w-4 h-4" />
      ) : (
        <Video className="w-4 h-4" />
      );
    }
    return <Sparkles className="w-4 h-4" />;
  };

  // Get status icon and color
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: "text-green-600",
          bgColor: "bg-green-100",
          count: bookings.filter((b) => b.status.toLowerCase() === "confirmed")
            .length,
        };
      case "pending":
        return {
          icon: <Clock className="w-4 h-4" />,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          count: bookings.filter((b) => b.status.toLowerCase() === "pending")
            .length,
        };
      case "rescheduled":
        return {
          icon: <RotateCcw className="w-4 h-4" />,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          count: bookings.filter(
            (b) => b.status.toLowerCase() === "rescheduled"
          ).length,
        };
      case "completed":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
          count: bookings.filter((b) => b.status.toLowerCase() === "completed")
            .length,
        };
      case "cancelled":
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: "text-red-600",
          bgColor: "bg-red-100",
          count: bookings.filter((b) => b.status.toLowerCase() === "cancelled")
            .length,
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          count: 0,
        };
    }
  };

  // Get service type stats
  const getServiceTypeStats = () => {
    const stats = {
      "1-1Call": bookings.filter((b) => b.serviceType === "1-1Call").length,
      priorityDM: bookings.filter((b) => b.serviceType === "priorityDM").length,
      DigitalProducts: bookings.filter(
        (b) => b.serviceType === "DigitalProducts"
      ).length,
    };
    return stats;
  };

  const serviceStats = getServiceTypeStats();

  const renderEmptyState = (tabType: string) => (
    <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl">
      <div className="mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
          {getStatusConfig(tabType).icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No {tabType.charAt(0).toUpperCase() + tabType.slice(1)} Bookings
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        {tabType === "confirmed" &&
          "You haven't confirmed any bookings yet. Explore mentors to schedule a session!"}
        {tabType === "pending" &&
          "You have no pending bookings. Schedule a session with a mentor now!"}
        {tabType === "rescheduled" &&
          "You have no rescheduled bookings. Book a session with a mentor today!"}
        {tabType === "completed" &&
          "You haven't completed any bookings yet. Book a session to get started!"}
        {tabType === "cancelled" &&
          "You have no cancelled bookings. Explore mentors to book a session!"}
      </p>
      <Button
        onClick={() => navigate("/seeker/mentors")}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
      >
        <Users className="w-5 h-5 mr-2" />
        Explore Mentors
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-8 py-1">
        {/* Header */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                My Bookings
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage your learning sessions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <p className="text-xl font-bold text-gray-900">
                      {totalBookings}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading your bookings...
              </p>
            </div>
          </div>
        ) : (
          <Tabs value={selectedMainTab} onValueChange={setSelectedMainTab}>
            {/* Main Service Type Filters */}
            <div className="mb-4 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <TabsList className="bg-white h-14 shadow-md rounded-xl p-1.5 grid grid-cols-4 gap-1">
                  <TabsTrigger
                    value="all"
                    className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    All ({totalBookings})
                  </TabsTrigger>
                  <TabsTrigger
                    value="1-1-call"
                    className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    1:1 Calls ({serviceStats["1-1Call"]})
                  </TabsTrigger>
                  <TabsTrigger
                    value="Priority DM"
                    className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Priority DMs ({serviceStats.priorityDM})
                  </TabsTrigger>
                  <TabsTrigger
                    value="Digital Products"
                    className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Digital Products ({serviceStats.DigitalProducts})
                  </TabsTrigger>
                </TabsList>

                <div className="relative w-full lg:w-96">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by mentor name or service title..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-12 pr-4 py-3 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Content for each main tab */}
            {["all", "1-1-call", "Priority DM", "Digital Products"].map(
              (mainTab) => (
                <TabsContent key={mainTab} value={mainTab}>
                  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    {/* Status Filter Tabs */}
                    <TabsList className="w-full h-18 bg-white  shadow-md rounded-2xl p-2 mb-8 grid grid-cols-5 gap-2">
                      {[
                        "confirmed",
                        "rescheduled",
                        "pending",
                        "completed",
                        "cancelled",
                      ].map((tab) => {
                        const statusConfig = getStatusConfig(tab);
                        return (
                          <TabsTrigger
                            key={tab}
                            value={tab}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                              selectedTab === tab
                                ? `${statusConfig.bgColor} ${statusConfig.color} shadow-md`
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {statusConfig.icon}
                              <span className="capitalize">{tab}</span>
                              <Badge
                                variant="secondary"
                                className="ml-1 bg-white text-gray-600"
                              >
                                {statusConfig.count}
                              </Badge>
                            </div>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    {/* Content for each status tab */}
                    {[
                      "confirmed",
                      "rescheduled",
                      "pending",
                      "completed",
                      "cancelled",
                    ].map((tab) => (
                      <TabsContent key={tab} value={tab}>
                        {filteredBookings.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBookings.map((booking) => (
                              <BookingCard
                                key={booking.id}
                                booking={booking}
                                serviceSlot={booking.slot}
                                type={
                                  tab === "completed" ? "completed" : "upcoming"
                                }
                                navigateToProfile={() =>
                                  handleNavigateToProfile(booking.mentorId)
                                }
                                onFeedbackClick={
                                  tab === "completed"
                                    ? () => {
                                        setSelectedBooking(booking);
                                        setIsFeedbackModalOpen(true);
                                      }
                                    : undefined
                                }
                                refreshBookings={fetchBookings}
                              />
                            ))}
                          </div>
                        ) : (
                          renderEmptyState(tab)
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>
              )
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="rounded-xl hover:bg-purple-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            className={`rounded-xl min-w-[40px] ${
                              currentPage === page
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                                : "hover:bg-purple-50"
                            }`}
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2 py-1">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="rounded-xl hover:bg-purple-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Tabs>
        )}
      </div>

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setSelectedBooking(null);
        }}
        onSubmit={(rating, feedback) => {
          if (selectedBooking) {
            handleFeedbackSubmit(selectedBooking.id, rating, feedback);
          }
        }}
        bookingId={selectedBooking?.id}
        existingTestimonial={selectedBooking?.testimonial}
      />

      <PaymentStatusModal
        isOpen={showModal}
        status="success"
        onCancel={handleModalClose}
      />
    </div>
  );
}
