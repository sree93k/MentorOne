// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { ChartNoAxesCombined, ArrowBigLeft } from "lucide-react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import toast from "react-hot-toast";
// import { getAllServices } from "@/services/mentorService";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { setLoading } from "@/redux/slices/userSlice";
// import SlotManagementDrawer from "@/components/mentor/SlotManagementDrawer";
// import { Badge } from "@/components/ui/badge";

// interface Service {
//   _id: string;
//   title: string;
//   type: "1-1Call" | "priorityDM" | "DigitalProducts";
//   duration?: number;
//   amount: number;
//   shortDescription: string;
//   longDescription?: string;
//   oneToOneType?: "chat" | "video";
//   digitalProductType?: "documents" | "videoTutorials";
//   fileUrl?: string;
//   exclusiveContent?: Array<{
//     season: string;
//     episodes: Array<{
//       episode: string;
//       title: string;
//       description: string;
//       videoUrl: string;
//     }>;
//   }>;
//   stats?: {
//     views: number;
//     bookings: number;
//     earnings: number;
//     conversions: string;
//   };
//   slot?: string; // Add slot property to the Service interface
// }

// const MentorService: React.FC = () => {
//   const [services, setServices] = useState<Service[]>([]);
//   const [visibleStatsCardId, setVisibleStatsCardId] = useState<string | null>(
//     null
//   );
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState("all");
//   const servicesPerPage = 8;
//   const dispatch = useDispatch();
//   const statsRef = useRef<HTMLDivElement | null>(null);
//   const buttonRef = useRef<HTMLButtonElement | null>(null);
//   const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const { user, error, loading, isAuthenticated } = useSelector(
//     (state: RootState) => state.user
//   );

//   // Debounce search query
//   useEffect(() => {
//     if (debounceTimeoutRef.current) {
//       clearTimeout(debounceTimeoutRef.current);
//     }
//     debounceTimeoutRef.current = setTimeout(() => {
//       setDebouncedSearchQuery(searchQuery);
//       setCurrentPage(1); // Reset to first page on search
//     }, 500);

//     return () => {
//       if (debounceTimeoutRef.current) {
//         clearTimeout(debounceTimeoutRef.current);
//       }
//     };
//   }, [searchQuery]);

//   // Fetch services
//   const fetchServices = useCallback(async () => {
//     try {
//       dispatch(setLoading(true));
//       const response = await getAllServices({
//         page: currentPage,
//         limit: servicesPerPage,
//         search: debouncedSearchQuery,
//         type: filterType === "all" ? undefined : filterType,
//       });
//       setServices(response.services);
//       setTotalPages(response.totalPages);
//     } catch (error: any) {
//       toast.error(
//         "Failed to fetch services: " + (error.message || "Unknown error")
//       );
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }, [currentPage, debouncedSearchQuery, filterType, dispatch]);

//   useEffect(() => {
//     fetchServices();
//   }, [fetchServices]);

//   // Callback to handle slot assignment
//   const handleSlotAssigned = useCallback(
//     (serviceId: string, scheduleId: string) => {
//       setServices((prevServices) =>
//         prevServices.map((service) =>
//           service._id === serviceId ? { ...service, slot: scheduleId } : service
//         )
//       );
//     },
//     []
//   );

//   const toggleStats = useCallback((serviceId: string) => {
//     setVisibleStatsCardId((prevId) =>
//       prevId === serviceId ? null : serviceId
//     );
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const clickedButton =
//         buttonRef.current && buttonRef.current.contains(event.target as Node);
//       const clickedStats =
//         statsRef.current && statsRef.current.contains(event.target as Node);
//       if (!clickedButton && !clickedStats && visibleStatsCardId !== null) {
//         setVisibleStatsCardId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [visibleStatsCardId]);

//   const handlePageChange = useCallback(
//     (page: number) => {
//       if (page >= 1 && page <= totalPages) {
//         setCurrentPage(page);
//       }
//     },
//     [totalPages]
//   );

//   const handleSearchChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setSearchQuery(e.target.value);
//     },
//     []
//   );

//   const handleFilterChange = useCallback((value: string) => {
//     setFilterType(value);
//     setCurrentPage(1); // Reset to first page on filter change
//   }, []);

//   const renderServiceCard = useCallback(
//     (service: Service) => (
//       <Card key={service._id} className="border-none shadow-none">
//         <div className="flex flex-row w-full border-none">
//           <CardContent
//             className="flex flex-row min-w-[600px]"
//             style={{ width: "600px" }}
//           >
//             <div className="border border-black min-w-[500px] p-6">
//               <div className="flex items-start">
//                 <div className="w-full">
//                   <div className="flex flex-row justify-between">
//                     <h3 className="text-lg font-semibold">{service.title}</h3>
//                     <h1 className="text-sm font-semibold text-gray-500">
//                       {service.type}
//                     </h1>
//                   </div>
//                   <div className="text-sm text-muted-foreground mt-1">
//                     {service.type === "1-1Call" && service.duration
//                       ? `${service.duration} Mins | ₹${service.amount}`
//                       : `₹${service.amount}`}
//                     {service.type === "DigitalProducts" &&
//                     service.digitalProductType
//                       ? ` | ${
//                           service.digitalProductType === "documents"
//                             ? "Document"
//                             : "Video Tutorial"
//                         }`
//                       : ""}
//                   </div>
//                   <p className="mt-2 text-gray-500">
//                     {service.shortDescription}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between w-full mt-5">
//                 <div className="flex p-2 gap-2 items-center">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="rounded border-black text-black hover:bg-black hover:text-white transition-colors duration-200"
//                     asChild
//                   >
//                     <Link to={`/expert/editService/${service._id}`}>Edit</Link>
//                   </Button>
//                   {service.type === "1-1Call" && (
//                     <SlotManagementDrawer
//                       mentorId={user._id}
//                       serviceId={service._id}
//                       onSlotAssigned={handleSlotAssigned}
//                     />
//                   )}
//                   {!service?.slot && service.type === "1-1Call" ? (
//                     <Badge
//                       variant="destructive"
//                       className="text-xs font-medium px-3 py-1.5 rounded-full animate-pulse bg-red-500 text-white"
//                     >
//                       <ArrowBigLeft />
//                       Slots Needed!
//                     </Badge>
//                   ) : (
//                     ""
//                   )}
//                 </div>
//                 <Button
//                   ref={buttonRef}
//                   onClick={() => toggleStats(service._id)}
//                 >
//                   <ChartNoAxesCombined size={36} />
//                 </Button>
//               </div>
//             </div>
//             {visibleStatsCardId === service._id && (
//               <div className="border border-gray-400 border-l-0">
//                 <div
//                   ref={statsRef}
//                   className="flex flex-col items-center justify-center"
//                   style={{ width: "250px" }}
//                 >
//                   <div className="grid grid-cols-2 text-center w-full">
//                     <div className="border border-gray-400 border-l-0">
//                       <div className="text-sm text-muted-foreground pt-8">
//                         Views
//                       </div>
//                       <div className="font-semibold text-xl py-2">
//                         {service.stats?.views || 0}
//                       </div>
//                     </div>
//                     <div className="border border-gray-400">
//                       <div className="text-sm text-muted-foreground pt-8">
//                         Bookings
//                       </div>
//                       <div className="font-semibold text-xl py-2">
//                         {service.stats?.bookings || 0}
//                       </div>
//                     </div>
//                     <div className="border border-gray-400 border-l-0">
//                       <div className="text-sm text-muted-foreground pt-8">
//                         Earnings
//                       </div>
//                       <div className="font-semibold text-xl py-2">
//                         ₹{service.stats?.earnings || 0}
//                       </div>
//                     </div>
//                     <div className="border border-gray-400">
//                       <div className="text-sm text-muted-foreground pt-8">
//                         Shedule Slot
//                       </div>
//                       <div className="font-semibold text-xl py-2">
//                         {service.stats?.conversions || "0%"}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </div>
//       </Card>
//     ),
//     [toggleStats, user._id, visibleStatsCardId, handleSlotAssigned]
//   );

//   const renderNoServices = useCallback(
//     () => (
//       <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg p-6">
//         <div className="mb-4">
//           <svg
//             className="w-16 h-16 text-gray-400"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//             />
//           </svg>
//         </div>
//         <h3 className="text-lg font-semibold text-gray-700">
//           No Services Found
//         </h3>
//         <p className="text-sm text-gray-500 mt-2 text-center">
//           It looks like there are no services available yet. Create a new
//           service to get started!
//         </p>
//         <Button
//           asChild
//           className="mt-4 bg-black text-white hover:bg-gray-800 transition-colors"
//         >
//           <Link to="/expert/createService">Add New Service</Link>
//         </Button>
//       </div>
//     ),
//     []
//   );

//   return (
//     <div className="mx-40 py-3">
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-2xl font-bold">Services</h1>
//         <Button asChild className="bg-black text-white">
//           <Link to="/expert/createService">Add New Service +</Link>
//         </Button>
//       </div>

//       <div className="flex items-center justify-between mb-4">
//         <Tabs value={filterType} onValueChange={handleFilterChange}>
//           <TabsList className="flex justify-start gap-2">
//             <TabsTrigger
//               value="all"
//               className="
//                 rounded-md border border-gray-300
//                 px-4 py-2 text-sm font-medium text-gray-700
//                 hover:border-black
//                 data-[state=active]:bg-black
//                 data-[state=active]:text-white
//                 data-[state=active]:border-black
//               "
//             >
//               All
//             </TabsTrigger>
//             <TabsTrigger
//               value="1-1Call"
//               className="
//                 rounded-md border border-gray-300
//                 px-4 py-2 text-sm font-medium text-gray-700
//                 hover:border-black
//                 data-[state=active]:bg-black
//                 data-[state=active]:text-white
//                 data-[state=active]:border-black
//               "
//             >
//               1:1 Call
//             </TabsTrigger>
//             <TabsTrigger
//               value="priorityDM"
//               className="
//                 rounded-md border border-gray-300
//                 px-4 py-2 text-sm font-medium text-gray-700
//                 hover:border-black
//                 data-[state=active]:bg-black
//                 data-[state=active]:text-white
//                 data-[state=active]:border-black
//               "
//             >
//               Priority DM
//             </TabsTrigger>
//             <TabsTrigger
//               value="DigitalProducts"
//               className="
//                 rounded-md border border-gray-300
//                 px-4 py-2 text-sm font-medium text-gray-700
//                 hover:border-black
//                 data-[state=active]:bg-black
//                 data-[state=active]:text-white
//                 data-[state=active]:border-black
//               "
//             >
//               Digital Products
//             </TabsTrigger>
//           </TabsList>
//         </Tabs>
//         <Input
//           placeholder="Search services..."
//           value={searchQuery}
//           onChange={handleSearchChange}
//           className="max-w-sm rounded-full"
//         />
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <p className="text-gray-500 text-lg">Loading services...</p>
//         </div>
//       ) : services.length === 0 ? (
//         renderNoServices()
//       ) : (
//         <>
//           <Tabs value={filterType} onValueChange={handleFilterChange}>
//             <TabsContent value={filterType}>
//               {services.length > 0 ? (
//                 <div className="space-y-4 max-w-[800px] w-full">
//                   {services.map(renderServiceCard)}
//                 </div>
//               ) : (
//                 renderNoServices()
//               )}
//             </TabsContent>
//           </Tabs>

//           <div className="flex justify-center mt-6">
//             <Button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="mx-1"
//             >
//               Previous
//             </Button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <Button
//                 key={page}
//                 onClick={() => handlePageChange(page)}
//                 variant={currentPage === page ? "default" : "outline"}
//                 className="mx-1"
//               >
//                 {page}
//               </Button>
//             ))}
//             <Button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="mx-1"
//             >
//               Next
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default MentorService;
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartNoAxesCombined,
  ArrowBigLeft,
  Plus,
  Search,
  TrendingUp,
  Eye,
  Calendar,
  DollarSign,
  Video,
  FileText,
  MessageSquare,
  Clock,
  Sparkles,
  Filter,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { getAllServices } from "@/services/mentorService";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setLoading } from "@/redux/slices/userSlice";
import SlotManagementDrawer from "@/components/mentor/SlotManagementDrawer";
import { Badge } from "@/components/ui/badge";

interface Service {
  _id: string;
  title: string;
  type: "1-1Call" | "priorityDM" | "DigitalProducts";
  duration?: number;
  amount: number;
  shortDescription: string;
  longDescription?: string;
  oneToOneType?: "chat" | "video";
  digitalProductType?: "documents" | "videoTutorials";
  fileUrl?: string;
  exclusiveContent?: Array<{
    season: string;
    episodes: Array<{
      episode: string;
      title: string;
      description: string;
      videoUrl: string;
    }>;
  }>;
  stats?: {
    views: number;
    bookings: number;
    earnings: number;
    conversions: string;
  };
  slot?: string;
}

const MentorService: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [visibleStatsCardId, setVisibleStatsCardId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const servicesPerPage = 8;
  const dispatch = useDispatch();
  const statsRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user, error, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  // Debounce search query
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllServices({
        page: currentPage,
        limit: servicesPerPage,
        search: debouncedSearchQuery,
        type: filterType === "all" ? undefined : filterType,
      });
      setServices(response.services);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      toast.error(
        "Failed to fetch services: " + (error.message || "Unknown error")
      );
    } finally {
      dispatch(setLoading(false));
    }
  }, [currentPage, debouncedSearchQuery, filterType, dispatch]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Callback to handle slot assignment
  const handleSlotAssigned = useCallback(
    (serviceId: string, scheduleId: string) => {
      setServices((prevServices) =>
        prevServices.map((service) =>
          service._id === serviceId ? { ...service, slot: scheduleId } : service
        )
      );
    },
    []
  );

  const toggleStats = useCallback((serviceId: string) => {
    setVisibleStatsCardId((prevId) =>
      prevId === serviceId ? null : serviceId
    );
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedButton =
        buttonRef.current && buttonRef.current.contains(event.target as Node);
      const clickedStats =
        statsRef.current && statsRef.current.contains(event.target as Node);
      if (!clickedButton && !clickedStats && visibleStatsCardId !== null) {
        setVisibleStatsCardId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visibleStatsCardId]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleFilterChange = useCallback((value: string) => {
    setFilterType(value);
    setCurrentPage(1);
  }, []);

  // Get icon for service type
  const getServiceIcon = (type: string, subType?: string) => {
    if (type === "1-1Call") {
      return subType === "video" ? (
        <Video className="w-5 h-5" />
      ) : (
        <MessageSquare className="w-5 h-5" />
      );
    } else if (type === "priorityDM") {
      return <MessageSquare className="w-5 h-5" />;
    } else if (type === "DigitalProducts") {
      return subType === "documents" ? (
        <FileText className="w-5 h-5" />
      ) : (
        <Video className="w-5 h-5" />
      );
    }
    return <Sparkles className="w-5 h-5" />;
  };

  // Get badge color for service type
  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case "1-1Call":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      case "priorityDM":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "DigitalProducts":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const renderServiceCard = useCallback(
    (service: Service) => (
      <div key={service._id} className="group">
        <div className="flex flex-row w-full">
          <Card className="flex-1 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-row">
                {/* Main Content */}
                <div className="flex-1 p-6 relative">
                  {/* Service Type Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`${getTypeBadgeStyle(
                        service.type
                      )} px-3 py-1 text-xs font-semibold rounded-full`}
                    >
                      <span className="flex items-center gap-1">
                        {getServiceIcon(
                          service.type,
                          service.digitalProductType || service.oneToOneType
                        )}
                        {service.type === "1-1Call"
                          ? "1:1 Call"
                          : service.type === "priorityDM"
                          ? "Priority DM"
                          : "Digital Product"}
                      </span>
                    </Badge>
                  </div>

                  {/* Title and Price */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 pr-32">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        ₹{service.amount}
                      </span>
                      {service.type === "1-1Call" && service.duration && (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {service.duration} mins
                        </span>
                      )}
                      {service.type === "DigitalProducts" &&
                        service.digitalProductType && (
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            {service.digitalProductType === "documents" ? (
                              <FileText className="w-4 h-4" />
                            ) : (
                              <Video className="w-4 h-4" />
                            )}
                            {service.digitalProductType === "documents"
                              ? "Document"
                              : "Video"}
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 font-semibold"
                        asChild
                      >
                        <Link to={`/expert/editService/${service._id}`}>
                          Edit Service
                        </Link>
                      </Button>

                      {service.type === "1-1Call" && (
                        <SlotManagementDrawer
                          mentorId={user._id}
                          serviceId={service._id}
                          onSlotAssigned={handleSlotAssigned}
                        />
                      )}

                      {!service?.slot && service.type === "1-1Call" && (
                        <Badge
                          variant="destructive"
                          className="animate-pulse bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
                        >
                          <ArrowBigLeft className="w-4 h-4" />
                          Slots Needed!
                        </Badge>
                      )}
                    </div>

                    <Button
                      ref={buttonRef}
                      onClick={() => toggleStats(service._id)}
                      className={`rounded-xl transition-all duration-200 ${
                        visibleStatsCardId === service._id
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                      size="sm"
                    >
                      <Activity className="w-5 h-5 mr-2" />
                      Stats
                    </Button>
                  </div>
                </div>

                {/* Stats Panel */}
                {visibleStatsCardId === service._id && (
                  <div
                    ref={statsRef}
                    className="w-72 bg-gradient-to-br from-purple-50 to-blue-50 border-l border-gray-200 animate-slideIn"
                  >
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <ChartNoAxesCombined className="w-6 h-6" />
                        Performance Metrics
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                          <Eye className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                          <div className="text-xs text-gray-500 mb-1">
                            Views
                          </div>
                          <div className="text-xl font-bold text-gray-900">
                            {service.stats?.views || 0}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                          <Calendar className="w-5 h-5 text-green-500 mx-auto mb-2" />
                          <div className="text-xs text-gray-500 mb-1">
                            Bookings
                          </div>
                          <div className="text-xl font-bold text-gray-900">
                            {service.stats?.bookings || 0}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                          <DollarSign className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                          <div className="text-xs text-gray-500 mb-1">
                            Earnings
                          </div>
                          <div className="text-xl font-bold text-gray-900">
                            ₹{service.stats?.earnings || 0}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                          <TrendingUp className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                          <div className="text-xs text-gray-500 mb-1">
                            Conversion
                          </div>
                          <div className="text-xl font-bold text-gray-900">
                            {service.stats?.conversions || "0%"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
    [toggleStats, user._id, visibleStatsCardId, handleSlotAssigned]
  );

  const renderNoServices = useCallback(
    () => (
      <div className="flex flex-col justify-center items-center py-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl">
        <div className="mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-purple-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          No Services Yet
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-6">
          Start creating amazing services to offer your expertise to mentees.
          Your journey begins with the first service!
        </p>
        <Button
          asChild
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Link to="/expert/createService">
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Service
          </Link>
        </Button>
      </div>
    ),
    []
  );

  return (
    <div className=" pl-20 min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                My Services
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and track your service offerings
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Link to="/expert/createService">
                <Plus className="w-5 h-5 mr-2" />
                Add New Service
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <Tabs
              value={filterType}
              onValueChange={handleFilterChange}
              className="w-full lg:w-auto"
            >
              <TabsList className="bg-white h-14 shadow-md rounded-xl p-1.5 grid grid-cols-4 gap-1">
                <TabsTrigger
                  value="all"
                  className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  All Services
                </TabsTrigger>
                <TabsTrigger
                  value="1-1Call"
                  className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <Video className="w-4 h-4 mr-2" />
                  1:1 Calls
                </TabsTrigger>
                <TabsTrigger
                  value="priorityDM"
                  className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Priority DMs
                </TabsTrigger>
                <TabsTrigger
                  value="DigitalProducts"
                  className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Digital Products
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search your services..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-12 pr-4 py-3 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading your services...
              </p>
            </div>
          </div>
        ) : services.length === 0 ? (
          renderNoServices()
        ) : (
          <>
            <Tabs value={filterType} onValueChange={handleFilterChange}>
              <TabsContent value={filterType}>
                {services.length > 0 ? (
                  <div className="space-y-6 w-4/6">
                    {services.map(renderServiceCard)}
                  </div>
                ) : (
                  renderNoServices()
                )}
              </TabsContent>
            </Tabs>

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
          </>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MentorService;
