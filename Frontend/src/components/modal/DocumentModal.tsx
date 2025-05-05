import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getDocumentUrl } from "@/services/bookingService";

interface DigitalProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  title: string;
  productType: string;
}

export default function DigitalProductModal({
  isOpen,
  onClose,
  serviceId,
  title,
  productType,
}: DigitalProductModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && serviceId) {
      const fetchPdfUrl = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const url = await getDocumentUrl(serviceId);
          setPdfUrl(url);
        } catch (err: any) {
          console.error("Failed to fetch PDF URL:", err);
          setError(
            err.message === "PDF file URL not found for this service"
              ? "No PDF available for this service."
              : err.message === "Service is not a document"
              ? "This service is not a document."
              : err.message === "Service not found"
              ? "Service not found."
              : "Failed to load PDF. Please try again later."
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchPdfUrl();
    }
  }, [isOpen, serviceId]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      // Sanitize title for filename
      const sanitizedTitle = title
        .replace(/[^a-zA-Z0-9-_]/g, "_")
        .toLowerCase();
      link.download = `${sanitizedTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader>
          <DialogTitle>
            {title} ({productType})
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="text-center">Loading PDF...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : pdfUrl ? (
            <div className="w-full h-[500px]">
              <iframe
                src={pdfUrl}
                title={title}
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="text-center">No PDF available</div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {pdfUrl && (
            <Button className="bg-black text-white" onClick={handleDownload}>
              Download PDF
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
