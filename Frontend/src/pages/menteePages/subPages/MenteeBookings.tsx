// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import BookingCard from "@/components/mentee/BookingCard";
// import FeedbackModal from "@/components/mentee/FeedbackModal";
// import { getBookings } from "@/services/bookingService";

// // interface Booking {
// //   id: string;
// //   mentorName: string;
// //   mentorImage: string;
// //   mentorId: string;
// //   title: string;
// //   technology: string;
// //   date: string;
// //   time: string;
// //   price: number;
// //   status: string;
// //   serviceType: string;
// //   rating?: number;
// //   feedback?: string;
// //   oneToOneType?: string | null;
// //   digitalProductType?: string | null;
// // }
// interface Booking {
//   id: string;
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
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         setIsLoading(true);
//         const response = await getBookings();
//         console.log("reposne atpage is ", response);

//         const fetchedBookings = response.map((booking: any) => ({
//           id: booking._id,
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
//       } catch (error) {
//         console.error("Failed to fetch bookings:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   const handleFeedbackSubmit = (
//     bookingId: string,
//     rating: number,
//     feedback: string
//   ) => {
//     // Update booking with feedback and rating (implement API call if needed)
//     console.log("Feedback submitted:", { bookingId, rating, feedback });
//     setIsFeedbackModalOpen(false);
//   };

//   const handleNavigateToProfile = (mentorId: string) => {
//     navigate(`/seeker/mentorprofile/${mentorId}`);
//   };

//   const filterBookings = (tab: string, mainTab: string) => {
//     let filtered = bookings;

//     // Filter by status
//     if (tab === "upcoming") {
//       filtered = filtered.filter((booking) =>
//         ["confirmed", "rescheduled"].includes(booking.status)
//       );
//     } else if (tab === "completed") {
//       filtered = filtered.filter((booking) =>
//         ["completed", "cancelled"].includes(booking.status)
//       );
//     }

//     // Filter by service type
//     if (mainTab !== "all") {
//       filtered = filtered.filter((booking) => booking.serviceType === mainTab);
//     }

//     return filtered;
//   };

//   return (
//     <div className="mx-16 p-2">
//       {isLoading ? (
//         <div>Loading bookings...</div>
//       ) : (
//         // <Tabs defaultValue="all" onValueChange={setSelectedMainTab}>
//         //   <TabsList className="flex justify-start mb-6 gap-3 border-b border-gray-200 rounded-none w-full pb-6">
//         //     {["all", "query", "1-1-call", "packages"].map((tab) => (
//         //       <TabsTrigger
//         //         key={tab}
//         //         value={tab}
//         //         className={`rounded-full px-4 py-1 border border-black transition-colors duration-200
//         //           ${
//         //             selectedMainTab === tab
//         //               ? "bg-black text-white"
//         //               : "bg-white text-black"
//         //           }
//         //           hover:bg-black hover:text-white`}
//         //       >
//         //         {tab === "1-1-call"
//         //           ? "1:1 Call"
//         //           : tab.charAt(0).toUpperCase() + tab.slice(1)}
//         //       </TabsTrigger>
//         //     ))}
//         //   </TabsList>
//         <Tabs defaultValue="all" onValueChange={setSelectedMainTab}>
//           <TabsList className="flex justify-start mb-6 gap-3 border-b border-gray-200 rounded-none w-full pb-6">
//             {["all", "Priority DM", "1-1-call", "Digital Products"].map(
//               (tab) => (
//                 <TabsTrigger
//                   key={tab}
//                   value={tab}
//                   className={`rounded-full px-4 py-1 border border-black transition-colors duration-200
//           ${
//             selectedMainTab === tab
//               ? "bg-black text-white"
//               : "bg-white text-black"
//           }
//           hover:bg-black hover:text-white`}
//                 >
//                   {tab === "1-1-call"
//                     ? "1:1 Call"
//                     : tab === "Priority DM"
//                     ? "Priority DM"
//                     : tab.charAt(0).toUpperCase() + tab.slice(1)}
//                 </TabsTrigger>
//               )
//             )}
//           </TabsList>
//           {["all", "1-1-call", "Priority DM", "Digital Products"].map(
//             (mainTab) => (
//               <TabsContent key={mainTab} value={mainTab}>
//                 <Tabs defaultValue="upcoming" onValueChange={setSelectedTab}>
//                   <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 mb-8">
//                     {["upcoming", "completed"].map((tab) => (
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
//                       {filterBookings("upcoming", mainTab).length > 0 ? (
//                         filterBookings("upcoming", mainTab).map((booking) => (
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

//                   <TabsContent value="completed">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//                       {filterBookings("completed", mainTab).length > 0 ? (
//                         filterBookings("completed", mainTab).map((booking) => (
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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BookingCard from "@/components/mentee/BookingCard";
import FeedbackModal from "@/components/mentee/FeedbackModal";
import { getBookings } from "@/services/bookingService";

interface Booking {
  id: string;
  serviceId: string; // Added serviceId
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await getBookings();
        console.log("reposne atpage is ", response);

        const fetchedBookings = response.map((booking: any) => ({
          id: booking._id,
          serviceId: booking.serviceId._id, // Added serviceId
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
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleFeedbackSubmit = (
    bookingId: string,
    rating: number,
    feedback: string
  ) => {
    // Update booking with feedback and rating (implement API call if needed)
    console.log("Feedback submitted:", { bookingId, rating, feedback });
    setIsFeedbackModalOpen(false);
  };

  const handleNavigateToProfile = (mentorId: string) => {
    navigate(`/seeker/mentorprofile/${mentorId}`);
  };

  const filterBookings = (tab: string, mainTab: string) => {
    let filtered = bookings;

    // Filter by status
    if (tab === "upcoming") {
      filtered = filtered.filter((booking) =>
        ["confirmed", "rescheduled"].includes(booking.status)
      );
    } else if (tab === "completed") {
      filtered = filtered.filter((booking) =>
        ["completed", "cancelled"].includes(booking.status)
      );
    }

    // Filter by service type
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

  return (
    <div className="mx-16 p-2">
      {isLoading ? (
        <div>Loading bookings...</div>
      ) : (
        <Tabs defaultValue="all" onValueChange={setSelectedMainTab}>
          <TabsList className="flex justify-start mb-6 gap-3 border-b border-gray-200 rounded-none w-full pb-6">
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
          </TabsList>
          {["all", "1-1-call", "Priority DM", "Digital Products"].map(
            (mainTab) => (
              <TabsContent key={mainTab} value={mainTab}>
                <Tabs defaultValue="upcoming" onValueChange={setSelectedTab}>
                  <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 mb-8">
                    {["upcoming", "completed"].map((tab) => (
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
                      {filterBookings("upcoming", mainTab).length > 0 ? (
                        filterBookings("upcoming", mainTab).map((booking) => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            type="upcoming"
                            navigateToProfile={() =>
                              handleNavigateToProfile(booking.mentorId)
                            }
                          />
                        ))
                      ) : (
                        <div>No upcoming bookings found.</div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="completed">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                      {filterBookings("completed", mainTab).length > 0 ? (
                        filterBookings("completed", mainTab).map((booking) => (
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
