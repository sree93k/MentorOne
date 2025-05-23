// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { CheckCircle2, ShieldX } from "lucide-react";
// import { motion } from "framer-motion";

// interface RejectionReasonProps {
//   setLogoutModalOpen: (open: boolean) => void;
//   loggingOut: boolean;
//   handleLogout: () => Promise<void>;
// }

// const RejectionReasonModal: React.FC<RejectionReasonProps> = ({
//   setLogoutModalOpen,
//   loggingOut,
//   handleLogout,
// }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ duration: 0.3, ease: "easeOut" }}
//       className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
//     >
//       <Card className="max-w-md w-full mx-4 shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
//         <CardHeader className="text-center">
//           <div className="flex justify-center mb-4">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
//             >
//               <ShieldX className="h-16 w-16 text-green-500" />
//             </motion.div>
//           </div>
//           <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
//             The Request is Rejected. Please Check Reason And Apply Again.
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-gray-600 dark:text-gray-300 text-center">
//             {reason}
//           </p>
//         </CardContent>
//         <CardFooter className="flex justify-between items-center">
//           <Button
//             variant="outline"
//             onClick={() => setLogoutModalOpen(true)}
//             disabled={loggingOut}
//             className="rounded-full px-6 bg-blue-600 text-white hover:bg-blue-700"
//           >
//             {loggingOut ? "Logging out..." : "Logout"}
//           </Button>
//           <Button
//             variant="outline"
//             className="rounded-full px-6 bg-white text-black hover:bg-black hover:text-white"
//           >
//             Next
//           </Button>
//         </CardFooter>
//       </Card>
//     </motion.div>
//   );
// };

// export default RejectionReasonModal;
