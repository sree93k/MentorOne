"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loggingOut?: boolean;
}

export function LogoutConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  loggingOut = false,
}: LogoutConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-t-4 border-b-4 border-blue-600 rounded-lg p-0 bg-white">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <LogOut className="h-8 w-8 text-blue-500" />
            <span className="text-gray-700 font-medium">Confirm Logout</span>
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-left">
              Are you sure you want to logout?
            </DialogTitle>
          </DialogHeader>
        </div>
        <DialogFooter className="flex flex-row justify-between p-4 bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-8"
            disabled={loggingOut}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loggingOut}
            className="rounded-full px-8 bg-blue-600 hover:bg-blue-700"
          >
            {loggingOut ? "Logging out..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
