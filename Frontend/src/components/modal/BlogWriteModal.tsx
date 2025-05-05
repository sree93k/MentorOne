import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Attaches from "@editorjs/attaches";

interface PriorityDMModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  title: string;
  productType: string;
}

const BlogWriteModal = ({
  isOpen,
  onClose,
  serviceId,
  title,
  productType,
}: PriorityDMModalProps) => {
  const [editorContent, setEditorContent] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const editorRef = useRef<EditorJS | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Editor.js
  useEffect(() => {
    if (isOpen && editorContainerRef.current && !editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "editorjs",
        tools: {
          header: {
            class: Header,
            inlineToolbar: ["link"],
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3],
              defaultLevel: 1,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          attaches: {
            class: Attaches,
            config: {
              uploader: {
                // Mock file upload (replace with S3 upload in production)
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
        placeholder: "Type your message here...",
        onChange: async () => {
          if (editorRef.current) {
            const outputData = await editorRef.current.save();
            setEditorContent(outputData);
          }
        },
      });
    }

    // Cleanup Editor.js on unmount
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      const outputData = editorContent || (await editorRef.current?.save());
      console.log("Submitting Priority DM:", {
        serviceId,
        content: outputData,
        files: selectedFiles,
      });
      setEditorContent(null);
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error("Error saving editor content:", error);
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
          {/* Editor Area */}
          <div className="p-4 border rounded-md">
            <div
              id="editorjs"
              ref={editorContainerRef}
              className="min-h-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Send Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlogWriteModal;
