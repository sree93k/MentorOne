import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  const handleSubmit = () => {
    onSubmit("Feedback submitted");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Feedback</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}></Button>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea placeholder="Type here..." className="min-h-[200px]" />
          <Button className="w-full bg-black text-white" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
