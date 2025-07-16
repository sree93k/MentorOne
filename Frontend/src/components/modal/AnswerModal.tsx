import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Rating, RatingStar } from "flowbite-react";
import { getPresignedUrlForView } from "@/services/userServices";
import toast from "react-hot-toast";
import PDFViewerModal from "@/components/modal/PdfViewModal";
import DOMPurify from "dompurify"; // For sanitizing HTML

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: {
    _id: string;
    menteeId: { firstName: string; lastName: string; profilePicture?: string };
    timestamp: string;
    content: string;
    pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
    mentorReply?: {
      content: string;
      pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
      repliedAt: string;
    };
    menteeTestimonial?: { rating: number };
    mentorId: { firstName: string; lastName: string; profilePicture?: string }; // Added mentorId
  };
}

export default function AnswerModal({
  isOpen,
  onClose,
  question,
}: AnswerModalProps) {
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [selectedPDFUrl, setSelectedPDFUrl] = useState<string | null>(null);

  const viewFile = async (s3Key: string) => {
    try {
      const url = await getPresignedUrlForView(s3Key);
      setSelectedPDFUrl(url);
      setIsPDFModalOpen(true);
    } catch (error) {
      toast.error("Failed to load PDF.");
      console.error("Error loading PDF:", error);
    }
  };

  // Sanitize HTML content to prevent XSS
  const sanitizedMentorReply = question.mentorReply?.content
    ? DOMPurify.sanitize(question.mentorReply.content)
    : "";

  // Format timestamp
  const formatTimestamp = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] bg-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Answer</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Mentee Section */}
            <div className="flex items-center gap-3 mb-4 relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={question.menteeId.profilePicture || ""} />
                <AvatarFallback>
                  {question.menteeId.firstName[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {question.menteeId.firstName} {question.menteeId.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(question.timestamp)}
                </p>
              </div>
              {question.menteeTestimonial?.rating && (
                <div className="absolute top-3 right-4">
                  <Rating>
                    {[...Array(5)].map((_, i) => (
                      <RatingStar
                        key={i}
                        filled={i < question?.menteeTestimonial?.rating}
                      />
                    ))}
                  </Rating>
                </div>
              )}
            </div>
            <div className="text-sm bg-gray-100 p-2">
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(question.content),
                }}
              />
              {question.pdfFiles?.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Mentee's Attachments:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {question.pdfFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-200 rounded-md px-2 py-1"
                        title={file.fileName} // Tooltip for long file names
                      >
                        <FileText size={16} className="mr-1" />
                        <span className="text-sm truncate max-w-[200px]">
                          {file.fileName}
                        </span>
                        <button
                          onClick={() => file.s3Key && viewFile(file.s3Key)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          disabled={!file.s3Key}
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mentor Reply Section */}
            {question.mentorReply && question.mentorReply.content && (
              <>
                <div className="flex items-center gap-3 mt-6">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={question.mentorId.profilePicture || ""} />
                    <AvatarFallback>
                      {question.mentorId.firstName[0] || "M"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">
                    {question.mentorId.firstName} {question.mentorId.lastName}
                  </p>
                </div>
                <div className="text-sm bg-gray-100 p-2">
                  <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{
                      __html: sanitizedMentorReply,
                    }}
                  />
                  {question.mentorReply.pdfFiles?.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Mentor's Attachments:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {question.mentorReply.pdfFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-gray-200 rounded-md px-2 py-1"
                            title={file.fileName} // Tooltip for long file names
                          >
                            <FileText size={16} className="mr-1" />
                            <span className="text-sm truncate max-w-[200px]">
                              {file.fileName}
                            </span>
                            <button
                              onClick={() => file.s3Key && viewFile(file.s3Key)}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                              disabled={!file.s3Key}
                            >
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Replied on {formatTimestamp(question.mentorReply.repliedAt)}
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {selectedPDFUrl && (
        <PDFViewerModal
          isOpen={isPDFModalOpen}
          onClose={() => {
            setIsPDFModalOpen(false);
            setSelectedPDFUrl(null);
          }}
          pdfUrl={selectedPDFUrl}
        />
      )}
    </>
  );
}
