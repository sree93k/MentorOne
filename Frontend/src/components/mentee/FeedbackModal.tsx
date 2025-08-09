// import { useState, useEffect } from "react";
// import { Star } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import {
//   submitTestimonial,
//   updateTestimonial,
//   getTestimonialByBookingId,
// } from "@/services/bookingService";
// import { toast } from "react-hot-toast";

// interface FeedbackModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (rating: number, feedback: string) => void;
//   bookingId?: string;
//   existingTestimonial?: { _id: string; comment: string; rating: number };
// }

// export default function FeedbackModal({
//   isOpen,
//   onClose,
//   onSubmit,
//   bookingId,
//   existingTestimonial,
// }: FeedbackModalProps) {
//   const [rating, setRating] = useState(existingTestimonial?.rating || 0);
//   const [feedback, setFeedback] = useState(existingTestimonial?.comment || "");
//   const [loading, setLoading] = useState(false);
//   const [testimonial, setTestimonial] = useState(existingTestimonial || null);

//   // Fetch testimonial when modal opens and bookingId is provided
//   useEffect(() => {
//     async function fetchTestimonial() {
//       if (!isOpen || !bookingId) return;

//       setLoading(true);
//       try {
//         const response = await getTestimonialByBookingId(bookingId);
//         console.log("FeedbackModal fetchTestimonial response", response);
//         if (response) {
//           setTestimonial(response);
//           setRating(response.rating);
//           setFeedback(response.comment);
//         } else {
//           // No testimonial exists for this booking
//           setTestimonial(null);
//           setRating(0);
//           setFeedback("");
//         }
//       } catch (error) {
//         console.error("Error fetching testimonial:", error);
//         toast.error("Failed to load feedback");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchTestimonial();
//   }, [isOpen, bookingId]);

//   // Update state if existingTestimonial prop changes
//   useEffect(() => {
//     if (existingTestimonial) {
//       setTestimonial(existingTestimonial);
//       setRating(existingTestimonial.rating);
//       setFeedback(existingTestimonial.comment);
//     }
//   }, [existingTestimonial]);

//   const handleSubmit = async () => {
//     if (!bookingId) {
//       toast.error("Booking ID is missing");
//       console.error("Booking ID is undefined");
//       return;
//     }
//     if (rating <= 0) {
//       toast.error("Please select a rating");
//       return;
//     }
//     if (!feedback.trim()) {
//       toast.error("Feedback cannot be empty");
//       return;
//     }

//     setLoading(true);
//     try {
//       if (testimonial?._id) {
//         console.log("testimonial id", testimonial._id);

//         await updateTestimonial(testimonial._id, rating, feedback);
//         toast.success("Feedback updated successfully");
//       } else {
//         await submitTestimonial(bookingId, rating, feedback);
//         toast.success("Feedback submitted successfully");
//       }
//       onSubmit(rating, feedback);
//       setRating(0);
//       setFeedback("");
//       setTestimonial(null);
//       onClose(); // Close modal after submission
//     } catch (error) {
//       toast.error("Failed to submit feedback");
//       console.error("Error submitting/updating testimonial:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px] bg-white">
//         <DialogHeader>
//           <DialogTitle>
//             {testimonial ? "Edit Feedback" : "Provide Feedback"}
//           </DialogTitle>
//         </DialogHeader>
//         {loading ? (
//           <div className="py-4 text-center">Loading feedback...</div>
//         ) : (
//           <div className="py-4">
//             <div className="flex items-center gap-2 mb-4">
//               {[1, 2, 3, 4, 5].map((value) => (
//                 <button
//                   key={value}
//                   onClick={() => setRating(value)}
//                   className="focus:outline-none"
//                   disabled={loading}
//                 >
//                   <Star
//                     className={`w-6 h-6 ${
//                       value <= rating
//                         ? "fill-yellow-400 text-yellow-400"
//                         : "text-gray-300"
//                     }`}
//                   />
//                 </button>
//               ))}
//             </div>
//             <textarea
//               value={feedback}
//               onChange={(e) => setFeedback(e.target.value)}
//               placeholder="Write your feedback here..."
//               className="w-full px-3 py-2 border rounded-md h-32 resize-none"
//               disabled={loading}
//             />
//           </div>
//         )}
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose} disabled={loading}>
//             Cancel
//           </Button>
//           <Button
//             className="bg-black text-white"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {testimonial ? "Update Feedback" : "Submit Feedback"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
import { useState, useEffect } from "react";
import { Star, Heart, MessageSquare, Send, Sparkles } from "lucide-react";
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
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch testimonial when modal opens and bookingId is provided
  useEffect(() => {
    async function fetchTestimonial() {
      if (!isOpen || !bookingId) return;

      setLoading(true);
      try {
        const response = await getTestimonialByBookingId(bookingId);
        if (response) {
          setTestimonial(response);
          setRating(response.rating);
          setFeedback(response.comment);
        } else {
          setTestimonial(null);
          setRating(0);
          setFeedback("");
        }
      } catch (error) {
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
        await updateTestimonial(testimonial._id, rating, feedback);
        toast.success("Feedback updated successfully! 🎉");
      } else {
        await submitTestimonial(bookingId, rating, feedback);
        toast.success("Thank you for your feedback! ⭐");
      }
      onSubmit(rating, feedback);
      setRating(0);
      setFeedback("");
      setTestimonial(null);
      onClose();
    } catch (error) {
      toast.error("Failed to submit feedback");
      console.error("Error submitting/updating testimonial:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setFeedback("");
    setHoverRating(0);
    onClose();
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Rate your experience";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return "text-red-500";
    if (rating === 3) return "text-yellow-500";
    if (rating === 4) return "text-blue-500";
    return "text-green-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-white rounded-3xl border-0 shadow-2xl overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-300/20 to-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-300/20 to-yellow-300/20 rounded-full blur-3xl" />

        <div className="relative z-10 ">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              {testimonial ? (
                <Heart className="w-8 h-8 text-white" />
              ) : (
                <MessageSquare className="w-8 h-8 text-white" />
              )}
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-center ">
              {testimonial ? "Edit Your Feedback" : "Share Your Experience"}
            </DialogTitle>
            <p className="text-gray-500 mt-2 text-center ">
              Your feedback helps mentors improve their services
            </p>
          </DialogHeader>

          {loading ? (
            <div className="py-12 text-center">
              <div className="relative mb-4">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                </div>
              </div>
              <p className="text-gray-600 font-medium">
                Loading your feedback...
              </p>
            </div>
          ) : (
            <div className="py-6 space-y-8">
              {/* Rating Section */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  How would you rate this session?
                </h3>

                <div className="flex justify-center items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transform hover:scale-110 transition-all duration-200"
                      disabled={loading}
                    >
                      <Star
                        className={`w-10 h-10 transition-all duration-200 ${
                          value <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400 scale-110"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <p
                  className={`text-lg font-semibold ${getRatingColor(
                    hoverRating || rating
                  )}`}
                >
                  {getRatingText(hoverRating || rating)}
                </p>
              </div>

              {/* Feedback Section */}
              <div>
                <h3 className="text-sm  text-gray-500 mb-4">
                  Tell us more about your experience
                </h3>
                <div className="relative">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts about the session, what you learned, and how the mentor helped you..."
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl h-24 resize-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    disabled={loading}
                    maxLength={700}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {feedback.length}/500
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-3 pt-6">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="rounded-xl px-6 py-3 border-2 border-gray-200 hover:bg-gray-50 font-semibold transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || rating === 0 || !feedback.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>
                    {testimonial ? "Update Feedback" : "Submit Feedback"}
                  </span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
