// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { LogOut } from "lucide-react";

// interface LogoutConfirmationModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onConfirm: () => void;
//   loggingOut?: boolean;
// }

// export function LogoutConfirmationModal({
//   open,
//   onOpenChange,
//   onConfirm,
//   loggingOut = false,
// }: LogoutConfirmationModalProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md border-t-4 border-b-4 border-blue-600 rounded-lg p-0 bg-white">
//         <div className="p-6">
//           <div className="flex items-center gap-3 mb-2">
//             <LogOut className="h-8 w-8 text-blue-500" />
//             <span className="text-gray-700 font-medium">Confirm Logout</span>
//           </div>
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-left">
//               Are you sure you want to logout?
//             </DialogTitle>
//           </DialogHeader>
//         </div>
//         <DialogFooter className="flex flex-row justify-between p-4 bg-gray-50 rounded-b-lg">
//           <Button
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//             className="rounded-full px-8"
//             disabled={loggingOut}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={onConfirm}
//             disabled={loggingOut}
//             className="rounded-full px-8 bg-blue-600 hover:bg-blue-700"
//           >
//             {loggingOut ? "Logging out..." : "Confirm"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut, AlertTriangle } from "lucide-react";
import LogoImg from "@/assets/Logorebarnd2.png";
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
      <DialogContent className="sm:max-w-md border-0 rounded-2xl p-0 bg-gradient-to-br from-white to-gray-50 shadow-2xl overflow-hidden">
        {/* Animated gradient header */}
        <div className="relative h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse" />

        <div className="p-6">
          {/* Icon with animated background */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" />
              <div className="relative bg-white p-4 rounded-full border-2 border-green-100">
                {/* <LogOut className="h-8 w-8 text-red-500" /> */}
                <img
                  src={LogoImg}
                  alt="Mentor ONE Logo"
                  className="w-20 h-20 filter "
                />
              </div>
            </div>
          </div>

          <DialogHeader className="text-center space-y-4">
            <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
              Sign Out
            </DialogTitle>
            <div className="space-y-2">
              <p className="text-gray-600 text-md leading-relaxed">
                Are you sure you want to sign out of your account?
              </p>
            </div>
          </DialogHeader>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 p-6 bg-gray-50/50 backdrop-blur-sm border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-12 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-white transition-all duration-200 font-medium text-gray-700 shadow-sm hover:shadow-md"
            disabled={loggingOut}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loggingOut}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r  from-blue-600 to-purple-600 hover:from-red-300 hover:to-red-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
          >
            {loggingOut ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing out...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
