import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartNoAxesCombined } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { getAllServices } from "@/services/mentorService"; // Import the service

interface Service {
  _id: string;
  title: string;
  type: "1-1Call" | "priorityDM" | "DigitalProducts";
  duration?: number;
  amount: number;
  shortDescription: string;
  digitalProductType?: "documents" | "videoTutorials";
  stats?: {
    views: number;
    bookings: number;
    earnings: number;
    conversions: string;
  };
}

const MentorService: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [visibleStatsCardId, setVisibleStatsCardId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log("fetchServices step 1: Fetching services");
        const response = await getAllServices();
        console.log("fetchServices step 2: Services fetched", response);
        setServices(response);
        setLoading(false);
      } catch (error: any) {
        console.error("fetchServices error:", error);
        toast.error(
          "Failed to fetch services: " + (error.message || "Unknown error")
        );
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Toggle stats visibility
  const toggleStats = (serviceId: string) => {
    setVisibleStatsCardId((prevId) =>
      prevId === serviceId ? null : serviceId
    );
  };

  useEffect(() => {
    console.log("visibleStatsCardId >>", visibleStatsCardId);
  }, [visibleStatsCardId]);

  // Handle clicks outside stats card or button
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log("handleClickOutside step 1");
      const clickedButton =
        buttonRef.current && buttonRef.current.contains(event.target as Node);
      const clickedStats =
        statsRef.current && statsRef.current.contains(event.target as Node);
      console.log("handleClickOutside step 2", clickedButton, clickedStats);
      if (!clickedButton && !clickedStats && visibleStatsCardId !== null) {
        console.log("handleClickOutside step 3");
        setVisibleStatsCardId(null);
      }
    };
    console.log("handleClickOutside step 4");
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      console.log("handleClickOutside step 5");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visibleStatsCardId]);

  // Render service card
  const renderServiceCard = (service: Service) => (
    <Card key={service._id} className="border-none shadow-none">
      <div className="flex flex-row w-full border-none">
        <CardContent
          className="flex flex-row min-w-[600px]"
          style={{ width: "600px" }}
        >
          <div className="border border-black min-w-[500px] p-6">
            <div className="flex items-start">
              <div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
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
                <p className="mt-2">{service.shortDescription}</p>
              </div>
            </div>
            <div className="flex items-center justify-between w-full mt-5">
              <Button
                variant="outline"
                size="sm"
                className="rounded border-black text-black hover:bg-black hover:text-white transition-colors duration-200"
              >
                Edit
              </Button>
              <Button ref={buttonRef} onClick={() => toggleStats(service._id)}>
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
                      Conversions
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
  );

  return (
    <div className="mx-40 py-3">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button asChild className="bg-black text-white">
          <Link to="/expert/createService">Add New Service +</Link>
        </Button>
      </div>

      {loading ? (
        <p>Loading services...</p>
      ) : services.length === 0 ? (
        <p>No services found. Create a new service to get started.</p>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-8 flex justify-start gap-2">
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
              value="call"
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
              value="priority"
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
              value="digitalProducts"
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

          <TabsContent value="all">
            <div className="space-y-4 max-w-[800px] w-full">
              {services.map(renderServiceCard)}
            </div>
          </TabsContent>
          <TabsContent value="call">
            <div className="space-y-4 max-w-[800px] w-full">
              {services
                .filter((service) => service.type === "1-1Call")
                .map(renderServiceCard)}
            </div>
          </TabsContent>
          <TabsContent value="priority">
            <div className="space-y-4 max-w-[800px] w-full">
              {services
                .filter((service) => service.type === "priorityDM")
                .map(renderServiceCard)}
            </div>
          </TabsContent>
          <TabsContent value="digitalProducts">
            <div className="space-y-4 max-w-[800px] w-full">
              {services
                .filter((service) => service.type === "DigitalProducts")
                .map(renderServiceCard)}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default MentorService;
