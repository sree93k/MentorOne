// import { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import BookingCard from "@/components/mentee/BookingCard";
// import FeedbackModal from "@/components/mentee/FeedbackModal";
// import { getBookings } from "@/services/bookingService";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

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
// }

// export default function BookingsPage() {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
//   const [selectedTab, setSelectedTab] = useState("upcoming");
//   const [selectedMainTab, setSelectedMainTab] = useState("all");
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalBookings, setTotalBookings] = useState(0);
//   const bookingsPerPage = 12;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         setIsLoading(true);
//         const response = await getBookings(currentPage, bookingsPerPage, "");
//         const fetchedBookings = response.data.map((booking: any) => ({
//           id: booking._id,
//           serviceId: booking.serviceId._id,
//           mentorName: `${booking.mentorId.firstName} ${booking.mentorId.lastName}`,
//           mentorImage: booking.mentorId.profilePicture,
//           mentorId: booking.mentorId._id,
//           title: booking.serviceId.title,
//           technology: booking.serviceId.technology,
//           date: new Date(booking.bookingDate).toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric",
//           }),
//           time: booking.startTime,
//           price: booking.serviceId.amount,
//           status: booking.status,
//           serviceType: booking.serviceId.type,
//           rating: booking.rating || undefined,
//           feedback: booking.feedback || undefined,
//           oneToOneType: booking.serviceId.oneToOneType || null,
//           digitalProductType: booking.serviceId.digitalProductType || null,
//         }));
//         setBookings(fetchedBookings);
//         setTotalBookings(response.total);
//       } catch (error) {
//         console.error("Failed to fetch bookings:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [currentPage]);

//   const handleFeedbackSubmit = (
//     bookingId: string,
//     rating: number,
//     feedback: string
//   ) => {
//     console.log("Feedback submitted:", { bookingId, rating, feedback });
//     setIsFeedbackModalOpen(false);
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
//       if (tab === "upcoming") {
//         filtered = filtered.filter((booking) =>
//           ["confirmed", "rescheduled"].includes(booking.status.toLowerCase())
//         );
//       } else if (tab === "pending") {
//         filtered = filtered.filter(
//           (booking) => booking.status.toLowerCase() === "pending"
//         );
//       } else if (tab === "completed") {
//         filtered = filtered.filter((booking) =>
//           ["completed", "cancelled"].includes(booking.status.toLowerCase())
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
//   }, [searchQuery, selectedTab, selectedMainTab]);

//   const filteredBookings = filterBookings(
//     bookings,
//     selectedTab,
//     selectedMainTab
//   );

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1); // Reset to first page on search
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const totalPages = Math.ceil(totalBookings / bookingsPerPage);

//   return (
//     <div className="mx-16 p-2">
//       {isLoading ? (
//         <div>Loading bookings...</div>
//       ) : (
//         <Tabs defaultValue="all" onValueChange={setSelectedMainTab}>
//           <TabsList className="flex justify-between items-center mb-6 gap-3 border-b border-gray-200 rounded-none w-full pb-6">
//             <div className="flex gap-3">
//               {["all", "Priority DM", "1-1-call", "Digital Products"].map(
//                 (tab) => (
//                   <TabsTrigger
//                     key={tab}
//                     value={tab}
//                     className={`rounded-full px-4 py-1 border border-black transition-colors duration-200
//                     ${
//                       selectedMainTab === tab
//                         ? "bg-black text-white"
//                         : "bg-white text-black"
//                     }
//                     hover:bg-black hover:text-white`}
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
//               className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
//             />
//           </TabsList>
//           {["all", "1-1-call", "Priority DM", "Digital Products"].map(
//             (mainTab) => (
//               <TabsContent key={mainTab} value={mainTab}>
//                 <Tabs defaultValue="upcoming" onValueChange={setSelectedTab}>
//                   <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 mb-8">
//                     {["upcoming", "pending", "completed"].map((tab) => (
//                       <TabsTrigger
//                         key={tab}
//                         value={tab}
//                         className={`pb-3 capitalize transition-all rounded-none ${
//                           selectedTab === tab
//                             ? "border-b-2 border-black font-semibold"
//                             : "text-muted-foreground"
//                         }`}
//                       >
//                         {tab}
//                       </TabsTrigger>
//                     ))}
//                   </TabsList>

//                   <TabsContent value="upcoming">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//                       {filteredBookings.length > 0 ? (
//                         filteredBookings.map((booking) => (
//                           <BookingCard
//                             key={booking.id}
//                             booking={booking}
//                             type="upcoming"
//                             navigateToProfile={() =>
//                               handleNavigateToProfile(booking.mentorId)
//                             }
//                           />
//                         ))
//                       ) : (
//                         <div>No upcoming bookings found.</div>
//                       )}
//                     </div>
//                   </TabsContent>

//                   <TabsContent value="pending">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//                       {filteredBookings.length > 0 ? (
//                         filteredBookings.map((booking) => (
//                           <BookingCard
//                             key={booking.id}
//                             booking={booking}
//                             type="upcoming" // Treat pending as upcoming for BookingCard behavior
//                             navigateToProfile={() =>
//                               handleNavigateToProfile(booking.mentorId)
//                             }
//                           />
//                         ))
//                       ) : (
//                         <div>No pending bookings found.</div>
//                       )}
//                     </div>
//                   </TabsContent>

//                   <TabsContent value="completed">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//                       {filteredBookings.length > 0 ? (
//                         filteredBookings.map((booking) => (
//                           <BookingCard
//                             key={booking.id}
//                             booking={booking}
//                             type="completed"
//                             navigateToProfile={() =>
//                               handleNavigateToProfile(booking.mentorId)
//                             }
//                             onFeedbackClick={() => {
//                               setSelectedBooking(booking);
//                               setIsFeedbackModalOpen(true);
//                             }}
//                           />
//                         ))
//                       ) : (
//                         <div>No completed or cancelled bookings found.</div>
//                       )}
//                     </div>
//                   </TabsContent>
//                 </Tabs>
//               </TabsContent>
//             )
//           )}
//           <div className="flex justify-center gap-2 mt-6">
//             <Button
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(currentPage - 1)}
//             >
//               Previous
//             </Button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <Button
//                 key={page}
//                 variant={currentPage === page ? "default" : "outline"}
//                 onClick={() => handlePageChange(page)}
//               >
//                 {page}
//               </Button>
//             ))}
//             <Button
//               disabled={currentPage === totalPages}
//               onClick={() => handlePageChange(currentPage + 1)}
//             >
//               Next
//             </Button>
//           </div>
//         </Tabs>
//       )}

//       <FeedbackModal
//         isOpen={isFeedbackModalOpen}
//         onClose={() => setIsFeedbackModalOpen(false)}
//         onSubmit={(rating, feedback) => {
//           if (selectedBooking) {
//             handleFeedbackSubmit(selectedBooking.id, rating, feedback);
//           }
//         }}
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
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [selectedMainTab, setSelectedMainTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const bookingsPerPage = 12;
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await getBookings(currentPage, bookingsPerPage, "");
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
        rating: booking.rating || undefined,
        feedback: booking.feedback || undefined,
        oneToOneType: booking.serviceId.oneToOneType || null,
        digitalProductType: booking.serviceId.digitalProductType || null,
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
  }, [currentPage]);

  const handleFeedbackSubmit = (
    bookingId: string,
    rating: number,
    feedback: string
  ) => {
    console.log("Feedback submitted:", { bookingId, rating, feedback });
    setIsFeedbackModalOpen(false);
  };

  const handleNavigateToProfile = (mentorId: string) => {
    navigate(`/seeker/mentorprofile/${mentorId}`);
  };

  const filterBookings = useMemo(() => {
    return (bookings: Booking[], tab: string, mainTab: string) => {
      let filtered = bookings;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (booking) =>
            booking.mentorName.toLowerCase().includes(query) ||
            booking.title.toLowerCase().includes(query)
        );
      }

      // Status filter
      if (tab === "upcoming") {
        filtered = filtered.filter((booking) =>
          ["confirmed", "rescheduled"].includes(booking.status.toLowerCase())
        );
      } else if (tab === "pending") {
        filtered = filtered.filter(
          (booking) => booking.status.toLowerCase() === "pending"
        );
      } else if (tab === "completed") {
        filtered = filtered.filter((booking) =>
          ["completed", "cancelled"].includes(booking.status.toLowerCase())
        );
      }

      // Service type filter
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
  }, [searchQuery, selectedTab, selectedMainTab]);

  const filteredBookings = filterBookings(
    bookings,
    selectedTab,
    selectedMainTab
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalBookings / bookingsPerPage);

  return (
    <div className="mx-16 p-2">
      {isLoading ? (
        <div>Loading bookings...</div>
      ) : (
        <Tabs defaultValue="all" onValueChange={setSelectedMainTab}>
          <TabsList className="flex justify-between items-center mb-6 gap-3 border-b border-gray-200 rounded-none w-full pb-6">
            <div className="flex gap-3">
              {["all", "Priority DM", "1-1-call", "Digital Products"].map(
                (tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`rounded-full px-4 py-1 border border-black transition-colors duration-200
                    ${
                      selectedMainTab === tab
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }
                    hover:bg-black hover:text-white`}
                  >
                    {tab === "1-1-call"
                      ? "1:1 Call"
                      : tab === "Priority DM"
                      ? "Priority DM"
                      : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                )
              )}
            </div>
            <Input
              type="text"
              placeholder="Search by mentor name or service title..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </TabsList>
          {["all", "1-1-call", "Priority DM", "Digital Products"].map(
            (mainTab) => (
              <TabsContent key={mainTab} value={mainTab}>
                <Tabs defaultValue="upcoming" onValueChange={setSelectedTab}>
                  <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 mb-8">
                    {["upcoming", "pending", "completed"].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className={`pb-3 capitalize transition-all rounded-none ${
                          selectedTab === tab
                            ? "border-b-2 border-black font-semibold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="upcoming">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            type="upcoming"
                            navigateToProfile={() =>
                              handleNavigateToProfile(booking.mentorId)
                            }
                            refreshBookings={fetchBookings} // Pass refresh callback
                          />
                        ))
                      ) : (
                        <div>No upcoming bookings found.</div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="pending">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            type="upcoming" // Treat pending as upcoming for BookingCard behavior
                            navigateToProfile={() =>
                              handleNavigateToProfile(booking.mentorId)
                            }
                            refreshBookings={fetchBookings} // Pass refresh callback
                          />
                        ))
                      ) : (
                        <div>No pending bookings found.</div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="completed">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            type="completed"
                            navigateToProfile={() =>
                              handleNavigateToProfile(booking.mentorId)
                            }
                            onFeedbackClick={() => {
                              setSelectedBooking(booking);
                              setIsFeedbackModalOpen(true);
                            }}
                            refreshBookings={fetchBookings} // Pass refresh callback
                          />
                        ))
                      ) : (
                        <div>No completed or cancelled bookings found.</div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            )
          )}
          <div className="flex justify-center gap-2 mt-6">
            <Button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </Tabs>
      )}

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={(rating, feedback) => {
          if (selectedBooking) {
            handleFeedbackSubmit(selectedBooking.id, rating, feedback);
          }
        }}
      />
    </div>
  );
}
