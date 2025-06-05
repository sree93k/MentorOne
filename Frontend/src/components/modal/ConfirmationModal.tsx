import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  description = "This action cannot be undone. Do you really want to proceed?",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 rounded-2xl p-0 bg-white shadow-2xl overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-6 pt-8 pb-4">
          <DialogHeader className="text-center space-y-4">
            {/* Icon with animated background */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
                <div className="relative bg-white rounded-full p-3 shadow-lg border-2 border-blue-100">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
                {title}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
                {description}
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {/* Footer with improved spacing and styling */}
        <DialogFooter className="px-6 pb-6 pt-4 bg-gray-50/50">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => {
                onCancel?.();
                onOpenChange(false);
              }}
              className="flex-1 h-12 font-medium border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="flex-1 h-12 font-medium bg-blue-500 hover:bg-blue-600 shadow-sm transition-all duration-200"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
