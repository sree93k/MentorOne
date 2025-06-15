// src/components/LoadingModal.tsx
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store"; // Ensure this path is correct

const LoadingModal = () => {
  // Observe both user.loading and admin.loading
  const userLoading = useSelector((state: RootState) => state.user.loading);
  const adminLoading = useSelector((state: RootState) => state.admin.loading);

  // The modal should display if either userLoading or adminLoading is true
  const loading = userLoading || adminLoading;

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative h-20 w-20">
        {/* Outer pulsating glow - Green to Blue */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-blue-400 to-green-400 animate-pulse-stylish opacity-75 blur-md"></div>

        {/* Inner spinning circle - More prominent border and refined gradient */}
        <div
          className="absolute inset-0 rounded-full border-4 border-t-transparent border-b-transparent
                     bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600
                     animate-spin-stylish"
          style={{ animationDuration: "4.5s" }} // Set custom animation duration
        ></div>

        {/* Center subtle glow - Soft white to enhance the circular feel */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-200 via-white to-gray-200 opacity-50 blur-sm"></div>

        {/* Very inner circle - Darker background for contrast */}
        <div className="absolute inset-3 rounded-full bg-gray-900"></div>
      </div>
    </div>
  );
};

export default LoadingModal;
