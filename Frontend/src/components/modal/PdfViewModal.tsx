import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfFile: File | null;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  isOpen,
  onClose,
  pdfFile,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-white">
        <DialogHeader>
          <DialogTitle>View PDF</DialogTitle>
        </DialogHeader>
        {pdfFile ? (
          <div className="w-full h-[70vh]">
            <iframe
              src={URL.createObjectURL(pdfFile)}
              className="w-full h-full border-0"
              title="PDF Viewer"
            />
          </div>
        ) : (
          <p>No PDF file available</p>
        )}
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewerModal;
