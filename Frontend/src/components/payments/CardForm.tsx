import React from "react";
import StripeProvider from "./StripeProvider";
import StripeCardForm from "./StripeCardForm";
import { formatAmountForDisplay } from "@/config/stripe";

type CardFormProps = {
  amount?: number;
  currency?: string;
  onSubmit?: () => void;
  onSuccess?: (paymentResult: any) => void;
  onError?: (error: string) => void;
};

const CardForm = ({ 
  amount = 377, 
  currency = "INR", 
  onSubmit, 
  onSuccess, 
  onError 
}: CardFormProps) => {

  const handleSuccess = (paymentResult: any) => {
    console.log('Payment successful:', paymentResult);
    onSuccess?.(paymentResult);
    onSubmit?.();
  };

  const handleError = (error: string) => {
    console.error('Payment error:', error);
    onError?.(error);
  };

  return (
    <StripeProvider amount={amount} currency={currency.toLowerCase()}>
      <StripeCardForm
        amount={amount}
        currency={currency}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </StripeProvider>
  );
};

export default CardForm;
