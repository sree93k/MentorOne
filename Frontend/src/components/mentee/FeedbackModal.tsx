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
  getTestimonialByBookingId,
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
  const [loading, setLoading] = useState(false);
  const [testimonial, setTestimonial] = useState(existingTestimonial || null);

  // Fetch testimonial when modal opens and bookingId is provided
  useEffect(() => {
    async function fetchTestimonial() {
      if (!isOpen || !bookingId) return;

      setLoading(true);
      try {
        const response = await getTestimonialByBookingId(bookingId);
        console.log("FeedbackModal fetchTestimonial response", response);
        if (response) {
          setTestimonial(response);
          setRating(response.rating);
          setFeedback(response.comment);
        } else {
          // No testimonial exists for this booking
          setTestimonial(null);
          setRating(0);
          setFeedback("");
        }
      } catch (error: any) {
        console.error("Error fetching testimonial:", error);
        toast.error("Failed to load feedback");
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonial();
  }, [isOpen, bookingId]);

  // Update state if existingTestimonial prop changes
  useEffect(() => {
    if (existingTestimonial) {
      setTestimonial(existingTestimonial);
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

    setLoading(true);
    try {
      if (testimonial?._id) {
        console.log("testimonial id", testimonial._id);

        await updateTestimonial(testimonial._id, rating, feedback);
        toast.success("Feedback updated successfully");
      } else {
        await submitTestimonial(bookingId, rating, feedback);
        toast.success("Feedback submitted successfully");
      }
      onSubmit(rating, feedback);
      setRating(0);
      setFeedback("");
      setTestimonial(null);
      onClose(); // Close modal after submission
    } catch (error: any) {
      toast.error("Failed to submit feedback");
      console.error("Error submitting/updating testimonial:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {testimonial ? "Edit Feedback" : "Provide Feedback"}
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-4 text-center">Loading feedback...</div>
        ) : (
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className="focus:outline-none"
                  disabled={loading}
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
              disabled={loading}
            />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-black text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {testimonial ? "Update Feedback" : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
