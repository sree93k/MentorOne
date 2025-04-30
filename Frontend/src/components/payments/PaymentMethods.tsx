import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentMethodsProps = {
  selected: "card" | "gpay" | "amazon" | "upi";
  onSelect: (method: "card" | "gpay" | "amazon" | "upi") => void;
};

const PaymentMethods = ({ selected, onSelect }: PaymentMethodsProps) => {
  const methods = [
    {
      id: "card",
      name: "Card",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: "gpay",
      name: "Google Pay",
      icon: (
        <img
          src="https://www.google.com/images/branding/googlepay/2x/googlepay_icon_48.png"
          alt="Google Pay"
          className="h-5 w-5"
        />
      ),
    },
    {
      id: "amazon",
      name: "Amazon Pay",
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_Pay_logo.svg/1200px-Amazon_Pay_logo.svg.png"
          alt="Amazon Pay"
          className="h-5 w-5"
        />
      ),
    },
    {
      id: "upi",
      name: "UPI",
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Logo_of_Unified_Payments_Interface.svg/1200px-Logo_of_Unified_Payments_Interface.svg.png"
          alt="UPI"
          className="h-5 w-5"
        />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id as any)}
          className={cn(
            "flex flex-col items-center justify-center p-4 border rounded-md transition-all hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
            selected === method.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
          )}
          disabled
        >
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 mb-2",
              selected === method.id ? "text-blue-600" : "text-gray-600"
            )}
          >
            {method.icon}
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              selected === method.id ? "text-blue-600" : "text-gray-700"
            )}
          >
            {method.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default PaymentMethods;
