import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  FileText,
  ChevronDown,
} from "lucide-react";
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
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = () => {
    // Log content and files (replace with API call to send message)
    console.log("Submitting Priority DM:", {
      serviceId,
      content: editorContent,
      files: selectedFiles,
    });
    setEditorContent("");
    setSelectedFiles([]);
    onClose();
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

  const applyFormat = (format: string) => {
    if (format === "bold") setIsBold(!isBold);
    if (format === "italic") setIsItalic(!isItalic);
    if (format === "underline") setIsUnderline(!isUnderline);
    // Update editor content with formatting
    if (editorRef.current) {
      document.execCommand(format, false, undefined);
    }
  };

  const applyFontStyle = (font: string) => {
    setFontStyle(font);
    setShowFontMenu(false);
    // Update editor font (not fully supported in contentEditable)
    if (editorRef.current) {
      editorRef.current.style.fontFamily = font;
    }
  };

  const applyFontSize = (size: string) => {
    setFontSize(size);
    setShowSizeMenu(false);
    // Update editor font size
    if (editorRef.current) {
      editorRef.current.style.fontSize =
        size === "small"
          ? "14px"
          : size === "medium"
          ? "16px"
          : size === "large"
          ? "18px"
          : "20px";
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
    }
  };

  // Focus editor when modal opens
  useEffect(() => {
    if (isOpen && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader>
          <DialogTitle>
            {title} ({productType})
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {/* Toolbar */}
          <div className="flex items-center gap-1 p-2 border-b overflow-x-auto">
            {/* Font Family Dropdown */}
            <div className="relative">
              <button
                onClick={toggleFontMenu}
                className="flex items-center px-2 py-1 text-sm border rounded hover:bg-gray-100"
              >
                {fontStyle} <ChevronDown size={16} className="ml-1" />
              </button>
              {showFontMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10">
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
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10">
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

            <div className="h-6 w-px mx-1 bg-gray-300"></div>

            {/* Text Formatting */}
            <button
              onClick={() => applyFormat("bold")}
              className={`p-1.5 rounded ${
                isBold ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <Bold size={18} />
            </button>
            <button
              onClick={() => applyFormat("italic")}
              className={`p-1.5 rounded ${
                isItalic ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <Italic size={18} />
            </button>
            <button
              onClick={() => applyFormat("underline")}
              className={`p-1.5 rounded ${
                isUnderline ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <Underline size={18} />
            </button>

            <div className="h-6 w-px mx-1 bg-gray-300"></div>

            {/* Lists */}
            <button
              onClick={() => applyFormat("insertUnorderedList")}
              className="p-1.5 rounded hover:bg-gray-100"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => applyFormat("insertOrderedList")}
              className="p-1.5 rounded hover:bg-gray-100"
            >
              <ListOrdered size={18} />
            </button>
          </div>

          {/* Editor Area */}
          <div className="p-4">
            <div
              ref={editorRef}
              className="min-h-64 border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              contentEditable={true}
              onInput={handleContentChange}
              style={{
                fontFamily: fontStyle,
                fontSize:
                  fontSize === "small"
                    ? "14px"
                    : fontSize === "medium"
                    ? "16px"
                    : fontSize === "large"
                    ? "18px"
                    : "20px",
                fontWeight: isBold ? "bold" : "normal",
                fontStyle: isItalic ? "italic" : "normal",
                textDecoration: isUnderline ? "underline" : "none",
              }}
            >
              Type your message here...
            </div>
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
