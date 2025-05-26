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
