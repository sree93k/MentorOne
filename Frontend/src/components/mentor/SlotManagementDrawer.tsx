// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import {
//   getMentorCalendar,
//   assignScheduleToService,
// } from "@/services/mentorService";
// import toast from "react-hot-toast";

// interface Schedule {
//   _id: string;
//   scheduleName: string;
// }

// interface SlotManagementDrawerProps {
//   mentorId: string;
//   serviceId: string;
//   onSlotAssigned: (serviceId: string, scheduleId: string) => void;
// }

// const SlotManagementDrawer: React.FC<SlotManagementDrawerProps> = ({
//   mentorId,
//   serviceId,
//   onSlotAssigned,
// }) => {
//   const [schedules, setSchedules] = useState<Schedule[]>([]);
//   const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchSchedules = async () => {
//       if (!mentorId) return;

//       setLoading(true);
//       try {
//         const response = await getMentorCalendar(mentorId);
//         console.log(
//           "++++++++++++++SlotManagementDrawer fetch response",
//           response
//         );

//         if (response && response.schedules) {
//           setSchedules(response.schedules);
//           if (response.schedules.length > 0) {
//             setSelectedSchedule(response.schedules[0]._id);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch mentor calendar:", error);
//         toast.error(
//           "Failed to load schedules: " + (error.message || "Unknown error")
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSchedules();
//   }, [mentorId]);

//   const handleConfirm = async () => {
//     if (selectedSchedule) {
//       try {
//         await assignScheduleToService(serviceId, selectedSchedule);
//         console.log("selected selectedSchedule", selectedSchedule);
//         onSlotAssigned(serviceId, selectedSchedule); // Notify parent component
//         toast.success(`Schedule confirmed for service.`);
//       } catch (error) {
//         console.error("Failed to assign schedule:", error);
//         toast.error(
//           `Failed to assign schedule: ${error.message || "Unknown error"}`
//         );
//       }
//     } else {
//       toast.error("Please select a schedule.");
//     }
//   };

//   return (
//     <Drawer>
//       <DrawerTrigger asChild>
//         <Button
//           variant="outline"
//           size="sm"
//           className="bg-white rounded border-black text-black hover:bg-black hover:text-white transition-colors duration-200"
//         >
//           Add Slot
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent className="bg-white">
//         <div className="bg-white mx-auto w-full max-w-sm">
//           <DrawerHeader>
//             <DrawerTitle>Manage Slots</DrawerTitle>
//             <DrawerDescription>
//               Select a schedule to associate with this service.
//             </DrawerDescription>
//           </DrawerHeader>
//           <div className="p-4 pb-0">
//             {loading ? (
//               <div className="flex justify-center items-center h-32">
//                 <p className="text-gray-500">Loading schedules...</p>
//               </div>
//             ) : schedules.length === 0 ? (
//               <div className="flex flex-col justify-center items-center h-32">
//                 <p className="text-gray-500">No schedules found.</p>
//               </div>
//             ) : (
//               <RadioGroup
//                 onValueChange={setSelectedSchedule}
//                 value={selectedSchedule || ""}
//                 className="space-y-4 max-h-60 overflow-y-auto"
//               >
//                 {schedules.map((schedule) => (
//                   <div
//                     key={schedule._id}
//                     className="flex justify-between items-center space-x-2 border p-3 rounded-md"
//                   >
//                     <Label htmlFor={schedule._id} className="text-base">
//                       {schedule.scheduleName}
//                     </Label>
//                     <RadioGroupItem value={schedule._id} id={schedule._id} />
//                   </div>
//                 ))}
//               </RadioGroup>
//             )}
//           </div>

//           <DrawerFooter>
//             <DrawerClose asChild>
//               <Button
//                 className="bg-black text-white"
//                 onClick={handleConfirm}
//                 disabled={!selectedSchedule || loading}
//               >
//                 Confirm
//               </Button>
//             </DrawerClose>
//             <DrawerClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DrawerClose>
//           </DrawerFooter>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// export default SlotManagementDrawer;
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Plus, CheckCircle, AlertCircle } from "lucide-react";
import {
  getMentorCalendar,
  assignScheduleToService,
} from "@/services/mentorService";
import toast from "react-hot-toast";

interface Schedule {
  _id: string;
  scheduleName: string;
}

interface SlotManagementDrawerProps {
  mentorId: string;
  serviceId: string;
  onSlotAssigned: (serviceId: string, scheduleId: string) => void;
}

const SlotManagementDrawer: React.FC<SlotManagementDrawerProps> = ({
  mentorId,
  serviceId,
  onSlotAssigned,
}) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!mentorId) return;

      setLoading(true);
      try {
        const response = await getMentorCalendar(mentorId);
        console.log(
          "++++++++++++++SlotManagementDrawer fetch response",
          response
        );

        if (response && response.schedules) {
          setSchedules(response.schedules);
          if (response.schedules.length > 0) {
            setSelectedSchedule(response.schedules[0]._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch mentor calendar:", error);
        toast.error(
          "Failed to load schedules: " + (error.message || "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [mentorId]);

  const handleConfirm = async () => {
    if (selectedSchedule) {
      try {
        await assignScheduleToService(serviceId, selectedSchedule);
        console.log("selected selectedSchedule", selectedSchedule);
        onSlotAssigned(serviceId, selectedSchedule);
        toast.success(`Schedule confirmed for service.`);
      } catch (error) {
        console.error("Failed to assign schedule:", error);
        toast.error(
          `Failed to assign schedule: ${error.message || "Unknown error"}`
        );
      }
    } else {
      toast.error("Please select a schedule.");
    }
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
    </div>
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="group relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all duration-300 ease-out hover:shadow-lg hover:shadow-blue-200 hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
          Add Slot
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-white border-t-0 max-h-[85vh]">
        <div className="mx-auto w-full max-w-md">
          {/* Enhanced Header */}
          <DrawerHeader className="text-center pb-4 border-b bg-gradient-to-b from-blue-50/50 to-transparent">
            <div className="flex items-center justify-center mb-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <DrawerTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Manage Slots
            </DrawerTitle>
            <DrawerDescription className="text-gray-600 mt-2 text-sm leading-relaxed">
              Select a schedule to associate with this service.
            </DrawerDescription>
          </DrawerHeader>

          {/* Content Area */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-12 space-y-4">
                <LoadingSpinner />
                <p className="text-gray-500 text-sm font-medium">
                  Loading schedules...
                </p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-12 space-y-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-semibold text-gray-800">
                    No schedules found.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Create a schedule template first to manage your availability
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    Available Schedules
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    {schedules.length}{" "}
                    {schedules.length === 1 ? "Schedule" : "Schedules"}
                  </Badge>
                </div>

                <RadioGroup
                  onValueChange={setSelectedSchedule}
                  value={selectedSchedule || ""}
                  className="space-y-3 max-h-60 overflow-y-auto pr-2"
                >
                  {schedules.map((schedule, index) => (
                    <Card
                      key={schedule._id}
                      className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedSchedule === schedule._id
                          ? "ring-2 ring-blue-500 bg-blue-50/50 border-blue-200"
                          : "hover:border-gray-300 hover:bg-gray-50/50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={schedule._id}
                            id={schedule._id}
                            className={`${
                              selectedSchedule === schedule._id
                                ? "border-blue-500 text-blue-600"
                                : ""
                            }`}
                          />

                          <div className="flex-1 min-w-0">
                            <Label
                              htmlFor={schedule._id}
                              className="cursor-pointer flex items-center space-x-2"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 truncate text-base">
                                  {schedule.scheduleName}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Schedule #{index + 1} • Available time slots
                                </p>
                              </div>
                            </Label>
                          </div>

                          {selectedSchedule === schedule._id && (
                            <div className="flex-shrink-0">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <DrawerFooter className="border-t bg-gray-50/50 p-6 space-y-3">
            <DrawerClose asChild>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                onClick={handleConfirm}
                disabled={!selectedSchedule || loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner />
                    <span>Confirming...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Confirm</span>
                  </div>
                )}
              </Button>
            </DrawerClose>

            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SlotManagementDrawer;
