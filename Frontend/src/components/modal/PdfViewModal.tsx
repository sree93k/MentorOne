// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// interface PDFViewerModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   pdfFile?: File | null;
//   pdfUrl?: string;
// }

// const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
//   isOpen,
//   onClose,
//   pdfFile,
//   pdfUrl,
// }) => {
//   const pdfSource = pdfFile ? URL.createObjectURL(pdfFile) : pdfUrl;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl bg-white">
//         <DialogHeader>
//           <DialogTitle>View PDF</DialogTitle>
//         </DialogHeader>
//         {pdfSource ? (
//           <iframe
//             src={pdfSource}
//             width="100%"
//             height="500px"
//             title="PDF Viewer"
//           />
//         ) : (
//           <p>No PDF available</p>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PDFViewerModal;
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View PDF</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <iframe
            src={pdfUrl}
            className="w-full h-[60vh] border border-gray-300 rounded"
            title="PDF Viewer"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewerModal;
