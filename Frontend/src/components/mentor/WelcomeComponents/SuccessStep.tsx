import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface SuccessStepProps {
  setLogoutModalOpen: (open: boolean) => void;
  loggingOut: boolean;
  handleLogout: () => Promise<void>;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
  setLogoutModalOpen,
  loggingOut,
  handleLogout,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <Card className="max-w-md w-full mx-4 shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            >
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </motion.div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Thanks for Applying as a Mentor!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            We will review your application and get back to you within 24 hours.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Please wait for approval
          </span>
          <Button
            variant="outline"
            onClick={() => setLogoutModalOpen(true)}
            disabled={loggingOut}
            className="rounded-full px-6 bg-blue-600 text-white hover:bg-blue-700"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SuccessStep;
