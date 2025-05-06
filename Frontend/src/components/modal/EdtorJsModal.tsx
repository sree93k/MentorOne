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
//   const [editorContent, setEditorContent] = useState(
//     "<p>Type your message here...</p>"
//   );
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
//     // Strip the initial placeholder if it's still there
//     const finalContent = editorContent.replace(
//       "<p>Type your message here...</p>",
//       ""
//     );

//     // Log content and files (replace with API call to send message)
//     console.log("Submitting Priority DM:", {
//       serviceId,
//       content: finalContent,
//       files: selectedFiles,
//     });
//     setEditorContent("<p>Type your message here...</p>");
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

//   /**
//    * Custom functions to manage formatting directly by manipulating the DOM
//    */

//   // Helper to ensure the editor is focused
//   const ensureFocus = () => {
//     if (editorRef.current) {
//       editorRef.current.focus();
//       return true;
//     }
//     return false;
//   };

//   // Function to get the current selection
//   const getSelection = () => {
//     const selection = window.getSelection();
//     if (!selection || selection.rangeCount === 0) return null;
//     return selection;
//   };

//   // Bold formatting
//   const toggleBold = () => {
//     if (!ensureFocus()) return;

//     // Toggle state
//     setIsBold(!isBold);

//     // Execute command
//     document.execCommand("bold", false, undefined);

//     // Update content
//     handleContentChange();
//   };

//   // Italic formatting
//   const toggleItalic = () => {
//     if (!ensureFocus()) return;

//     // Toggle state
//     setIsItalic(!isItalic);

//     // Execute command
//     document.execCommand("italic", false, undefined);

//     // Update content
//     handleContentChange();
//   };

//   // Underline formatting
//   const toggleUnderline = () => {
//     if (!ensureFocus()) return;

//     // Toggle state
//     setIsUnderline(!isUnderline);

//     // Execute command
//     document.execCommand("underline", false, undefined);

//     // Update content
//     handleContentChange();
//   };

//   // Custom bullet list implementation
//   const insertBulletList = () => {
//     if (!ensureFocus()) return;

//     const selection = getSelection();
//     if (!selection) return;

//     const range = selection.getRangeAt(0);

//     // Check if we're in a paragraph
//     let container = range.commonAncestorContainer;
//     while (
//       container &&
//       container.nodeName !== "P" &&
//       container.nodeName !== "DIV"
//     ) {
//       container = container.parentNode;
//     }

//     // Create a new unordered list
//     const list = document.createElement("ul");
//     list.style.marginLeft = "20px";
//     list.style.listStyleType = "disc";

//     // Add the selected text as a list item
//     const item = document.createElement("li");

//     if (range.toString().trim() === "") {
//       // No selection, create an empty list item
//       item.innerHTML = "<br>";
//     } else {
//       // Use selection as list item content
//       item.appendChild(range.extractContents());
//     }

//     list.appendChild(item);

//     // Replace the current paragraph with our list
//     range.deleteContents();
//     range.insertNode(list);

//     // Position cursor inside list item
//     const newRange = document.createRange();
//     newRange.selectNodeContents(item);
//     newRange.collapse(false);
//     selection.removeAllRanges();
//     selection.addRange(newRange);

//     // Update content
//     handleContentChange();
//   };

//   // Custom numbered list implementation
//   const insertOrderedList = () => {
//     if (!ensureFocus()) return;

//     const selection = getSelection();
//     if (!selection) return;

//     const range = selection.getRangeAt(0);

//     // Check if we're in a paragraph
//     let container = range.commonAncestorContainer;
//     while (
//       container &&
//       container.nodeName !== "P" &&
//       container.nodeName !== "DIV"
//     ) {
//       container = container.parentNode;
//     }

//     // Create a new ordered list
//     const list = document.createElement("ol");
//     list.style.marginLeft = "20px";

//     // Add the selected text as a list item
//     const item = document.createElement("li");

//     if (range.toString().trim() === "") {
//       // No selection, create an empty list item
//       item.innerHTML = "<br>";
//     } else {
//       // Use selection as list item content
//       item.appendChild(range.extractContents());
//     }

//     list.appendChild(item);

//     // Replace the current paragraph with our list
//     range.deleteContents();
//     range.insertNode(list);

//     // Position cursor inside list item
//     const newRange = document.createRange();
//     newRange.selectNodeContents(item);
//     newRange.collapse(false);
//     selection.removeAllRanges();
//     selection.addRange(newRange);

//     // Update content
//     handleContentChange();
//   };

//   const applyFontStyle = (font: string) => {
//     setFontStyle(font);
//     setShowFontMenu(false);

//     if (editorRef.current) {
//       editorRef.current.style.fontFamily = font;
//       handleContentChange();
//     }
//   };

//   const applyFontSize = (size: string) => {
//     setFontSize(size);
//     setShowSizeMenu(false);

//     if (editorRef.current) {
//       editorRef.current.style.fontSize =
//         size === "small"
//           ? "14px"
//           : size === "medium"
//           ? "16px"
//           : size === "large"
//           ? "18px"
//           : "20px";
//       handleContentChange();
//     }
//   };

//   const handleContentChange = () => {
//     if (editorRef.current) {
//       setEditorContent(editorRef.current.innerHTML);
//     }
//   };

//   // Focus editor when modal opens and initialize with empty content
//   useEffect(() => {
//     if (isOpen && editorRef.current) {
//       // Clear placeholder text on first opening
//       if (editorRef.current.innerHTML === "<p>Type your message here...</p>") {
//         const placeholderText = editorRef.current.firstChild;
//         if (placeholderText) {
//           const range = document.createRange();
//           const selection = window.getSelection();

//           range.selectNodeContents(placeholderText);
//           selection?.removeAllRanges();
//           selection?.addRange(range);
//         }
//       }

//       // Focus the editor
//       editorRef.current.focus();
//     }
//   }, [isOpen]);

//   // Handle click outside dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         (showFontMenu || showSizeMenu) &&
//         editorRef.current &&
//         !editorRef.current.contains(event.target as Node)
//       ) {
//         setShowFontMenu(false);
//         setShowSizeMenu(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showFontMenu, showSizeMenu]);

//   // Handle key presses for new list items
//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     // Handle tab key to prevent losing focus
//     if (e.key === "Tab") {
//       e.preventDefault();
//       document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
//       return;
//     }

//     // Special handling for Enter key in lists
//     if (e.key === "Enter") {
//       const selection = window.getSelection();
//       if (!selection || selection.rangeCount === 0) return;

//       const range = selection.getRangeAt(0);
//       let listItem = range.startContainer;

//       // Find the closest list item parent
//       while (listItem && listItem.nodeName !== "LI") {
//         if (listItem.parentNode) {
//           listItem = listItem.parentNode;
//         } else {
//           break;
//         }
//       }

//       // If we're in a list item
//       if (listItem && listItem.nodeName === "LI") {
//         // Check if this is an empty list item
//         if (listItem.textContent?.trim() === "") {
//           e.preventDefault();

//           // Get the parent list
//           const parentList = listItem.parentNode;

//           // If we're in a list, get out of it
//           if (
//             parentList &&
//             (parentList.nodeName === "UL" || parentList.nodeName === "OL")
//           ) {
//             // Create a new paragraph after the list
//             const newParagraph = document.createElement("p");
//             newParagraph.innerHTML = "<br>";

//             if (parentList.nextSibling) {
//               parentList.parentNode?.insertBefore(
//                 newParagraph,
//                 parentList.nextSibling
//               );
//             } else {
//               parentList.parentNode?.appendChild(newParagraph);
//             }

//             // Remove the empty list item
//             parentList.removeChild(listItem);

//             // Position cursor in the new paragraph
//             const newRange = document.createRange();
//             newRange.selectNodeContents(newParagraph);
//             newRange.collapse(true);
//             selection.removeAllRanges();
//             selection.addRange(newRange);

//             // Update content
//             handleContentChange();
//           }
//         }
//       }
//     }
//   };

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
//           <div className="flex items-center gap-1 p-2 border-b">
//             {/* Font Family Dropdown */}
//             <div className="relative overflow-visible">
//               <button
//                 type="button"
//                 onClick={toggleFontMenu}
//                 className="flex items-center w-40 px-2 py-1 text-sm border rounded hover:bg-gray-100"
//               >
//                 <div className="flex justify-between items-center w-full">
//                   <span>{fontStyle}</span>
//                   <ChevronDown size={16} className="ml-1" />
//                 </div>
//               </button>
//               {showFontMenu && (
//                 <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-50">
//                   {fontStyles.map((font) => (
//                     <button
//                       key={font}
//                       type="button"
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
//                 type="button"
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
//                       type="button"
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
//               type="button"
//               onClick={toggleBold}
//               className={`p-1.5 rounded ${
//                 isBold ? "bg-gray-200" : "hover:bg-gray-100"
//               }`}
//             >
//               <Bold size={18} />
//             </button>
//             <button
//               type="button"
//               onClick={toggleItalic}
//               className={`p-1.5 rounded ${
//                 isItalic ? "bg-gray-200" : "hover:bg-gray-100"
//               }`}
//             >
//               <Italic size={18} />
//             </button>
//             <button
//               type="button"
//               onClick={toggleUnderline}
//               className={`p-1.5 rounded ${
//                 isUnderline ? "bg-gray-200" : "hover:bg-gray-100"
//               }`}
//             >
//               <Underline size={18} />
//             </button>

//             <div className="h-6 w-px mx-1 bg-gray-300"></div>

//             {/* Lists - Using our custom implementations */}
//             <button
//               type="button"
//               onClick={insertBulletList}
//               className="p-1.5 rounded hover:bg-gray-100"
//               aria-label="Insert bullet list"
//             >
//               <List size={18} />
//             </button>
//             <button
//               type="button"
//               onClick={insertOrderedList}
//               className="p-1.5 rounded hover:bg-gray-100"
//               aria-label="Insert numbered list"
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
//               onKeyDown={handleKeyDown}
//               dangerouslySetInnerHTML={{ __html: editorContent }}
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
//               }}
//             />
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
//                     <FileText size={14} className="mr-1" />
//                     <span className="text-sm truncate max-w-xs">
//                       {file.name}
//                     </span>
//                     <button
//                       type="button"
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
import { X, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [fontStyle, setFontStyle] = useState("Arial");
  const [fontSize, setFontSize] = useState("medium");
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  const editorRef = useRef<any>(null);
  const editorInstanceRef = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  // Initialize Editor.js
  useEffect(() => {
    // Only run this effect when the modal is open
    if (!isOpen) return;

    // Dynamic import of EditorJS
    const loadEditor = async () => {
      try {
        // Import EditorJS and tools
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const List = (await import("@editorjs/list")).default;
        const Attaches = (await import("@editorjs/attaches")).default;

        // Clean up any existing editor instance
        if (editorInstanceRef.current) {
          editorInstanceRef.current.destroy();
          editorInstanceRef.current = null;
        }

        // Wait for DOM to be ready
        setTimeout(() => {
          if (!editorRef.current) return;

          // Create new editor instance
          editorInstanceRef.current = new EditorJS({
            holder: editorRef.current,
            autofocus: true,
            placeholder: "Start typing your message...",
            tools: {
              header: Header,
              list: List,
              attaches: {
                class: Attaches,
                config: {
                  uploader: {
                    uploadByFile(file: File) {
                      return new Promise((resolve) => {
                        setSelectedFiles((prev) => [...prev, file]);
                        resolve({
                          success: 1,
                          file: {
                            url: URL.createObjectURL(file),
                            name: file.name,
                            size: file.size,
                          },
                        });
                      });
                    },
                  },
                },
              },
            },
            onChange: async () => {
              if (editorInstanceRef.current) {
                const data = await editorInstanceRef.current.save();
                setEditorContent(JSON.stringify(data));
              }
            },
            data: {
              blocks: [
                {
                  type: "paragraph",
                  data: {
                    text: "Type your message here...",
                  },
                },
              ],
            },
          });

          console.log("EditorJS initialized");
        }, 300);
      } catch (error) {
        console.error("Failed to initialize EditorJS:", error);
        // Fallback to textarea if EditorJS fails to load
        setEditorContent(
          "EditorJS failed to load. Please use this textarea instead."
        );
      }
    };

    loadEditor();

    // Cleanup function
    return () => {
      if (editorInstanceRef.current && editorInstanceRef.current.destroy) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      let finalContent = editorContent;

      if (editorInstanceRef.current) {
        const outputData = await editorInstanceRef.current.save();
        finalContent = JSON.stringify(outputData);
      }

      console.log("Submitting Priority DM:", {
        serviceId,
        content: finalContent,
        files: selectedFiles,
      });

      setEditorContent("");
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error("Error saving editor content:", error);
    }
  };

  const toggleFontMenu = () => {
    setShowFontMenu(!showFontMenu);
    setShowSizeMenu(false);
  };

  const toggleSizeMenu = () => {
    setShowSizeMenu(!showSizeMenu);
    setShowFontMenu(false);
  };

  const fontStyles = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
  ];
  const fontSizes = ["small", "medium", "large", "x-large"];

  const applyFontStyle = (font: string) => {
    setFontStyle(font);
    setShowFontMenu(false);
  };

  const applyFontSize = (size: string) => {
    setFontSize(size);
    setShowSizeMenu(false);
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
          {/* Font styling toolbar */}
          <div className="flex items-center gap-1 p-2 border-b">
            {/* Font Family Dropdown */}
            <div className="relative overflow-visible">
              <button
                onClick={toggleFontMenu}
                className="flex items-center w-40 px-2 py-1 text-sm border rounded hover:bg-gray-100"
              >
                <div className="flex justify-between items-center w-full">
                  <span>{fontStyle}</span>
                  <ChevronDown size={16} className="ml-1" />
                </div>
              </button>
              {showFontMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-50">
                  {fontStyles.map((font) => (
                    <button
                      key={font}
                      onClick={() => applyFontStyle(font)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {font}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Font Size Dropdown */}
            <div className="relative">
              <button
                onClick={toggleSizeMenu}
                className="flex items-center px-2 py-1 text-sm border rounded hover:bg-gray-100"
              >
                {fontSize} <ChevronDown size={16} className="ml-1" />
              </button>
              {showSizeMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-50">
                  {fontSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => applyFontSize(size)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Editor Area */}
          <div className="p-4">
            <div
              ref={editorRef}
              className="min-h-64 border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                minHeight: "250px",
                fontFamily: fontStyle,
                fontSize:
                  fontSize === "small"
                    ? "14px"
                    : fontSize === "medium"
                    ? "16px"
                    : fontSize === "large"
                    ? "18px"
                    : "20px",
              }}
            ></div>
          </div>

          {/* File Upload Area */}
          <div className="p-4 border-t">
            <p className="mb-2 font-medium">Additional Attachments</p>
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
              <label className="cursor-pointer px-3 py-1.5 bg-black text-white hover:bg-gray-500 rounded text-sm">
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
          <Button className="bg-black text-white" onClick={handleSubmit}>
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriorityDMModal;
