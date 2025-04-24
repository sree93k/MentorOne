import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartNoAxesCombined } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const services = [
  {
    id: 1,
    title: "MockInterview",
    duration: "30 Mins",
    price: "₹300 Only",
    description: "To make you confident and ready for those tough questions",
    stats: {
      views: 23,
      bookings: 12,
      earnings: 3600,
      conversions: "63 %",
    },
  },
  {
    id: 2,
    title: "MockInterview",
    duration: "30 Mins",
    price: "₹300 Only",
    description: "To make you confident and ready for those tough questions",
    stats: {
      views: 23,
      bookings: 12,
      earnings: 3600,
      conversions: "63 %",
    },
  },
];

const MentorService: React.FC = () => {
  const [visibleStatsCardId, setVisibleStatsCardId] = useState<number | null>(
    null
  );
  const statsRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null); // Add this ref for the button

  // Toggle stats visibility
  const toggleStats = (serviceId: number) => {
    setVisibleStatsCardId((prevId) =>
      prevId === serviceId ? null : serviceId
    );
  };

  useEffect(() => {
    console.log("visibleStatsCardId >>", visibleStatsCardId);
  }, [visibleStatsCardId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click was on the button or stats card
      console.log("handleClickOutside step1");

      const clickedButton =
        buttonRef.current && buttonRef.current.contains(event.target as Node);
      const clickedStats =
        statsRef.current && statsRef.current.contains(event.target as Node);
      console.log("handleClickOutside step2", clickedButton, clickedStats);
      // Only hide if click was outside both the button and stats card
      if (!clickedButton && !clickedStats && visibleStatsCardId !== null) {
        console.log("handleClickOutside step3");
        setVisibleStatsCardId(null);
      }
    };
    console.log("handleClickOutside step4");
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      console.log("handleClickOutside step5");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visibleStatsCardId]);

  return (
    <div className="mx-40 py-3">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button asChild className="bg-black text-white">
          <Link to="/expert/createService">Add New Service +</Link>
        </Button>
      </div>

      <Tabs defaultValue="call">
        <TabsList className="mb-8 flex justify-start gap-2">
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
            value="digitalProdcuts"
            className="
              rounded-md border border-gray-300 
              px-4 py-2 text-sm font-medium text-gray-700
              hover:border-black
              data-[state=active]:bg-black
              data-[state=active]:text-white
              data-[state=active]:border-black
            "
          >
            Digital Prodcuts
          </TabsTrigger>
          {/* <TabsTrigger
            value="package2"
            className="
              rounded-md border border-gray-300 
              px-4 py-2 text-sm font-medium text-gray-700
              hover:border-black
              data-[state=active]:bg-black
              data-[state=active]:text-white
              data-[state=active]:border-black
            "
          >
            Package
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="call">
          <div className="space-y-4 max-w-[800px] w-full">
            {services.map((service) => (
              <Card key={service.id} className="border-none shadow-none">
                <div className="flex flex-row w-full border-none">
                  <CardContent
                    className=" flex flex-row  min-x-[600px]"
                    style={{ width: "600px" }}
                  >
                    <div className=" border border-black  min-w-[500px] p-6">
                      <div className="flex items-start ">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {service.title}
                          </h3>
                          <div className="text-sm text-muted-foreground mt-1">
                            {service.duration} | {service.price}
                          </div>
                          <p className="mt-2">{service.description}</p>
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
                        <Button
                          ref={buttonRef} // Add the ref to your button
                          onClick={() => toggleStats(service.id)}
                        >
                          <ChartNoAxesCombined size={36} />
                        </Button>
                      </div>
                    </div>
                    {visibleStatsCardId === service.id && (
                      <div className=" border border-gray-400 border-l-0">
                        <div
                          ref={statsRef}
                          className="flex flex-col items-center justify-center "
                          style={{ width: "250px" }}
                        >
                          <div className="grid grid-cols-2 text-center w-full ">
                            <div className="border border-gray-400 border-l-0">
                              <div className="text-sm text-muted-foreground pt-8">
                                Views
                              </div>
                              <div className="font-semibold text-xl py-2">
                                {service.stats?.views}
                              </div>
                            </div>
                            <div className="border border-gray-400 ">
                              <div className="text-sm text-muted-foreground pt-8">
                                Bookings
                              </div>
                              <div className="font-semibold text-xl py-2">
                                {service.stats?.bookings}
                              </div>
                            </div>
                            <div className="border border-gray-400 border-l-0">
                              <div className="text-sm text-muted-foreground pt-8">
                                Earnings
                              </div>
                              <div className="font-semibold text-xl py-2">
                                ₹{service.stats?.earnings}
                              </div>
                            </div>
                            <div className="border border-gray-400 ">
                              <div className="text-sm text-muted-foreground pt-8">
                                Conversions
                              </div>
                              <div className="font-semibold text-xl py-2">
                                {service.stats?.conversions}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="priority">
          <p>Content for Priority DM</p>
        </TabsContent>
        <TabsContent value="digitalProducts">
          <p>DigitalProducts #1 details</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorService;
