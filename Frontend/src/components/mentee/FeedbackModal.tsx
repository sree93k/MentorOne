import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  submitTestimonial,
  updateTestimonial,
} from "@/services/bookingService";
import { toast } from "react-hot-toast";
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
  bookingId?: string;
  existingTestimonial?: { _id: string; comment: string; rating: number };
}

export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  bookingId,
  existingTestimonial,
}: FeedbackModalProps) {
  const [rating, setRating] = useState(existingTestimonial?.rating || 0);
  const [feedback, setFeedback] = useState(existingTestimonial?.comment || "");

  useEffect(() => {
    if (existingTestimonial) {
      setRating(existingTestimonial.rating);
      setFeedback(existingTestimonial.comment);
    }
  }, [existingTestimonial]);

  const handleSubmit = async () => {
    if (!bookingId) {
      toast.error("Booking ID is missing");
      console.error("Booking ID is undefined");
      return;
    }
    if (rating <= 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!feedback.trim()) {
      toast.error("Feedback cannot be empty");
      return;
    }
    try {
      if (existingTestimonial) {
        await updateTestimonial(existingTestimonial._id, rating, feedback);
        toast.success("Feedback updated successfully");
      } else {
        await submitTestimonial(bookingId, rating, feedback);
        toast.success("Feedback submitted successfully");
      }
      onSubmit(rating, feedback);
      setRating(0);
      setFeedback("");
    } catch (error: any) {
      toast.error("Failed to submit feedback");
      console.error("Error submitting/updating testimonial:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {existingTestimonial ? "Edit Feedback" : "Provide Feedback"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    value <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here..."
            className="w-full px-3 py-2 border rounded-md h-32 resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-black text-white" onClick={handleSubmit}>
            {existingTestimonial ? "Update Feedback" : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
