// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Datepicker } from "flowbite-react";

// interface BlockDatesModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onBlockDates: (dates: Date[]) => void;
//   selectedDates: Date[];
//   setSelectedDates: (dates: Date[]) => void;
// }

// export default function BlockDatesModal({
//   isOpen,
//   onClose,
//   onBlockDates,
//   selectedDates,
//   setSelectedDates,
// }: BlockDatesModalProps) {
//   const [tempSelectedDates, setTempSelectedDates] = useState<Date[]>([]);

//   const handleDateChange = (date: Date) => {
//     // Normalize date to avoid time-based comparison issues
//     const normalizedDate = new Date(date.setHours(0, 0, 0, 0));
//     const isSelected = tempSelectedDates.some(
//       (d) => d.toDateString() === normalizedDate.toDateString()
//     );

//     if (isSelected) {
//       setTempSelectedDates(
//         tempSelectedDates.filter(
//           (d) => d.toDateString() !== normalizedDate.toDateString()
//         )
//       );
//     } else {
//       setTempSelectedDates([...tempSelectedDates, normalizedDate]);
//     }
//   };

//   const handleBlockDates = () => {
//     setSelectedDates([...selectedDates, ...tempSelectedDates]);
//     onBlockDates(tempSelectedDates);
//     setTempSelectedDates([]); // Clear temp dates after saving
//     onClose();
//   };

//   const handleClose = () => {
//     setTempSelectedDates([]); // Clear temp dates on cancel
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-[425px] bg-white text-center">
//         <DialogHeader>
//           <DialogTitle className="text-center">
//             Select date(s) you are unavailable on
//           </DialogTitle>
//         </DialogHeader>

//         <div className="flex justify-center py-4">
//           <style>
//             {`
//               .flowbite-datepicker .react-datepicker__day--in-selecting-range,
//               .flowbite-datepicker .react-datepicker__day--in-range,
//               .flowbite-datepicker .react-datepicker__day--selected {
//                 background-color: #2563eb !important;
//                 color: white !important;
//                 border-radius: 50% !important;
//               }
//               .flowbite-datepicker .react-datepicker__day--in-selecting-range:hover,
//               .flowbite-datepicker .react-datepicker__day--in-range:hover,
//               .flowbite-datepicker .react-datepicker__day--selected:hover {
//                 background-color: #1d4ed8 !important;
//               }
//               .flowbite-datepicker .react-datepicker__day {
//                 margin: 2px;
//                 padding: 4px;
//               }
//               .flowbite-datepicker .react-datepicker__day--outside-month {
//                 color: #d1d5db !important;
//               }
//             `}
//           </style>
//           <Datepicker
//             inline
//             showClearButton={false}
//             showTodayButton={false}
//             onChange={handleDateChange}
//             className="flowbite-datepicker"
//             selected={null}
//           />
//         </div>

//         <DialogFooter className="flex justify-center gap-4">
//           <Button variant="outline" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleBlockDates}
//             className="bg-black text-white hover:bg-black/90"
//             disabled={tempSelectedDates.length === 0}
//           >
//             Block Dates
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
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
  onBlockDates: (dates: Date[]) => void;
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
  const [tempSelectedDates, setTempSelectedDates] = useState<Date[]>([]);

  const handleDateChange = (date: Date | null) => {
    if (!date) return; // Ignore null dates
    const normalizedDate = new Date(date.setHours(0, 0, 0, 0));
    const isSelected = tempSelectedDates.some(
      (d) => d.toDateString() === normalizedDate.toDateString()
    );

    if (isSelected) {
      setTempSelectedDates(
        tempSelectedDates.filter(
          (d) => d.toDateString() !== normalizedDate.toDateString()
        )
      );
    } else {
      setTempSelectedDates([...tempSelectedDates, normalizedDate]);
    }
  };

  const handleBlockDates = () => {
    const newDates = [...selectedDates, ...tempSelectedDates];
    setSelectedDates(newDates);
    onBlockDates(tempSelectedDates);
    setTempSelectedDates([]);
    onClose();
  };

  const handleClose = () => {
    setTempSelectedDates([]);
    onClose();
  };

  // Custom render for selected dates
  const isDateSelected = (date: Date) => {
    return tempSelectedDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
          />
        </div>

        <DialogFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleBlockDates}
            className="bg-black text-white hover:bg-black/90"
            disabled={tempSelectedDates.length === 0}
          >
            Block Dates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
