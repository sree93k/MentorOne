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
// import { setError, setLoading } from "@/redux/slices/userSlice";
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
//                   {(service.type === "1-1Call" ||
//                     service.type === "priorityDM") && (
//                     <SlotManagementDrawer
//                       mentorId={user._id}
//                       serviceId={service._id}
//                     />
//                   )}
//                   {!service?.slot &&
//                   (service.type === "1-1Call" ||
//                     service.type === "priorityDM") ? (
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
//     [toggleStats, user._id, visibleStatsCardId]
//   );

//   const renderNoServices = useCallback(
//     () => (
//       <div className="flex justify-center items-center h-64">
//         <p className="text-gray-500 text-lg">No services found...</p>
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

//  hover:border-black
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
import { ChartNoAxesCombined, ArrowBigLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { getAllServices } from "@/services/mentorService";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setError, setLoading } from "@/redux/slices/userSlice";
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
  slot?: string; // Add slot property to the Service interface
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
      setCurrentPage(1); // Reset to first page on search
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
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const renderServiceCard = useCallback(
    (service: Service) => (
      <Card key={service._id} className="border-none shadow-none">
        <div className="flex flex-row w-full border-none">
          <CardContent
            className="flex flex-row min-w-[600px]"
            style={{ width: "600px" }}
          >
            <div className="border border-black min-w-[500px] p-6">
              <div className="flex items-start">
                <div className="w-full">
                  <div className="flex flex-row justify-between">
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <h1 className="text-sm font-semibold text-gray-500">
                      {service.type}
                    </h1>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {service.type === "1-1Call" && service.duration
                      ? `${service.duration} Mins | ₹${service.amount}`
                      : `₹${service.amount}`}
                    {service.type === "DigitalProducts" &&
                    service.digitalProductType
                      ? ` | ${
                          service.digitalProductType === "documents"
                            ? "Document"
                            : "Video Tutorial"
                        }`
                      : ""}
                  </div>
                  <p className="mt-2 text-gray-500">
                    {service.shortDescription}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between w-full mt-5">
                <div className="flex p-2 gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded border-black text-black hover:bg-black hover:text-white transition-colors duration-200"
                    asChild
                  >
                    <Link to={`/expert/editService/${service._id}`}>Edit</Link>
                  </Button>
                  {service.type === "1-1Call" && (
                    <SlotManagementDrawer
                      mentorId={user._id}
                      serviceId={service._id}
                      onSlotAssigned={handleSlotAssigned}
                    />
                  )}
                  {!service?.slot && service.type === "1-1Call" ? (
                    <Badge
                      variant="destructive"
                      className="text-xs font-medium px-3 py-1.5 rounded-full animate-pulse bg-red-500 text-white"
                    >
                      <ArrowBigLeft />
                      Slots Needed!
                    </Badge>
                  ) : (
                    ""
                  )}
                </div>
                <Button
                  ref={buttonRef}
                  onClick={() => toggleStats(service._id)}
                >
                  <ChartNoAxesCombined size={36} />
                </Button>
              </div>
            </div>
            {visibleStatsCardId === service._id && (
              <div className="border border-gray-400 border-l-0">
                <div
                  ref={statsRef}
                  className="flex flex-col items-center justify-center"
                  style={{ width: "250px" }}
                >
                  <div className="grid grid-cols-2 text-center w-full">
                    <div className="border border-gray-400 border-l-0">
                      <div className="text-sm text-muted-foreground pt-8">
                        Views
                      </div>
                      <div className="font-semibold text-xl py-2">
                        {service.stats?.views || 0}
                      </div>
                    </div>
                    <div className="border border-gray-400">
                      <div className="text-sm text-muted-foreground pt-8">
                        Bookings
                      </div>
                      <div className="font-semibold text-xl py-2">
                        {service.stats?.bookings || 0}
                      </div>
                    </div>
                    <div className="border border-gray-400 border-l-0">
                      <div className="text-sm text-muted-foreground pt-8">
                        Earnings
                      </div>
                      <div className="font-semibold text-xl py-2">
                        ₹{service.stats?.earnings || 0}
                      </div>
                    </div>
                    <div className="border border-gray-400">
                      <div className="text-sm text-muted-foreground pt-8">
                        Shedule Slot
                      </div>
                      <div className="font-semibold text-xl py-2">
                        {service.stats?.conversions || "0%"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    ),
    [toggleStats, user._id, visibleStatsCardId, handleSlotAssigned]
  );

  const renderNoServices = useCallback(
    () => (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">No services found...</p>
      </div>
    ),
    []
  );

  return (
    <div className="mx-40 py-3">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button asChild className="bg-black text-white">
          <Link to="/expert/createService">Add New Service +</Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Tabs value={filterType} onValueChange={handleFilterChange}>
          <TabsList className="flex justify-start gap-2">
            <TabsTrigger
              value="all"
              className="
                rounded-md border border-gray-300
                px-4 py-2 text-sm font-medium text-gray-700
                hover:border-black
                data-[state=active]:bg-black
                data-[state=active]:text-white
                data-[state=active]:border-black
              "
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="1-1Call"
              className="
                rounded-md border border-gray-300
                px-4 py-2 text-sm font-medium text-gray-700
                hover:border-black
                data-[state=active]:bg-black
                data-[state=active]:text-white
                data-[state=active]:border-black
              "
            >
              1:1 Call
            </TabsTrigger>
            <TabsTrigger
              value="priorityDM"
              className="
                rounded-md border border-gray-300
                px-4 py-2 text-sm font-medium text-gray-700
                hover:border-black
                data-[state=active]:bg-black
                data-[state=active]:text-white
                data-[state=active]:border-black
              "
            >
              Priority DM
            </TabsTrigger>
            <TabsTrigger
              value="DigitalProducts"
              className="
                rounded-md border border-gray-300
                px-4 py-2 text-sm font-medium text-gray-700
                hover:border-black
                data-[state=active]:bg-black
                data-[state=active]:text-white
                data-[state=active]:border-black
              "
            >
              Digital Products
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          placeholder="Search services..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-sm rounded-full"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        renderNoServices()
      ) : (
        <>
          <Tabs value={filterType} onValueChange={handleFilterChange}>
            <TabsContent value={filterType}>
              {services.length > 0 ? (
                <div className="space-y-4 max-w-[800px] w-full">
                  {services.map(renderServiceCard)}
                </div>
              ) : (
                renderNoServices()
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-6">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={currentPage === page ? "default" : "outline"}
                className="mx-1"
              >
                {page}
              </Button>
            ))}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-1"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MentorService;
