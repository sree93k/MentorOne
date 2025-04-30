import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type CardFormProps = {
  onSubmit: () => void;
};

const CardForm = ({ onSubmit }: CardFormProps) => {
  const [showCVC, setShowCVC] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    country: "India",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
      setFormData({ ...formData, [name]: formatted });
    } else if (name === "expiryDate") {
      const cleaned = value.replace(/\s/g, "").replace(/\//g, "");
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)} / ${cleaned.slice(2, 4)}`;
      }
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Card number</Label>
          <div className="relative mt-1.5">
            <Input
              id="cardNumber"
              name="cardNumber"
              className="pr-16"
              placeholder="1234 1234 1234 1234"
              value={formData.cardNumber}
              onChange={handleInputChange}
              maxLength={19}
              disabled
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <span className="w-8">
                <img
                  src="https://cdn.visa.com/v2/assets/images/logos/visa-logo.svg"
                  alt="Visa"
                  className="w-full h-auto"
                />
              </span>
              <span className="w-8">
                <img
                  src="https://www.mastercard.com/content/dam/public/mastercardcom/sg/en/consumers/find-card-products/images/mastercard-logo-800x450.jpg"
                  alt="Mastercard"
                  className="w-full h-auto"
                />
              </span>
              <span className="w-8">
                <img
                  src="https://www.americanexpress.com/content/dam/amex/us/merchant/supplies-uplift/Product-Showcase/decal-images/images/large-files/Decal_Classic-AMEX.png"
                  alt="American Express"
                  className="w-full h-auto"
                />
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiration date</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              className="mt-1.5"
              placeholder="MM / YY"
              value={formData.expiryDate}
              onChange={handleInputChange}
              maxLength={7}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="cvc">Security code</Label>
            <div className="relative mt-1.5">
              <Input
                id="cvc"
                name="cvc"
                type={showCVC ? "text" : "password"}
                className="pr-10"
                placeholder="CVC"
                value={formData.cvc}
                onChange={handleInputChange}
                maxLength={4}
                disabled
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowCVC(!showCVC)}
                disabled
              >
                {showCVC ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Select
            defaultValue={formData.country}
            onValueChange={(value) =>
              setFormData({ ...formData, country: value })
            }
            disabled
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="USA">United States</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className={cn(
            "w-full mt-4 py-6 text-base font-medium flex items-center justify-center gap-2"
          )}
          disabled
        >
          Pay {formatPrice(377, "INR")}
        </Button>
      </div>
    </form>
  );
};

export default CardForm;
