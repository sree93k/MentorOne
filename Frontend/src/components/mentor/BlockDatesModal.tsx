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
  onBlockDates: () => void;
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
  const handleDateSelect = (date: Date) => {
    const isSelected = selectedDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
    if (isSelected) {
      setSelectedDates(
        selectedDates.filter((d) => d.toDateString() !== date.toDateString())
      );
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white text-center">
        <DialogHeader>
          <DialogTitle className="text-center">
            Select date(s) you are unavailable on
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <style>
            {`
                .flowbite-datepicker .react-datepicker__day--selected,
                .flowbite-datepicker .react-datepicker__day--keyboard-selected {
                  background-color: #2563eb !important;
                  color: white !important;
                }
                .flowbite-datepicker .react-datepicker__day--selected:hover,
                .flowbite-datepicker .react-datepicker__day--keyboard-selected:hover {
                  background-color: #1d4ed8 !important;
                }
              `}
          </style>
          <Datepicker
            inline
            showClearButton={false}
            showTodayButton={false}
            onSelectedDateChanged={handleDateSelect}
            className="flowbite-datepicker"
          />
        </div>

        <DialogFooter className="flex justify-center !justify-center gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onBlockDates}
            className="bg-black text-white hover:bg-black/90"
          >
            Block Dates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
