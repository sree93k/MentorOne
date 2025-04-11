import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const SuccessStep: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold mb-4">
        Thanks for applying as a mentor!
      </h2>
      <p>
        We will review your application and get back to you within 5-10 working
        days.
      </p>
    </div>
  );
};

export default SuccessStep;
