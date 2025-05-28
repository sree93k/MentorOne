import React from "react";
import { motion } from "framer-motion";

const gradientVariants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const AnimatedGradientCircle: React.FC = () => {
  return (
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{
        background:
          "linear-gradient(270deg, #6366F1, #8B5CF6, #EC4899, #EF4444)", // Tailwind colors: indigo, purple, pink, red
        backgroundSize: "200% 200%",
      }}
      variants={gradientVariants}
      animate="animate"
    />
  );
};

export default AnimatedGradientCircle;
