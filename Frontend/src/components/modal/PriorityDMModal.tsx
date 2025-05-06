// import React, { useEffect, useRef, useState } from "react";
// import {
//   X,
//   Bold,
//   Italic,
//   Underline,
//   List,
//   ListOrdered,
//   FileText,
//   ChevronDown,
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// interface PriorityDMModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   serviceId: string;
//   title: string;
//   productType: string;
// }

// const PriorityDMModal = ({
//   isOpen,
//   onClose,
//   serviceId,
//   title,
//   productType,
// }: PriorityDMModalProps) => {
//   const [editorContent, setEditorContent] = useState("");
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [fontStyle, setFontStyle] = useState("Arial");
//   const [fontSize, setFontSize] = useState("medium");
//   const [isBold, setIsBold] = useState(false);
//   const [isItalic, setIsItalic] = useState(false);
//   const [isUnderline, setIsUnderline] = useState(false);
//   const [showFontMenu, setShowFontMenu] = useState(false);
//   const [showSizeMenu, setShowSizeMenu] = useState(false);

//   const editorRef = useRef<HTMLDivElement>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setSelectedFiles([...selectedFiles, ...files]);
//     }
//   };

//   const removeFile = (index: number) => {
//     const newFiles = [...selectedFiles];
//     newFiles.splice(index, 1);
//     setSelectedFiles(newFiles);
//   };

//   const handleSubmit = () => {
//     // Log content and files (replace with API call to send message)
//     console.log("Submitting Priority DM:", {
//       serviceId,
//       content: editorContent,
//       files: selectedFiles,
//     });
//     setEditorContent("");
//     setSelectedFiles([]);
//     onClose();
//   };

//   const toggleFontMenu = () => {
//     setShowFontMenu(!showFontMenu);
//     setShowSizeMenu(false);
//   };

//   const toggleSizeMenu = () => {
//     setShowSizeMenu(!showSizeMenu);
//     setShowFontMenu(false);
//   };

//   const fontStyles = [
//     "Arial",
//     "Times New Roman",
//     "Courier New",
//     "Georgia",
//     "Verdana",
//   ];
//   const fontSizes = ["small", "medium", "large", "x-large"];

//   const applyFormat = (format: string) => {
//     if (format === "bold") setIsBold(!isBold);
//     if (format === "italic") setIsItalic(!isItalic);
//     if (format === "underline") setIsUnderline(!isUnderline);
//     // Update editor content with formatting
//     if (editorRef.current) {
//       document.execCommand(format, false, undefined);
//     }
//   };

//   const applyFontStyle = (font: string) => {
//     setFontStyle(font);
//     setShowFontMenu(false);
//     // Update editor font (not fully supported in contentEditable)
//     if (editorRef.current) {
//       editorRef.current.style.fontFamily = font;
//     }
//   };

//   const applyFontSize = (size: string) => {
//     setFontSize(size);
//     setShowSizeMenu(false);
//     // Update editor font size
//     if (editorRef.current) {
//       editorRef.current.style.fontSize =
//         size === "small"
//           ? "14px"
//           : size === "medium"
//           ? "16px"
//           : size === "large"
//           ? "18px"
//           : "20px";
//     }
//   };

//   const handleContentChange = () => {
//     if (editorRef.current) {
//       setEditorContent(editorRef.current.innerHTML);
//     }
//   };

//   // Focus editor when modal opens
//   useEffect(() => {
//     if (isOpen && editorRef.current) {
//       editorRef.current.focus();
//     }
//   }, [isOpen]);

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl bg-white overflow-visible">
//         <DialogHeader>
//           <DialogTitle>
//             {title} ({productType})
//           </DialogTitle>
//         </DialogHeader>
//         <div className="py-4">
//           {/* Toolbar */}
//           <div className="flex items-center gap-1 p-2 border-b ">
//             {/* Font Family Dropdown */}
//             <div className="relative overflow-visible">
//               <button
//                 onClick={toggleFontMenu}
//                 className="flex items-center w-40  px-2 py-1 text-sm border rounded hover:bg-gray-100"
//               >
//                 <div className="flex justify-between items-center w-full">
//                   <span>{fontStyle}</span>
//                   <ChevronDown size={16} className="ml-1" />
//                 </div>
//               </button>
//               {showFontMenu && (
//                 <div className="absolute top-full  left-0 mt-1  bg-white border rounded-md shadow-lg z-50">
//                   {fontStyles.map((font) => (
//                     <button
//                       key={font}
//                       onClick={() => applyFontStyle(font)}
//                       className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       {font}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Font Size Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={toggleSizeMenu}
//                 className="flex items-center px-2 py-1 text-sm border rounded hover:bg-gray-100"
//               >
//                 {fontSize} <ChevronDown size={16} className="ml-1" />
//               </button>
//               {showSizeMenu && (
//                 <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-50">
//                   {fontSizes.map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => applyFontSize(size)}
//                       className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="h-6 w-px mx-1 bg-gray-300"></div>

//             {/* Text Formatting */}
//             <button
//               onClick={() => applyFormat("bold")}
//               className={`p-1.5 rounded ${
//                 isBold ? "bg-gray-200" : "hover:bg-gray-100"
//               }`}
//             >
//               <Bold size={18} />
//             </button>
//             <button
//               onClick={() => applyFormat("italic")}
//               className={`p-1.5 rounded ${
//                 isItalic ? "bg-gray-200" : "hover:bg-gray-100"
//               }`}
//             >
//               <Italic size={18} />
//             </button>
//             <button
//               onClick={() => applyFormat("underline")}
//               className={`p-1.5 rounded ${
//                 isUnderline ? "bg-gray-200" : "hover:bg-gray-100"
//               }`}
//             >
//               <Underline size={18} />
//             </button>

//             <div className="h-6 w-px mx-1 bg-gray-300"></div>

//             {/* Lists */}
//             <button
//               onClick={() => applyFormat("insertUnorderedList")}
//               className="p-1.5 rounded hover:bg-gray-100"
//             >
//               <List size={18} />
//             </button>
//             <button
//               onClick={() => applyFormat("insertOrderedList")}
//               className="p-1.5 rounded hover:bg-gray-100"
//             >
//               <ListOrdered size={18} />
//             </button>
//           </div>

//           {/* Editor Area */}
//           <div className="p-4">
//             <div
//               ref={editorRef}
//               className="min-h-64 border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               contentEditable={true}
//               onInput={handleContentChange}
//               style={{
//                 fontFamily: fontStyle,
//                 fontSize:
//                   fontSize === "small"
//                     ? "14px"
//                     : fontSize === "medium"
//                     ? "16px"
//                     : fontSize === "large"
//                     ? "18px"
//                     : "20px",
//                 fontWeight: isBold ? "bold" : "normal",
//                 fontStyle: isItalic ? "italic" : "normal",
//                 textDecoration: isUnderline ? "underline" : "none",
//               }}
//             >
//               Type your message here...
//             </div>
//           </div>

//           {/* File Upload Area */}
//           <div className="p-4 border-t">
//             <p className="mb-2 font-medium">Attachments</p>
//             {selectedFiles.length > 0 && (
//               <div className="mb-3 flex flex-wrap gap-2">
//                 {selectedFiles.map((file, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center bg-gray-100 rounded-md px-2 py-1"
//                   >
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
//               <label className="cursor-pointer px-3 py-1.5 bg-black text-white hover:bg-gray-500 rounded text-sm">
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
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button className="bg-black text-white" onClick={handleSubmit}>
//             Send Message
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
import "quill/dist/quill.snow.css"; // Import Quill styles

interface PriorityDMModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  title: string;
  productType: string;
}

const PriorityDMModal = ({
  isOpen,
  onClose,
  serviceId,
  title,
  productType,
}: PriorityDMModalProps) => {
  const [editorContent, setEditorContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [quillInitialized, setQuillInitialized] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [editorReady, setEditorReady] = useState(false);

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

  // Set editor as ready once the modal is fully visible
  useEffect(() => {
    if (isOpen) {
      // Allow time for modal animation to complete and DOM to be fully rendered
      const timer = setTimeout(() => {
        setEditorReady(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setEditorReady(false);
      setQuillInitialized(false);
    }
  }, [isOpen]);

  // Initialize Quill when modal is fully open and DOM is ready
  useEffect(() => {
    if (!editorReady || !editorRef.current || quillInitialized) return;

    // Clean up any existing instance
    if (quillRef.current) {
      quillRef.current.off("text-change");
      quillRef.current = null;

      // Clear the editor container
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    }

    // Create toolbar options
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
      ["link", "image"],
      ["clean"],
    ];

    // Initialize Quill with options
    quillRef.current = new Quill(editorRef.current, {
      modules: {
        toolbar: toolbarOptions,
      },
      theme: "snow",
      placeholder: "Type your message here...",
    });

    // Update editor content state on change
    quillRef.current.on("text-change", () => {
      if (quillRef.current) {
        setEditorContent(quillRef.current.root.innerHTML);
      }
    });

    // Focus editor after initialization
    quillRef.current.focus();

    setQuillInitialized(true);
  }, [editorReady, quillInitialized]);

  // Cleanup when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (quillRef.current) {
        quillRef.current.off("text-change");
        quillRef.current = null;
      }
    };
  }, []);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };

  // Remove uploaded file
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log("Submitting Priority DM:", {
      serviceId,
      content: editorContent,
      files: selectedFiles,
    });
    setEditorContent("");
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white overflow-visible">
        <DialogHeader>
          <DialogTitle>
            {title} ({productType})
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {/* Editor Container */}
          <div className="px-4">
            {/* This is where Quill will insert both toolbar and editor */}
            <div
              ref={editorRef}
              className="editor-container"
              style={{
                height: "350px",
                border: "1px solid #ccc",
                borderRadius: "0.375rem",
                marginBottom: "1rem",
              }}
            ></div>
          </div>

          {/* File Upload Area */}
          <div className="p-4 border-t">
            <p className="mb-2 font-medium">Attachments</p>
            {selectedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 rounded-md px-2 py-1"
                  >
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={handleSubmit}
          >
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriorityDMModal;
