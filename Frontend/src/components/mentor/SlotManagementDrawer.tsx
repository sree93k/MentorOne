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
      } catch (error: any) {
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
        onSlotAssigned(serviceId, selectedSchedule); // Notify parent component
        toast.success(`Schedule confirmed for service.`);
      } catch (error: any) {
        console.error("Failed to assign schedule:", error);
        toast.error(
          `Failed to assign schedule: ${error.message || "Unknown error"}`
        );
      }
    } else {
      toast.error("Please select a schedule.");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white rounded border-black text-black hover:bg-black hover:text-white transition-colors duration-200"
        >
          Add Slot
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white">
        <div className="bg-white mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Manage Slots</DrawerTitle>
            <DrawerDescription>
              Select a schedule to associate with this service.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500">Loading schedules...</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500">No schedules found.</p>
              </div>
            ) : (
              <RadioGroup
                onValueChange={setSelectedSchedule}
                value={selectedSchedule || ""}
                className="space-y-4 max-h-60 overflow-y-auto"
              >
                {schedules.map((schedule) => (
                  <div
                    key={schedule._id}
                    className="flex justify-between items-center space-x-2 border p-3 rounded-md"
                  >
                    <Label htmlFor={schedule._id} className="text-base">
                      {schedule.scheduleName}
                    </Label>
                    <RadioGroupItem value={schedule._id} id={schedule._id} />
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                className="bg-black text-white"
                onClick={handleConfirm}
                disabled={!selectedSchedule || loading}
              >
                Confirm
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SlotManagementDrawer;
