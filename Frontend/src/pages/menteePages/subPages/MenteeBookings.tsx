import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BookingCard from "@/components/mentee/BookingCard";
import FeedbackModal from "@/components/mentee/FeedbackModal";
import { getBookings } from "@/services/bookingService"; // Remove getBookingsWithTestimonials
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

  const bookingsPerPage = 40;
  const navigate = useNavigate();

  // const fetchBookings = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await getBookings(currentPage, bookingsPerPage, "");
  //     console.log(" MMMMMMMM Mentee bookings fetchBookings step 1", response);

  //     const fetchedBookings = response.data.map((booking: any) => ({
  //       id: booking._id,
  //       serviceId: booking.serviceId._id,
  //       mentorName: `${booking.mentorId.firstName} ${booking.mentorId.lastName}`,
  //       mentorImage: booking.mentorId.profilePicture,
  //       mentorId: booking.mentorId._id,
  //       title: booking.serviceId.title,
  //       technology: booking.serviceId.technology,
  //       date: new Date(booking.bookingDate).toLocaleDateString("en-GB", {
  //         day: "2-digit",
  //         month: "2-digit",
  //         year: "numeric",
  //       }),
  //       time: booking.startTime,
  //       price: booking.serviceId.amount,
  //       status: booking.status,
  //       serviceType: booking.serviceId.type,
  //       rating: booking.rating || undefined,
  //       feedback: booking.feedback || undefined,
  //       oneToOneType: booking.serviceId.oneToOneType || null,
  //       digitalProductType: booking.serviceId.digitalProductType || null,
  //       slot: booking.serviceId.slot || "",
  //     }));
  //     setBookings(fetchedBookings);
  //     setTotalBookings(response.total);
  //   } catch (error) {
  //     console.error("Failed to fetch bookings:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // const fetchBookings = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await getBookings(currentPage, bookingsPerPage, "");
  //     console.log(" MMMMMMMM Mentee bookings fetchBookings step 1", response);

  //     const fetchedBookings = response.data.map((booking: any) => ({
  //       id: booking._id,
  //       serviceId: booking.serviceId._id,
  //       mentorName: `${booking.mentorId.firstName} ${booking.mentorId.lastName}`,
  //       mentorImage: booking.mentorId.profilePicture,
  //       mentorId: booking.mentorId._id,
  //       title: booking.serviceId.title,
  //       technology: booking.serviceId.technology,
  //       date: new Date(booking.bookingDate).toLocaleDateString("en-GB", {
  //         day: "2-digit",
  //         month: "2-digit",
  //         year: "numeric",
  //       }),
  //       time: booking.startTime,
  //       price: booking.serviceId.amount,
  //       status: booking.status,
  //       serviceType: booking.serviceId.type,
  //       rating: booking.testimonials?.rating || undefined,
  //       feedback: booking.testimonials?.comment || undefined,
  //       testimonial: booking.testimonials
  //         ? {
  //             _id: booking.testimonials._id,
  //             comment: booking.testimonials.comment,
  //             rating: booking.testimonials.rating,
  //           }
  //         : undefined,
  //       oneToOneType: booking.serviceId.oneToOneType || null,
  //       digitalProductType: booking.serviceId.digitalProductType || null,
  //       slot: booking.serviceId.slot || "",
  //     }));
  //     setBookings(fetchedBookings);
  //     setTotalBookings(response.total);
  //   } catch (error) {
  //     console.error("Failed to fetch bookings:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
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

  // const handleFeedbackSubmit = (
  //   bookingId: string,
  //   rating: number,
  //   feedback: string
  // ) => {
  //   console.log("Feedback submitted:", { bookingId, rating, feedback });
  //   setIsFeedbackModalOpen(false);
  //   setSelectedBooking(null);
  // };
  // const handleFeedbackSubmit = async (
  //   bookingId: string,
  //   rating: number,
  //   feedback: string
  // ) => {
  //   console.log("Feedback submitted:", { bookingId, rating, feedback });
  //   await fetchBookings(); // Refresh bookings to show updated testimonial
  //   setIsFeedbackModalOpen(false);
  //   setSelectedBooking(null);
  // };
  const handleFeedbackSubmit = async (
    bookingId: string,
    rating: number,
    feedback: string
  ) => {
    console.log("Feedback submitted:", { bookingId, rating, feedback });
    await fetchBookings(); // Refresh bookings to show updated testimonial
    setIsFeedbackModalOpen(false);
    setSelectedBooking(null);
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
  }, [searchQuery]);

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

  return (
    <div className="mx-16 p-2">
      {isLoading ? (
        <div className="text-center py-4 text-gray-600 dark:text-gray-300">
          Loading bookings...
        </div>
      ) : (
        <Tabs value={selectedMainTab} onValueChange={setSelectedMainTab}>
          <TabsList className="flex justify-between items-center mb-6 gap-3 border-b border-gray-200 dark:border-gray-700 rounded-none w-full pb-6 bg-transparent">
            <div className="flex gap-3">
              {["all", "Priority DM", "1-1-call", "Digital Products"].map(
                (tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`rounded-full px-4 py-1 border border-gray-300 dark:border-gray-600 font-medium transition-all duration-200 ${
                      selectedMainTab === tab
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                        : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
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
              className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 pr-4"
            />
          </TabsList>
          {["all", "1-1-call", "Priority DM", "Digital Products"].map(
            (mainTab) => (
              <TabsContent key={mainTab} value={mainTab}>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="w-full flex justify-start gap-8 border-b border-gray-200 dark:border-gray-700 mb-8 bg-transparent">
                    {[
                      "confirmed",
                      "rescheduled",
                      "pending",
                      "completed",
                      "cancelled",
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className={`pb-3 capitalize transition-all rounded-none text-lg font-semibold ${
                          selectedTab === tab
                            ? "border-b-2 border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="confirmed">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            serviceSlot={booking.slot}
                            type="upcoming"
                            navigateToProfile={() =>
                              handleNavigateToProfile(booking.mentorId)
                            }
                            refreshBookings={fetchBookings}
                          />
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-600 dark:text-gray-300">
                          No confirmed bookings found.
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="rescheduled">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            serviceSlot={booking.slot}
                            type="upcoming"
                            navigateToProfile={() =>
                              handleNavigateToProfile(booking.mentorId)
                            }
                            refreshBookings={fetchBookings}
                          />
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-600 dark:text-gray-300">
                          No rescheduled bookings found.
                        </div>
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
                            serviceSlot={booking.slot}
                            type="upcoming"
                            navigateToProfile={() =>
                              handleNavigateToProfile(booking.mentorId)
                            }
                            refreshBookings={fetchBookings}
                          />
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-600 dark:text-gray-300">
                          No pending bookings found.
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="completed">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            serviceSlot={booking.slot}
                            type="completed"
                            navigateToProfile={() =>
                              handleNavigateToProfile(booking.mentorId)
                            }
                            onFeedbackClick={() => {
                              setSelectedBooking(booking);
                              setIsFeedbackModalOpen(true);
                            }}
                            refreshBookings={fetchBookings}
                          />
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-600 dark:text-gray-300">
                          No completed bookings found.
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="cancelled">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            serviceSlot={booking.slot}
                            type="completed"
                            navigateToProfile={() =>
                              handleNavigateToProfile(booking.mentorId)
                            }
                            onFeedbackClick={() => {
                              setSelectedBooking(booking);
                              setIsFeedbackModalOpen(true);
                            }}
                            refreshBookings={fetchBookings}
                          />
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-600 dark:text-gray-300">
                          No cancelled bookings found.
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            )
          )}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className={`${
                      currentPage === page
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                        : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                    } border-gray-300 dark:border-gray-600`}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Next
              </Button>
            </div>
          )}
        </Tabs>
      )}

      {/* <FeedbackModal
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
      /> */}
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
    </div>
  );
}
