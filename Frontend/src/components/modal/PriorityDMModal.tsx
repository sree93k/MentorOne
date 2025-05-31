// import React, { useEffect, useRef, useState } from "react";
// import {
//   X,
//   Bold,
//   Italic,
//   Underline,
//   List,
//   ListOrdered,
//   Link,
//   Image,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   AlignJustify,
//   Code,
//   FileText,
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import {
//   uploadToS3WithPresignedUrl,
//   getPresignedUrlForView,
// } from "@/services/userServices";
// import { createPriorityDM } from "@/services/menteeService";
// import { replyToPriorityDM } from "@/services/mentorService";
// import toast from "react-hot-toast";

// interface PriorityDMModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   serviceId: string;
//   bookingId?: string;
//   title: string;
//   productType: string;
//   existingDM?: any;
// }

// const PriorityDMModal: React.FC<PriorityDMModalProps> = ({
//   isOpen,
//   onClose,
//   serviceId,
//   bookingId,
//   title,
//   productType,
//   existingDM,
// }) => {
//   const [editorContent, setEditorContent] = useState("");
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [quillInitialized, setQuillInitialized] = useState(false);
//   const editorRef = useRef<HTMLDivElement>(null);
//   const quillRef = useRef<Quill | null>(null);
//   const [editorReady, setIsEditorReady] = useState(false);
//   const { user, isOnline } = useSelector((state: RootState) => state.user);

//   const isMentee = isOnline?.role?.toLowerCase() === "mentee";
//   console.log("isMentee:", isMentee, "role:", isOnline?.role);

//   useEffect(() => {
//     if (isOpen) {
//       console.log("User object:", JSON.stringify(user, null, 2));
//       console.log("PriorityDMModal opened with:", {
//         serviceId,
//         bookingId,
//         userId: user?._id,
//         existingDM,
//         role: isOnline?.role,
//       });
//     }
//   }, [isOpen, serviceId, bookingId, user, existingDM]);

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const colorOptions = [
//     "#000000",
//     "#e60000",
//     "#ff9900",
//     "#ffff00",
//     "#008a00",
//     "#0066cc",
//     "#9933ff",
//     "#ffffff",
//     "#facccc",
//     "#ffebcc",
//     "#ffffcc",
//     "#cce8cc",
//     "#cce0f5",
//     "#ebd6ff",
//     "#bbbbbb",
//     "#f06666",
//     "#ffc266",
//     "#ffff66",
//     "#66b966",
//     "#66a3e0",
//     "#c285ff",
//     "#888888",
//     "#a10000",
//     "#b26b00",
//     "#b2b200",
//     "#006100",
//     "#0047b2",
//     "#6b24b2",
//     "#444444",
//     "#5c0000",
//     "#663d00",
//     "#666600",
//     "#003700",
//     "#002966",
//     "#3d1466",
//   ];

//   useEffect(() => {
//     if (isOpen) {
//       const timer = setTimeout(() => {
//         setIsEditorReady(true);
//       }, 300);
//       return () => clearTimeout(timer);
//     } else {
//       setIsEditorReady(false);
//       setQuillInitialized(false);
//       setEditorContent("");
//       setSelectedFiles([]);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (!editorReady || !editorRef.current || quillInitialized) return;

//     if (quillRef.current) {
//       quillRef.current.off("text-change");
//       quillRef.current = null;
//       if (editorRef.current) {
//         editorRef.current.innerHTML = "";
//       }
//     }

//     const toolbarOptions = [
//       [{ font: [] }],
//       [{ size: ["small", false, "large", "huge"] }],
//       ["bold", "italic", "underline", "code-block"],
//       [{ color: colorOptions }, { background: colorOptions }],
//       [
//         { align: null },
//         { align: "center" },
//         { align: "right" },
//         { align: "justify" },
//       ],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["clean"],
//     ];

//     quillRef.current = new Quill(editorRef.current, {
//       modules: { toolbar: toolbarOptions },
//       theme: "snow",
//       placeholder: isMentee
//         ? "Type your message here..."
//         : "Type your reply here...",
//     });

//     quillRef.current.on("text-change", () => {
//       if (quillRef.current) {
//         setEditorContent(quillRef.current.root.innerHTML);
//       }
//     });

//     if (existingDM && !isMentee) {
//       quillRef.current.root.innerHTML = existingDM.mentorReply?.content || "";
//       setEditorContent(existingDM.mentorReply?.content || "");
//     }

//     quillRef.current.focus();
//     setQuillInitialized(true);
//   }, [editorReady, quillInitialized, existingDM, isMentee]);

//   useEffect(() => {
//     return () => {
//       if (quillRef.current) {
//         quillRef.current.off("text-change");
//         quillRef.current = null;
//       }
//     };
//   }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files).filter((file) =>
//         file.type.includes("pdf")
//       );
//       if (files.length + selectedFiles.length > 5) {
//         toast.error("Maximum 5 PDF files allowed.");
//         return;
//       }
//       setSelectedFiles([...selectedFiles, ...files]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
//   };

//   const viewFile = async (s3Key: string) => {
//     try {
//       const url = await getPresignedUrlForView(s3Key);
//       window.open(url, "_blank");
//     } catch (error) {
//       toast.error("Failed to view PDF.");
//       console.error("Error viewing PDF:", error);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!editorContent.trim() && selectedFiles.length === 0) {
//       toast.error("Please provide content or upload a PDF.");
//       return;
//     }

//     if (!user?._id) {
//       toast.error("User not logged in. Please log in again.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       console.log("PriorityDM is submitting uploadedFiles step 1");
//       const uploadedFiles = await Promise.all(
//         selectedFiles.map(async (file) => {
//           const url = await uploadToS3WithPresignedUrl(
//             file,
//             "pdfs",
//             "application/pdf"
//           );
//           return {
//             fileName: file.name,
//             s3Key: url.split("/").slice(-2).join("/"),
//             url,
//           };
//         })
//       );
//       console.log(
//         "PriorityDM is submitting uploadedFiles step 2",
//         uploadedFiles
//       );

//       if (isMentee) {
//         console.log("PriorityDM is submitting uploadedFiles step 3");
//         if (!bookingId) {
//           throw new Error("Booking ID is required for mentee DM.");
//         }
//         const priorityDMData = {
//           serviceId,
//           bookingId,
//           menteeId: user._id,
//           content: editorContent,
//           pdfFiles: uploadedFiles,
//         };
//         console.log("Submitting PriorityDM with data:", priorityDMData);
//         await createPriorityDM(priorityDMData);
//         toast.success("Priority DM sent successfully!");
//       } else {
//         console.log(
//           "PriorityDM is submitting uploadedFiles step 4",
//           existingDM
//         );
//         if (!existingDM?._id) {
//           throw new Error("Cannot reply: No existing DM provided.");
//         }
//         await replyToPriorityDM(existingDM._id, {
//           content: editorContent,
//           pdfFiles: uploadedFiles,
//         });
//         console.log("PriorityDM is submitting uploadedFiles step 5");
//         toast.success("Reply sent successfully!");
//       }
//       console.log("PriorityDM is submitting uploadedFiles step 6");
//       setEditorContent("");
//       setSelectedFiles([]);
//       onClose();
//     } catch (error: any) {
//       console.log("PriorityDM is submitting uploadedFiles step 7");
//       toast.error(error.message || "Failed to submit. Please try again.");
//       console.error("Error submitting PriorityDM:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl bg-white overflow-visible">
//         <DialogHeader>
//           <DialogTitle>
//             {isMentee ? title : `Reply to ${title}`} ({productType})
//           </DialogTitle>
//         </DialogHeader>
//         <div className="py-4">
//           {!isMentee && existingDM && (
//             <div className="mb-4 p-4 bg-gray-50 rounded-md">
//               <h3 className="font-medium mb-2">Mentee's Message:</h3>
//               <div
//                 className="ql-editor"
//                 dangerouslySetInnerHTML={{ __html: existingDM.content }}
//               />
//               {existingDM.pdfFiles?.length > 0 && (
//                 <div className="mt-2">
//                   <p className="font-medium">Mentee's Attachments:</p>
//                   <div className="flex flex-wrap gap-2 mt-1">
//                     {existingDM.pdfFiles.map((file: any, index: number) => (
//                       <div
//                         key={index}
//                         className="flex items-center bg-gray-100 rounded-md px-2 py-1"
//                       >
//                         <FileText size={16} className="mr-1" />
//                         <span className="text-sm truncate max-w-xs">
//                           {file.fileName}
//                         </span>
//                         <button
//                           onClick={() => viewFile(file.s3Key)}
//                           className="ml-2 text-blue-500 hover:text-blue-700"
//                         >
//                           View
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="px-4">
//             <div
//               ref={editorRef}
//               className="editor-container"
//               style={{
//                 height: "350px",
//                 border: "1px solid #ccc",
//                 borderRadius: "0.375rem",
//                 marginBottom: "1rem",
//               }}
//             />
//           </div>

//           <div className="p-4 border-t">
//             <p className="mb-2 font-medium">Attachments</p>
//             {selectedFiles.length > 0 && (
//               <div className="mb-3 flex flex-wrap gap-2">
//                 {selectedFiles.map((file, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center bg-gray-100 rounded-md px-2 py-1"
//                   >
//                     <FileText size={16} className="mr-1" />
//                     <span className="text-sm truncate max-w-xs">
//                       {file.name}
//                     </span>
//                     <button
//                       onClick={() => removeFile(index)}
//                       className="ml-1 text-gray-500 hover:text-red-500"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <div className="flex items-center">
//               <label className="cursor-pointer px-3 py-1.5 bg-black text-white hover:bg-gray-800 rounded text-sm">
//                 Upload PDF
//                 <input
//                   type="file"
//                   accept=".pdf"
//                   multiple
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </label>
//               <span className="ml-2 text-sm text-gray-500">
//                 {selectedFiles.length > 0
//                   ? `${selectedFiles.length} file(s) selected`
//                   : "No files selected"}
//               </span>
//             </div>
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
//             Cancel
//           </Button>
//           <Button
//             className="bg-black text-white hover:bg-gray-800"
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//           >
//             {isSubmitting
//               ? "Submitting..."
//               : isMentee
//               ? "Send Message"
//               : "Send Reply"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PriorityDMModal;
import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  uploadToS3WithPresignedUrl,
  getPresignedUrlForView,
} from "@/services/userServices";
import { createPriorityDM } from "@/services/menteeService";
import { replyToPriorityDM } from "@/services/mentorService";
import toast from "react-hot-toast";
import PDFViewerModal from "./PdfViewModal";
interface PriorityDMModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  bookingId?: string;
  title: string;
  productType: string;
  existingDM?: any;
}

const PriorityDMModal: React.FC<PriorityDMModalProps> = ({
  isOpen,
  onClose,
  serviceId,
  bookingId,
  title,
  productType,
  existingDM,
}) => {
  const [editorContent, setEditorContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [quillInitialized, setQuillInitialized] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [editorReady, setIsEditorReady] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [selectedPDFUrl, setSelectedPDFUrl] = useState<string | null>(null);
  const { user, isOnline } = useSelector((state: RootState) => state.user);

  const isMentee = isOnline?.role?.toLowerCase() === "mentee";

  useEffect(() => {
    if (isOpen) {
      console.log("User object:", JSON.stringify(user, null, 2));
      console.log("PriorityDMModal opened with:", {
        serviceId,
        bookingId,
        userId: user?._id,
        existingDM,
        role: isOnline?.role,
      });
    }
  }, [isOpen, serviceId, bookingId, user, existingDM]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    "#000000",
    "#e60000",
    "#ff9900",
    "#ffff00",
    "#008a00",
    "#0066cc",
    "#9933ff",
    "#ffffff",
    "#facccc",
    "#ffebcc",
    "#ffffcc",
    "#cce8cc",
    "#cce0f5",
    "#ebd6ff",
    "#bbbbbb",
    "#f06666",
    "#ffc266",
    "#ffff66",
    "#66b966",
    "#66a3e0",
    "#c285ff",
    "#888888",
    "#a10000",
    "#b26b00",
    "#b2b200",
    "#006100",
    "#0047b2",
    "#6b24b2",
    "#444444",
    "#5c0000",
    "#663d00",
    "#666600",
    "#003700",
    "#002966",
    "#3d1466",
  ];

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsEditorReady(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsEditorReady(false);
      setQuillInitialized(false);
      setEditorContent("");
      setSelectedFiles([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!editorReady || !editorRef.current || quillInitialized) return;

    if (quillRef.current) {
      quillRef.current.off("text-change");
      quillRef.current = null;
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    }

    const toolbarOptions = [
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "code-block"],
      [{ color: colorOptions }, { background: colorOptions }],
      [
        { align: null },
        { align: "center" },
        { align: "right" },
        { align: "justify" },
      ],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ];

    quillRef.current = new Quill(editorRef.current, {
      modules: { toolbar: toolbarOptions },
      theme: "snow",
      placeholder: isMentee
        ? "Type your message here..."
        : "Type your reply here...",
    });

    quillRef.current.on("text-change", () => {
      if (quillRef.current) {
        setEditorContent(quillRef.current.root.innerHTML);
      }
    });

    if (existingDM && !isMentee) {
      quillRef.current.root.innerHTML = existingDM.mentorReply?.content || "";
      setEditorContent(existingDM.mentorReply?.content || "");
    }

    quillRef.current.focus();
    setQuillInitialized(true);
  }, [editorReady, quillInitialized, existingDM, isMentee]);

  useEffect(() => {
    return () => {
      if (quillRef.current) {
        quillRef.current.off("text-change");
        quillRef.current = null;
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file) =>
        file.type.includes("pdf")
      );
      if (files.length + selectedFiles.length > 5) {
        toast.error("Maximum 5 PDF files allowed.");
        return;
      }
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

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

  const handleSubmit = async () => {
    if (!editorContent.trim() && selectedFiles.length === 0) {
      toast.error("Please provide content or upload a PDF.");
      return;
    }

    if (!user?._id) {
      toast.error("User not logged in. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const url = await uploadToS3WithPresignedUrl(
            file,
            "pdfs",
            "application/pdf"
          );
          return {
            fileName: file.name,
            s3Key: url.split("/").slice(-2).join("/"),
            url,
          };
        })
      );

      if (isMentee) {
        if (!bookingId) {
          throw new Error("Booking ID is required for mentee DM.");
        }
        const priorityDMData = {
          serviceId,
          bookingId,
          menteeId: user._id,
          content: editorContent,
          pdfFiles: uploadedFiles,
        };
        await createPriorityDM(priorityDMData);
        toast.success("Priority DM sent successfully!");
      } else {
        if (!existingDM?._id) {
          throw new Error("Cannot reply: No existing DM provided.");
        }
        await replyToPriorityDM(existingDM._id, {
          content: editorContent,
          pdfFiles: uploadedFiles,
        });
        toast.success("Reply sent successfully!");
      }
      setEditorContent("");
      setSelectedFiles([]);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit. Please try again.");
      console.error("Error submitting PriorityDM:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl bg-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isMentee ? title : `Reply to ${title}`} ({productType})
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {!isMentee && existingDM && (
              <div className="mb-4 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Mentee's Message:</h3>
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{ __html: existingDM.content }}
                />
                {existingDM.pdfFiles?.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Mentee's Attachments:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {existingDM.pdfFiles.map((file: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center bg-gray-100 rounded-md px-2 py-1"
                        >
                          <FileText size={16} className="mr-1" />
                          <span className="text-sm truncate max-w-xs">
                            {file.fileName}
                          </span>
                          <button
                            onClick={() => viewFile(file.s3Key)}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="px-4">
              <div
                ref={editorRef}
                className="editor-container"
                style={{
                  height: "350px",
                  border: "1px solid #ccc",
                  borderRadius: "0.375rem",
                  marginBottom: "1rem",
                }}
              />
            </div>

            <div className="p-4 border-t">
              <p className="mb-2 font-medium">Attachments</p>
              {selectedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-md px-2 py-1"
                    >
                      <FileText size={16} className="mr-1" />
                      <span className="text-sm truncate max-w-xs">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center">
                <label className="cursor-pointer px-3 py-1.5 bg-black text-white hover:bg-gray-800 rounded text-sm">
                  Upload PDF
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <span className="ml-2 text-sm text-gray-500">
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} file(s) selected`
                    : "No files selected"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : isMentee
                ? "Send Message"
                : "Send Reply"}
            </Button>
          </DialogFooter>
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
};

export default PriorityDMModal;
