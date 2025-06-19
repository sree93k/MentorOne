import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfFile?: File | null;
  pdfUrl?: string;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  isOpen,
  onClose,
  pdfFile,
  pdfUrl,
}) => {
  const pdfSource = pdfFile ? URL.createObjectURL(pdfFile) : pdfUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader>
          <DialogTitle>View PDF</DialogTitle>
        </DialogHeader>
        {pdfSource ? (
          <iframe
            src={pdfSource}
            width="100%"
            height="500px"
            title="PDF Viewer"
          />
        ) : (
          <p>No PDF available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewerModal;
