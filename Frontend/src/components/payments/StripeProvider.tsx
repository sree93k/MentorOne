import React, { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise, stripeOptions, validateStripeConfig } from '@/config/stripe';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
  amount?: number;
  currency?: string;
}

export default function StripeProvider({ 
  children, 
  clientSecret,
  amount,
  currency = 'inr',
}: StripeProviderProps) {
  const stripeConfig = validateStripeConfig();

  if (!stripeConfig.valid) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Stripe Configuration Error:</strong> {stripeConfig.error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const elementsOptions = {
    ...stripeOptions,
    ...(clientSecret && {
      clientSecret,
    }),
    ...(amount && {
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency: currency.toLowerCase(),
    }),
  };

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      {children}
    </Elements>
  );
}