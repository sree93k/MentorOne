import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { motion } from "framer-motion";

const LoadingOverlay = () => {
  const { loading } = useSelector((state: RootState) => state.user);

  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center"
    >
      <motion.div
        className="p-6 rounded-2xl bg-white flex flex-col items-center gap-4 shadow-lg"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="loader w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" />
        <p className="text-gray-700 font-medium">Loading, please wait...</p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingOverlay;
