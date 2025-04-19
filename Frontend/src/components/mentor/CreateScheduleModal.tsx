import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSchedule: (name: string) => void;
}

export default function CreateScheduleModal({
  isOpen,
  onClose,
  onCreateSchedule,
}: CreateScheduleModalProps) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (name.trim()) {
      onCreateSchedule(name.trim());
      setName(""); // Reset input after submission
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create Schedule</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="schedule-name">Schedule Name</Label>
          <Input
            id="schedule-name"
            placeholder="Exclusive hours, Free Hours"
            className="mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-black text-white" onClick={handleCreate}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
