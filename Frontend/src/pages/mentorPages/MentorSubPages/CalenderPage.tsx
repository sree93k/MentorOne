import { useState, useRef } from "react";
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

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}

function SettingItem({ icon, title, description, action }: SettingItemProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div>{action}</div>
    </div>
  );
}

type DaySchedule = {
  day: string;
  times: string[];
  available: boolean;
};

type Schedule = {
  id: string;
  name: string;
  days: DaySchedule[];
};

export default function CalendarPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "default",
      name: "Week Schedule",
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].map((day) => ({ day, times: ["12:00PM"], available: false })),
    },
  ]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const [timePickerOpenId, setTimePickerOpenId] = useState<string | null>(null);
  const [isBlockDatesModalOpen, setIsBlockDatesModalOpen] = useState(false);
  const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] =
    useState(false);

  const toggleDayAvailability = (scheduleId: string, dayIndex: number) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              days: schedule.days.map((day, i) =>
                i === dayIndex ? { ...day, available: !day.available } : day
              ),
            }
          : schedule
      )
    );
  };

  const addDayTime = (scheduleId: string, dayIndex: number) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              days: schedule.days.map((day, i) => {
                if (i === dayIndex) {
                  if (day.times.length >= 3) {
                    toast.error("Cannot add more than 3 time slots");
                    return day;
                  }
                  return { ...day, times: [...day.times, "12:00PM"] };
                }
                return day;
              }),
            }
          : schedule
      )
    );
  };

  const removeDayTime = (
    scheduleId: string,
    dayIndex: number,
    timeIndex: number
  ) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              days: schedule.days.map((day, i) =>
                i === dayIndex
                  ? {
                      ...day,
                      times: day.times.filter((_, ti) => ti !== timeIndex),
                    }
                  : day
              ),
            }
          : schedule
      )
    );
  };

  const updateDayTime = (
    scheduleId: string,
    dayIndex: number,
    timeIndex: number,
    time: string
  ) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              days: schedule.days.map((day, i) =>
                i === dayIndex
                  ? {
                      ...day,
                      times: day.times.map((t, ti) =>
                        ti === timeIndex ? time : t
                      ),
                    }
                  : day
              ),
            }
          : schedule
      )
    );
  };

  const handleCreateSchedule = (name: string) => {
    const newSchedule: Schedule = {
      id: `schedule-${Date.now()}`,
      name,
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].map((day) => ({ day, times: ["12:00PM"], available: false })),
    };
    setSchedules([...schedules, newSchedule]);
    setIsCreateScheduleModalOpen(false);
  };

  const handleRemoveSchedule = (scheduleId: string) => {
    if (scheduleId === "default") return;
    setSchedules((prev) =>
      prev.filter((schedule) => schedule.id !== scheduleId)
    );
  };

  const handleSave = (scheduleId: string) => {
    console.log(
      "Saved Schedule:",
      schedules.find((s) => s.id === scheduleId)
    );
    setEditingSchedule(null);
  };

  const handleBlockDates = () => {
    console.log("Blocked dates:", selectedDates);
    setIsBlockDatesModalOpen(false);
  };

  const removeBlockedDate = (date: Date) => {
    setSelectedDates(
      selectedDates.filter((d) => d.toDateString() !== date.toDateString())
    );
  };

  return (
    <div className="mx-36 p-6">
      <h1 className="text-2xl font-bold mb-6">Availability Schedule</h1>
      <Tabs defaultValue="calender" className="mb-8">
        <TabsList className="border-b w-full rounded-none justify-start h-auto p-0 bg-transparent">
          <TabsTrigger
            value="calender"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none px-8 py-2"
          >
            Calender
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
                <Select defaultValue="2">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select days" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="1">30 mins</SelectItem>
                    <SelectItem value="2">1 hrs</SelectItem>
                    <SelectItem value="3">8 hrs</SelectItem>
                    <SelectItem value="7">24 hrs</SelectItem>
                    <SelectItem value="14">No reschedule</SelectItem>
                    <SelectItem value="30">Any time</SelectItem>
                  </SelectContent>
                </Select>
              }
            />
            <SettingItem
              icon={<CalendarDays className="h-5 w-5" />}
              title="Booking Period"
              description="How far in the future can attendees book"
              action={
                <Select defaultValue="2">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select days" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="2">2 days</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              }
            />
            <SettingItem
              icon={<CalendarDays className="h-5 w-5" />}
              title="Notice Period"
              description="Set the minimum amount of notice that is required"
              action={
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue="30" className="w-16" />
                  <Select defaultValue="minutes">
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
            />
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {schedules.map((schedule) => (
                  <Button
                    key={schedule.id}
                    variant={
                      schedule.id === "default" ? "outline" : "secondary"
                    }
                    className="border border-gray-400 rounded-full"
                  >
                    {schedule.name}
                  </Button>
                ))}
              </div>
              {/* <Button
                variant="outline"
                className="bg-black text-white"
                onClick={() => setIsCreateScheduleModalOpen(true)}
              >
                New Schedule <Plus className="ml-2 h-4 w-4" />
              </Button> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full bg-gray-100 p-2"
                >
                  {schedules.map((schedule) => (
                    <AccordionItem key={schedule.id} value={schedule.id}>
                      <AccordionTrigger className="text-left w-full text-lg font-medium flex items-center justify-between px-4 py-3 hover:bg-muted rounded-md">
                        {schedule.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-end mb-4 gap-2">
                          {editingSchedule === schedule.id ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSave(schedule.id)}
                              >
                                Save
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingSchedule(null)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingSchedule(schedule.id)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          )}
                          {schedule.id !== "default" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSchedule(schedule.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
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
                                        id={`${schedule.id}-${day.day}`}
                                        checked={day.available}
                                        disabled={
                                          editingSchedule !== schedule.id
                                        }
                                        onCheckedChange={() =>
                                          toggleDayAvailability(
                                            schedule.id,
                                            index
                                          )
                                        }
                                        className={`peer shrink-0 rounded-sm border
                                          ${
                                            editingSchedule === schedule.id
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
                                        htmlFor={`${schedule.id}-${day.day}`}
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
                                    {editingSchedule === schedule.id && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          addDayTime(schedule.id, index)
                                        }
                                      >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Time
                                      </Button>
                                    )}
                                  </td>
                                  {[0, 1, 2].map((timeIndex) => (
                                    <td
                                      key={`${schedule.id}-${index}-${timeIndex}`}
                                      className="py-2"
                                    >
                                      {editingSchedule === schedule.id &&
                                      day.times[timeIndex] ? (
                                        <div className="flex items-center">
                                          <button
                                            className="w-24 px-2 py-1 bg-gray-100 text-left border rounded cursor-pointer"
                                            onClick={() =>
                                              setTimePickerOpenId(
                                                timePickerOpenId ===
                                                  `${schedule.id}-${index}-${timeIndex}`
                                                  ? null
                                                  : `${schedule.id}-${index}-${timeIndex}`
                                              )
                                            }
                                          >
                                            {day.times[timeIndex] || "--:--"}
                                          </button>
                                          {timePickerOpenId ===
                                            `${schedule.id}-${index}-${timeIndex}` && (
                                            <div className="absolute z-10 top-full mt-2">
                                              <CustomTimePicker
                                                initialTime={
                                                  day.times[timeIndex]
                                                }
                                                onConfirm={(newTime) => {
                                                  updateDayTime(
                                                    schedule.id,
                                                    index,
                                                    timeIndex,
                                                    newTime
                                                  );
                                                  setTimePickerOpenId(null);
                                                }}
                                              />
                                            </div>
                                          )}
                                          <Button
                                            variant="ghost"
                                            className="bg-red-100 p-1 ml-0"
                                            size="sm"
                                            onClick={() =>
                                              removeDayTime(
                                                schedule.id,
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
                {selectedDates.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Blocked Dates:</p>
                    {selectedDates.map((date, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">
                          {date.toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-red-100 p-1"
                          onClick={() => removeBlockedDate(date)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
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
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      />
      <CreateScheduleModal
        isOpen={isCreateScheduleModalOpen}
        onClose={() => setIsCreateScheduleModalOpen(false)}
        onCreateSchedule={handleCreateSchedule}
      />
    </div>
  );
}
