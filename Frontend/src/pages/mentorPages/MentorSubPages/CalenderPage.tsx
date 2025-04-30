import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomTimePicker from "@/components/users/CustomTimePicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BlockDatesModal from "@/components/mentor/BlockDatesModal";
import CreateScheduleModal from "@/components/mentor/CreateScheduleModal";
import {
  CalendarDays,
  Edit,
  Plus,
  CircleCheckBig,
  Ban,
  Trash2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import {
  getMentorCalendar,
  updatePolicy,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  addBlockedDates,
  removeBlockedDate,
} from "@/services/mentorService";

// Redux state type
interface RootState {
  user: {
    user: {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: "mentor" | "mentee";
      profileImg: string;
      phone: string;
      passwordDate: string;
      activated?: boolean;
      mentorActivated?: boolean;
    } | null;
    isAuthenticated: boolean;
  };
}

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
  buttons?: React.ReactNode; // New prop for buttons
}

function SettingItem({
  icon,
  title,
  description,
  action,
  buttons,
}: SettingItemProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {action}
        {buttons}
      </div>
    </div>
  );
}

interface Policy {
  reschedulePeriod?: { value: number; unit: string };
  bookingPeriod?: { value: number; unit: string };
  noticePeriod?: { value: number; unit: string };
}

interface DaySchedule {
  day: string;
  times: string[];
  available: boolean;
}

interface Schedule {
  _id: string;
  name: string;
  days: DaySchedule[];
}

interface BlockedDate {
  _id: string;
  date: string;
}

export default function CalendarPage() {
  // Get mentorId from Redux store
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const mentorId = user?._id;

  const [policy, setPolicy] = useState<Policy>({});
  const [tempReschedulePeriod, setTempReschedulePeriod] = useState<
    Policy["reschedulePeriod"]
  >({ value: 0, unit: "hours" });
  const [tempBookingPeriod, setTempBookingPeriod] = useState<
    Policy["bookingPeriod"]
  >({ value: 0, unit: "days" });
  const [tempNoticePeriod, setTempNoticePeriod] = useState<
    Policy["noticePeriod"]
  >({ value: 0, unit: "minutes" });
  const [isEditingReschedule, setIsEditingReschedule] = useState(false);
  const [isEditingBooking, setIsEditingBooking] = useState(false);
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const [timePickerOpenId, setTimePickerOpenId] = useState<string | null>(null);
  const [isBlockDatesModalOpen, setIsBlockDatesModalOpen] = useState(false);
  const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] =
    useState(false);

  // Fetch calendar data on mount
  useEffect(() => {
    if (!isAuthenticated || !mentorId) {
      toast.error("Please log in to view your calendar.");
      setIsLoading(false);
      return;
    }

    const fetchCalendar = async () => {
      try {
        setIsLoading(true);
        console.log("fetchCalendar page useffetc 1");

        const data = await getMentorCalendar(mentorId);
        console.log("fetchCalendar page useffetc 2", data);
        const fetchedPolicy = data.policy || {};
        setPolicy(fetchedPolicy);
        // Initialize temporary states
        setTempReschedulePeriod(
          fetchedPolicy.reschedulePeriod || { value: 0, unit: "hours" }
        );
        setTempBookingPeriod(
          fetchedPolicy.bookingPeriod || { value: 0, unit: "days" }
        );
        setTempNoticePeriod(
          fetchedPolicy.noticePeriod || { value: 0, unit: "minutes" }
        );
        setSchedules(data.schedules || []);
        setBlockedDates(data.blockedDates || []);
      } catch (error) {
        console.log("fetchCalendar page useffetc error");
        console.error("Error fetching calendar:", error);
        // toast.error("Failed to load calendar data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCalendar();
  }, [mentorId, isAuthenticated]);

  // Handle policy changes for each field
  const handlePolicyChange = (
    field: keyof Policy,
    value: { value: number; unit: string }
  ) => {
    if (field === "reschedulePeriod") {
      setTempReschedulePeriod(value);
    } else if (field === "bookingPeriod") {
      setTempBookingPeriod(value);
    } else if (field === "noticePeriod") {
      setTempNoticePeriod(value);
    }
  };

  // Save handlers for each field
  const handleSaveReschedule = async () => {
    console.log("handleSaveReschedule page step 1 ", mentorId);

    if (!mentorId) {
      toast.error("Mentor ID not found.");
      return;
    }

    const updatedPolicy = {
      ...policy,
      reschedulePeriod: tempReschedulePeriod,
    };
    try {
      console.log("Saving reschedule policy:", updatedPolicy);
      const resposnse = await updatePolicy(mentorId, updatedPolicy);
      console.log("handleSaveReschedule page step 2 updatePolicy", resposnse);
      setPolicy(updatedPolicy);
      setIsEditingReschedule(false);
      toast.success("Reschedule policy updated successfully");
    } catch (error) {
      console.error("Error saving reschedule policy:", error);
      toast.error("Failed to save reschedule policy");
    }
  };

  const handleSaveBooking = async () => {
    if (!mentorId) {
      toast.error("Mentor ID not found.");
      return;
    }

    const updatedPolicy = {
      ...policy,
      bookingPeriod: tempBookingPeriod,
    };
    try {
      console.log("Saving booking policy:", updatedPolicy);
      const resposnse = await updatePolicy(mentorId, updatedPolicy);
      console.log("handleSaveBooking page step 2 updatePolicy", resposnse);
      setPolicy(updatedPolicy);
      setIsEditingBooking(false);
      toast.success("Booking policy updated successfully");
    } catch (error) {
      console.error("Error saving booking policy:", error);
      toast.error("Failed to save booking policy");
    }
  };

  const handleSaveNotice = async () => {
    if (!mentorId) {
      toast.error("Mentor ID not found.");
      return;
    }

    const updatedPolicy = {
      ...policy,
      noticePeriod: tempNoticePeriod,
    };
    try {
      console.log("Saving notice policy:", updatedPolicy);
      const resposnse = await updatePolicy(mentorId, updatedPolicy);
      console.log("handleSaveNotice page step 2 updatePolicy", resposnse);
      setPolicy(updatedPolicy);
      setIsEditingNotice(false);
      toast.success("Notice policy updated successfully");
    } catch (error) {
      console.error("Error saving notice policy:", error);
      toast.error("Failed to save notice policy");
    }
  };

  // Cancel handlers for each field
  const handleCancelReschedule = () => {
    setTempReschedulePeriod(
      policy.reschedulePeriod || { value: 0, unit: "hours" }
    );
    setIsEditingReschedule(false);
  };

  const handleCancelBooking = () => {
    setTempBookingPeriod(policy.bookingPeriod || { value: 0, unit: "days" });
    setIsEditingBooking(false);
  };

  const handleCancelNotice = () => {
    setTempNoticePeriod(policy.noticePeriod || { value: 0, unit: "minutes" });
    setIsEditingNotice(false);
  };

  // Toggle day availability
  const toggleDayAvailability = async (
    scheduleId: string,
    dayIndex: number
  ) => {
    if (!mentorId) {
      toast.error("Mentor ID not found.");
      return;
    }

    const schedule = schedules.find((s) => s._id === scheduleId);
    if (!schedule) return;

    const updatedDays = schedule.days.map((day, i) =>
      i === dayIndex ? { ...day, available: !day.available } : day
    );

    try {
      const updatedSchedule = await updateSchedule(mentorId, scheduleId, {
        name: schedule.name,
        days: updatedDays,
      });
      setSchedules(
        schedules.map((s) => (s._id === scheduleId ? updatedSchedule : s))
      );
      toast.success("Day availability updated");
    } catch (error) {
      console.error("Error updating day availability:", error);
      toast.error("Failed to update day availability");
    }
  };

  // Add a time slot
  const addDayTime = async (scheduleId: string, dayIndex: number) => {
    if (!mentorId) {
      toast.error("Mentor ID not found.");
      return;
    }

    const schedule = schedules.find((s) => s._id === scheduleId);
    if (!schedule) return;

    const day = schedule.days[dayIndex];
    if (day.times.length >= 3) {
      toast.error("Cannot add more than 3 time slots");
      return;
    }

    const updatedDays = schedule.days.map((d, i) =>
      i === dayIndex ? { ...d, times: [...d.times, "12:00"] } : d
    );

    try {
      const updatedSchedule = await updateSchedule(mentorId, scheduleId, {
        name: schedule.name,
        days: updatedDays,
      });
      setSchedules(
        schedules.map((s) => (s._id === scheduleId ? updatedSchedule : s))
      );
      toast.success("Time slot added");
    } catch (error) {
      console.error("Error adding time slot:", error);
      toast.error("Failed to add time slot");
    }
  };

  // Remove a time slot
  const removeDayTime = async (
    scheduleId: string,
    dayIndex: number,
    timeIndex: number
  ) => {
    if (!mentorId) {
      toast.error("Mentor ID not found.");
      return;
    }

    const schedule = schedules.find((s) => s._id === scheduleId);
    if (!schedule) return;

    const updatedDays = schedule.days.map((d, i) =>
      i === dayIndex
        ? { ...d, times: d.times.filter((_, ti) => ti !== timeIndex) }
        : d
    );

    try {
      const updatedSchedule = await updateSchedule(mentorId, scheduleId, {
        name: schedule.name,
        days: updatedDays,
      });
      setSchedules(
        schedules.map((s) => (s._id === scheduleId ? updatedSchedule : s))
      );
      toast.success("Time slot removed");
    } catch (error) {
      console.error("Error removing time slot:", error);
      toast.error("Failed to remove time slot");
    }
  };

  // Update a time slot
  const updateDayTime = async (
    scheduleId: string,
    dayIndex: number,
    timeIndex: number,
    time: string
  ) => {
    if (!mentorId) {
      toast.error("Mentor ID not found.");
      return;
    }

    const schedule = schedules.find((s) => s._id === scheduleId);
    if (!schedule) return;

    const updatedDays = schedule.days.map((d, i) =>
      i === dayIndex
        ? { ...d, times: d.times.map((t, ti) => (ti === timeIndex ? time : t)) }
        : d
    );

    try {
      const updatedSchedule = await updateSchedule(mentorId, scheduleId, {
        name: schedule.name,
        days: updatedDays,
      });
      setSchedules(
        schedules.map((s) => (s._id === scheduleId ? updatedSchedule : s))
      );
      toast.success("Time slot updated");
    } catch (error) {
      console.error("Error updating time slot:", error);
      toast.error("Failed to update time slot");
    }
  };

  // Create a new schedule
  const handleCreateSchedule = async (name: string) => {
    if (!mentorId) {
      toast.error("Mentor ID not found.");
      return;
    }

    try {
      const newSchedule = await createSchedule(mentorId, {
        name,
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => ({ day, times: ["12:00"], available: false })),
      });
      setSchedules([...schedules, newSchedule]);
      setIsCreateScheduleModalOpen(false);
      toast.success("Schedule created successfully");
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error("Failed to create schedule");
    }
  };

  // Remove a schedule
  const handleRemoveSchedule = async (scheduleId: string) => {
    if (!mentorId) {
      toast.error("Mentor ID not found.");
      return;
    }

    try {
      await deleteSchedule(mentorId, scheduleId);
      setSchedules(schedules.filter((s) => s._id !== scheduleId));
      setEditingSchedule(null);
      toast.success("Schedule removed successfully");
    } catch (error) {
      console.error("Error removing schedule:", error);
      toast.error("Failed to remove schedule");
    }
  };

  // Save schedule (handled by individual API calls, so just exit edit mode)
  const handleSave = (scheduleId: string) => {
    setEditingSchedule(null);
    toast.success("Schedule saved");
  };

  // Block dates
  const handleBlockDates = async (dates: Date[]) => {
    if (!mentorId) {
      toast.error("Mentor ID not found.");
      return;
    }

    try {
      console.log(
        "Adding blocked dates:",
        dates.map((d) => d.toISOString())
      );
      const newBlockedDates = await addBlockedDates(
        mentorId,
        dates.map((d) => d.toISOString())
      );
      console.log("Received new blocked dates:", newBlockedDates);
      setBlockedDates((prev) => {
        const updatedDates = [
          ...prev.filter((d) => !d._id.startsWith("temp-")),
          ...newBlockedDates,
        ];
        console.log("Updated blockedDates state:", updatedDates);
        return updatedDates;
      });
      setIsBlockDatesModalOpen(false);
      toast.success("Blocked dates added successfully");
    } catch (error) {
      console.error("Error adding blocked dates:", error);
      toast.error("Failed to add blocked dates");
    }
  };

  // Remove a blocked date with debouncing to prevent multiple clicks
  const removeBlockedDateHandler = useCallback(
    async (blockedDateId: string) => {
      if (!mentorId) {
        toast.error("Mentor ID not found.");
        return;
      }

      console.log("Removing blocked date with ID:", blockedDateId);
      console.log("Current blockedDates:", blockedDates);

      // Handle both temporary and backend-saved IDs
      setBlockedDates((prev) => {
        const newBlockedDates = prev.filter((d) => d._id !== blockedDateId);
        console.log("After removing blocked date:", newBlockedDates);
        return newBlockedDates;
      });

      if (!blockedDateId.startsWith("temp-")) {
        try {
          await removeBlockedDate(mentorId, blockedDateId);
          toast.success("Blocked date removed successfully");
        } catch (error) {
          console.error("Error removing blocked date:", error);
          toast.error("Failed to remove blocked date");
          // Restore the date if API call fails
          setBlockedDates((prev) =>
            prev.find((d) => d._id === blockedDateId)
              ? prev
              : [...prev, blockedDates.find((d) => d._id === blockedDateId)!]
          );
        }
      } else {
        toast.success("Blocked date removed locally");
      }
    },
    [mentorId, blockedDates]
  );

  if (!isAuthenticated || !mentorId) {
    return (
      <div className="mx-36 text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Availability Schedule</h1>
        <p className="text-gray-500 mb-4">
          Please log in to manage your calendar.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="mx-36">Loading...</div>;
  }

  if (!policy && schedules.length === 0 && blockedDates.length === 0) {
    return (
      <div className="mx-36 text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Availability Schedule</h1>
        <p className="text-gray-500 mb-4">
          No calendar settings found. Start by adding a schedule.
        </p>
        <Button
          className="bg-black text-white"
          onClick={() => setIsCreateScheduleModalOpen(true)}
        >
          Add Schedule
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-36 mb-52">
      <h1 className="text-2xl font-bold mb-6">Availability Schedule</h1>
      <Tabs defaultValue="calender" className="mb-8">
        <TabsList className="border-b w-full rounded-none justify-start h-auto p-0 bg-transparent">
          <TabsTrigger
            value="calender"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none px-8 py-2"
          >
            Calendar
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none px-8 py-2"
          >
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calender" className="pt-6">
          <div className="space-y-8">
            <SettingItem
              icon={<CalendarDays className="h-5 w-5" />}
              title="Reschedule Policy"
              description="How can customers reschedule calls"
              action={
                <div className="flex items-center gap-2">
                  <Select
                    value={tempReschedulePeriod?.value?.toString() ?? "0"}
                    onValueChange={(value) =>
                      handlePolicyChange("reschedulePeriod", {
                        value: parseInt(value) || 0,
                        unit: tempReschedulePeriod?.unit || "hours",
                      })
                    }
                    disabled={!isEditingReschedule}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-60 overflow-y-auto">
                      {Array.from({
                        length:
                          tempReschedulePeriod?.unit === "minutes"
                            ? 61
                            : tempReschedulePeriod?.unit === "hours"
                            ? 25
                            : 32,
                      }).map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={tempReschedulePeriod?.unit || "hours"}
                    onValueChange={(unit) =>
                      handlePolicyChange("reschedulePeriod", {
                        value: tempReschedulePeriod?.value || 0,
                        unit,
                      })
                    }
                    disabled={!isEditingReschedule}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              }
              buttons={
                isEditingReschedule ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black text-white"
                      onClick={() => {
                        handleSaveReschedule();
                        setIsEditingBooking(false);
                        setIsEditingNotice(false);
                        setTempBookingPeriod(
                          policy.bookingPeriod || { value: 0, unit: "days" }
                        );
                        setTempNoticePeriod(
                          policy.noticePeriod || { value: 0, unit: "minutes" }
                        );
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white"
                      onClick={() => {
                        handleCancelReschedule();
                        setIsEditingBooking(false);
                        setIsEditingNotice(false);
                        setTempBookingPeriod(
                          policy.bookingPeriod || { value: 0, unit: "days" }
                        );
                        setTempNoticePeriod(
                          policy.noticePeriod || { value: 0, unit: "minutes" }
                        );
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditingReschedule(true);
                      setIsEditingBooking(false);
                      setIsEditingNotice(false);
                      setTempBookingPeriod(
                        policy.bookingPeriod || { value: 0, unit: "days" }
                      );
                      setTempNoticePeriod(
                        policy.noticePeriod || { value: 0, unit: "minutes" }
                      );
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )
              }
            />
            <SettingItem
              icon={<CalendarDays className="h-5 w-5" />}
              title="Booking Period"
              description="How far in the future can attendees book"
              action={
                <div className="flex items-center gap-2">
                  <Select
                    value={tempBookingPeriod?.value?.toString() ?? "0"}
                    onValueChange={(value) =>
                      handlePolicyChange("bookingPeriod", {
                        value: parseInt(value) || 0,
                        unit: tempBookingPeriod?.unit || "days",
                      })
                    }
                    disabled={!isEditingBooking}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-60 overflow-y-auto">
                      {Array.from({
                        length:
                          tempBookingPeriod?.unit === "minutes"
                            ? 61
                            : tempBookingPeriod?.unit === "hours"
                            ? 25
                            : 32,
                      }).map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={tempBookingPeriod?.unit || "days"}
                    onValueChange={(unit) =>
                      handlePolicyChange("bookingPeriod", {
                        value: tempBookingPeriod?.value || 0,
                        unit,
                      })
                    }
                    disabled={!isEditingBooking}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              }
              buttons={
                isEditingBooking ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black text-white"
                      onClick={() => {
                        handleSaveBooking();
                        setIsEditingReschedule(false);
                        setIsEditingNotice(false);
                        setTempReschedulePeriod(
                          policy.reschedulePeriod || { value: 0, unit: "hours" }
                        );
                        setTempNoticePeriod(
                          policy.noticePeriod || { value: 0, unit: "minutes" }
                        );
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white"
                      onClick={() => {
                        handleCancelBooking();
                        setIsEditingReschedule(false);
                        setIsEditingNotice(false);
                        setTempReschedulePeriod(
                          policy.reschedulePeriod || { value: 0, unit: "hours" }
                        );
                        setTempNoticePeriod(
                          policy.noticePeriod || { value: 0, unit: "minutes" }
                        );
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditingBooking(true);
                      setIsEditingReschedule(false);
                      setIsEditingNotice(false);
                      setTempReschedulePeriod(
                        policy.reschedulePeriod || { value: 0, unit: "hours" }
                      );
                      setTempNoticePeriod(
                        policy.noticePeriod || { value: 0, unit: "minutes" }
                      );
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )
              }
            />
            <SettingItem
              icon={<CalendarDays className="h-5 w-5" />}
              title="Notice Period"
              description="Set the minimum amount of notice that is required"
              action={
                <div className="flex items-center gap-2">
                  <Select
                    value={tempNoticePeriod?.value?.toString() ?? "0"}
                    onValueChange={(value) =>
                      handlePolicyChange("noticePeriod", {
                        value: parseInt(value) || 0,
                        unit: tempNoticePeriod?.unit || "minutes",
                      })
                    }
                    disabled={!isEditingNotice}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-60 overflow-y-auto">
                      {Array.from({
                        length: tempNoticePeriod?.unit === "minutes" ? 61 : 25,
                      }).map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={tempNoticePeriod?.unit || "minutes"}
                    onValueChange={(unit) =>
                      handlePolicyChange("noticePeriod", {
                        value: tempNoticePeriod?.value || 0,
                        unit,
                      })
                    }
                    disabled={!isEditingNotice}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              }
              buttons={
                isEditingNotice ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black text-white"
                      onClick={() => {
                        handleSaveNotice();
                        setIsEditingReschedule(false);
                        setIsEditingBooking(false);
                        setTempReschedulePeriod(
                          policy.reschedulePeriod || { value: 0, unit: "hours" }
                        );
                        setTempBookingPeriod(
                          policy.bookingPeriod || { value: 0, unit: "days" }
                        );
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white"
                      onClick={() => {
                        handleCancelNotice();
                        setIsEditingReschedule(false);
                        setIsEditingBooking(false);
                        setTempReschedulePeriod(
                          policy.reschedulePeriod || { value: 0, unit: "hours" }
                        );
                        setTempBookingPeriod(
                          policy.bookingPeriod || { value: 0, unit: "days" }
                        );
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditingNotice(true);
                      setIsEditingReschedule(false);
                      setIsEditingBooking(false);
                      setTempReschedulePeriod(
                        policy.reschedulePeriod || { value: 0, unit: "hours" }
                      );
                      setTempBookingPeriod(
                        policy.bookingPeriod || { value: 0, unit: "days" }
                      );
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )
              }
            />
          </div>
        </TabsContent>
        <TabsContent value="schedule">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {schedules.map((schedule) => (
                  <Button
                    key={schedule._id}
                    variant="outline"
                    className="border border-gray-400 rounded-full"
                  >
                    {schedule.name}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                className="bg-black text-white"
                onClick={() => setIsCreateScheduleModalOpen(true)}
              >
                New Schedule <Plus className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full bg-gray-100 p-2"
                >
                  {schedules.map((schedule) => (
                    <AccordionItem key={schedule._id} value={schedule._id}>
                      <AccordionTrigger className="text-left w-full text-lg font-medium flex items-center justify-between px-4 py-3 hover:bg-muted rounded-md">
                        {schedule.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-end mb-4 gap-2">
                          {editingSchedule === schedule._id ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-black text-white"
                                onClick={() => handleSave(schedule._id)}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white"
                                onClick={() => setEditingSchedule(null)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingSchedule(schedule._id)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveSchedule(schedule._id)
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </>
                          )}
                        </div>

                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="py-2">Day</th>
                              <th className="py-2">Available</th>
                              <th className="py-2" colSpan={4}>
                                Times
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday",
                            ].map((dayName) => {
                              const index = schedule.days.findIndex(
                                (d) => d.day === dayName
                              );
                              const day = schedule.days[index] || {
                                day: dayName,
                                times: [],
                                available: false,
                              };

                              return (
                                <tr key={dayName} className="border-b">
                                  <td className="py-2">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${schedule._id}-${day.day}`}
                                        checked={day.available}
                                        disabled={
                                          editingSchedule !== schedule._id
                                        }
                                        onCheckedChange={() =>
                                          toggleDayAvailability(
                                            schedule._id,
                                            index
                                          )
                                        }
                                        className={`peer shrink-0 rounded-sm border bg-white
                                          ${
                                            editingSchedule === schedule._id
                                              ? "cursor-pointer"
                                              : "cursor-not-allowed"
                                          }
                                          data-[state=checked]:bg-blue-600
                                          data-[state=checked]:text-white
                                          data-[state=checked]:border-blue-600
                                          text-white
                                        `}
                                      />
                                      <Label
                                        htmlFor={`${schedule._id}-${day.day}`}
                                      >
                                        {day.day}
                                      </Label>
                                    </div>
                                  </td>
                                  <td className="py-2">
                                    {day.available ? (
                                      <CircleCheckBig
                                        size={24}
                                        color="#198041"
                                        strokeWidth={1.75}
                                      />
                                    ) : (
                                      <Ban
                                        size={24}
                                        color="#cc141d"
                                        strokeWidth={1.75}
                                      />
                                    )}
                                  </td>
                                  <td className="py-2">
                                    {editingSchedule === schedule._id && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-white"
                                        onClick={() =>
                                          addDayTime(schedule._id, index)
                                        }
                                      >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Time
                                      </Button>
                                    )}
                                  </td>
                                  {[0, 1, 2].map((timeIndex) => (
                                    <td
                                      key={`${schedule._id}-${index}-${timeIndex}`}
                                      className="py-2"
                                    >
                                      {editingSchedule === schedule._id &&
                                      day.times[timeIndex] ? (
                                        <div className="flex items-center relative">
                                          <div className="relative">
                                            <button
                                              className="w-24 px-2 py-1 bg-gray-100 text-left border rounded cursor-pointer bg-white"
                                              onClick={() =>
                                                setTimePickerOpenId(
                                                  timePickerOpenId ===
                                                    `${schedule._id}-${index}-${timeIndex}`
                                                    ? null
                                                    : `${schedule._id}-${index}-${timeIndex}`
                                                )
                                              }
                                            >
                                              {day.times[timeIndex] || "--:--"}
                                            </button>
                                            {timePickerOpenId ===
                                              `${schedule._id}-${index}-${timeIndex}` && (
                                              <div
                                                className={`absolute z-50 left-0 top-[100%] mt-1 ${
                                                  timeIndex > 0
                                                    ? "right-0 left-auto"
                                                    : ""
                                                }`}
                                              >
                                                <CustomTimePicker
                                                  initialTime={
                                                    day.times[timeIndex]
                                                  }
                                                  onConfirm={(newTime) => {
                                                    updateDayTime(
                                                      schedule._id,
                                                      index,
                                                      timeIndex,
                                                      newTime
                                                    );
                                                    setTimePickerOpenId(null);
                                                  }}
                                                />
                                              </div>
                                            )}
                                          </div>
                                          <Button
                                            variant="ghost"
                                            className="py-0 px-1 ml-0"
                                            size="sm"
                                            onClick={() =>
                                              removeDayTime(
                                                schedule._id,
                                                index,
                                                timeIndex
                                              )
                                            }
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <div className="text-sm font-medium">
                                          {day.times[timeIndex] || "--:--"}
                                        </div>
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Block Dates</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add dates when you will be unavailable to take calls
                </p>
                <Button
                  variant="outline"
                  className="w-full bg-black text-white hover:bg-black/90 mb-4"
                  onClick={() => setIsBlockDatesModalOpen(true)}
                >
                  Add Unavailable Dates
                </Button>
                {blockedDates.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Blocked Dates:</p>
                    {blockedDates.map((date) => (
                      <div
                        key={date._id}
                        className="flex items-center justify-between border px-2 py-1"
                      >
                        <span className="text-sm">
                          {new Date(date.date).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => removeBlockedDateHandler(date._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {blockedDates.length === 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 mb-4">
                      No blocked dates
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <BlockDatesModal
        isOpen={isBlockDatesModalOpen}
        onClose={() => setIsBlockDatesModalOpen(false)}
        onBlockDates={handleBlockDates}
        selectedDates={blockedDates.map((d) => new Date(d.date))}
        setSelectedDates={(dates) => {
          const newBlockedDates = dates.map((d) => {
            const existing = blockedDates.find(
              (bd) => new Date(bd.date).toDateString() === d.toDateString()
            );
            return (
              existing || {
                _id: `temp-${Date.now()}-${Math.random()}`,
                date: d.toISOString(),
              }
            );
          });
          console.log("Setting new blocked dates in modal:", newBlockedDates);
          setBlockedDates(newBlockedDates);
        }}
      />
      <CreateScheduleModal
        isOpen={isCreateScheduleModalOpen}
        onClose={() => setIsCreateScheduleModalOpen(false)}
        onCreateSchedule={handleCreateSchedule}
      />
    </div>
  );
}
