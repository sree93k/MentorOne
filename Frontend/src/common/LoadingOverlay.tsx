import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { motion } from "framer-motion";

const LoadingOverlay = () => {
  // Observe both user.loading and admin.loading, as per your Redux store structure
  const userLoading = useSelector((state: RootState) => state.user.loading);
  const adminLoading = useSelector((state: RootState) => state.admin.loading);

  // The overlay should display if either userLoading or adminLoading is true
  const loading = userLoading || adminLoading;

  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} // Added exit animation for smoother disappearance
      transition={{ duration: 0.3 }}
      // Lightest possible overlay background: very subtle white with backdrop blur
      className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center"
    >
      <motion.div
        // Light, airy background for the loader container
        className="p-8 rounded-full bg-white/90 shadow-xl flex items-center justify-center border border-blue-100" // More padding, fully rounded, subtle border
        initial={{ scale: 0.7, opacity: 0 }} // Start smaller and faded
        animate={{ scale: 1, opacity: 1 }} // Grow to full size
        transition={{ duration: 0.4, type: "spring", stiffness: 200 }} // Spring animation for a bouncier feel
      >
        <div className="relative w-20 h-20">
          {/* Main spinning gradient ring - Green to Blue */}
          {/* We use a hidden element to define the gradient for border-colors */}
          <div className="hidden bg-gradient-to-r from-green-400 to-blue-400" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-solid border-transparent"
            style={{
              // Use the gradient colors for the border parts
              borderTopColor: "rgb(74, 222, 128)", // Tailwind green-400
              borderRightColor: "rgb(96, 165, 250)", // Tailwind blue-400
              borderBottomColor: "rgb(74, 222, 128)", // Tailwind green-400
              borderLeftColor: "rgb(96, 165, 250)", // Tailwind blue-400
            }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 1.2, // Spin speed
            }}
          >
            {/* Inner gradient for a subtle glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-300 to-blue-300 opacity-70"></div>
          </motion.div>

          {/* Inner circle - same light background as the container for seamless blend */}
          <div className="absolute inset-2 rounded-full bg-white shadow-inner"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingOverlay;
