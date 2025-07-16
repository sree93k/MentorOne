import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Datepicker } from "flowbite-react";

interface BlockDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlockDates: (date: { date: Date; dayOfWeek: string }) => void;
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
}

export default function BlockDatesModal({
  isOpen,
  onClose,
  onBlockDates,
  selectedDates,
  setSelectedDates,
}: BlockDatesModalProps) {
  const [tempSelectedDate, setTempSelectedDate] = useState<{
    date: Date;
    dayOfWeek: string;
  } | null>(null);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleDateChange = (date: Date | null) => {
    if (!date) return;

    const normalizedDate = new Date(date.setHours(0, 0, 0, 0));
    const dayOfWeek = daysOfWeek[normalizedDate.getDay()];

    console.log(
      `Selected date: ${normalizedDate.toDateString()}, Day of the week: ${dayOfWeek}`
    );

    if (
      tempSelectedDate &&
      tempSelectedDate.date.toDateString() === normalizedDate.toDateString()
    ) {
      setTempSelectedDate(null);
    } else {
      setTempSelectedDate({ date: normalizedDate, dayOfWeek });
    }
  };

  const handleBlockDates = () => {
    if (!tempSelectedDate) return;

    const newDates = [...selectedDates, tempSelectedDate.date];
    setSelectedDates(newDates);
    onBlockDates(tempSelectedDate);
    setTempSelectedDate(null);
    onClose();
  };

  const handleClose = () => {
    setTempSelectedDate(null);
    onClose();
  };

  const isDateSelected = (date: Date) => {
    return (
      tempSelectedDate &&
      tempSelectedDate.date.toDateString() === date.toDateString()
    );
  };

  // Set minDate to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white text-center">
        <DialogHeader>
          <DialogTitle className="text-center">
            Select a date you are unavailable on
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <style>
            {`
              .flowbite-datepicker .react-datepicker__day--selected,
              .flowbite-datepicker .react-datepicker__day--in-selecting-range,
              .flowbite-datepicker .react-datepicker__day--in-range {
                background-color: #2563eb !important;
                color: white !important;
                border-radius: 50% !important;
              }
              .flowbite-datepicker .react-datepicker__day--selected:hover,
              .flowbite-datepicker .react-datepicker__day--in-selecting-range:hover,
              .flowbite-datepicker .react-datepicker__day--in-range:hover {
                background-color: #1d4ed8 !important;
              }
              .flowbite-datepicker .react-datepicker__day {
                margin: 2px;
                padding: 4px;
                width: 2rem;
                height: 2rem;
                line-height: 2rem;
                text-align: center;
              }
              .flowbite-datepicker .react-datepicker__day--outside-month {
                color: #d1d5db !important;
              }
              .flowbite-datepicker .react-datepicker__day--disabled {
                color: #d1d5db !important;
                cursor: not-allowed;
              }
            `}
          </style>

          <Datepicker
            inline
            showClearButton={false}
            showTodayButton={false}
            onChange={handleDateChange}
            className="flowbite-datepicker"
            selected={null}
            calendarClassName="flowbite-datepicker"
            dayClassName={(date) =>
              isDateSelected(date) ? "react-datepicker__day--selected" : ""
            }
            minDate={today} // Disable dates before today
          />
        </div>

        <DialogFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleBlockDates}
            className="bg-black text-white hover:bg-black/90"
            disabled={!tempSelectedDate}
          >
            Block Date
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
