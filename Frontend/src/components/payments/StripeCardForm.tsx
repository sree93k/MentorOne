import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, AlertCircle } from 'lucide-react';
import { formatAmountForDisplay } from '@/config/stripe';

interface StripeCardFormProps {
  amount: number;
  currency?: string;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

const elementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#9ca3af',
      },
      padding: '12px 14px',
    },
    invalid: {
      color: '#dc2626',
      iconColor: '#dc2626',
    },
  },
};

export default function StripeCardForm({
  amount,
  currency = 'INR',
  onSuccess,
  onError,
  loading = false,
  disabled = false,
}: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not loaded properly. Please refresh the page.');
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setError('Card element not found. Please refresh the page.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          // Add billing details if available
        },
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message || 'Failed to create payment method');
        setIsProcessing(false);
        onError?.(paymentMethodError.message || 'Failed to create payment method');
        return;
      }

      // Create Payment Intent on backend
      console.log('Payment method created:', paymentMethod);
      
      // Call backend to create payment intent
      const response = await fetch(`${import.meta.env.VITE_API_URL}/seeker/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: amount,
          currency: currency.toLowerCase(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment initiation failed: ${response.statusText}`);
      }

      const paymentResult = await response.json();
      
      if (paymentResult.requiresAction) {
        // Handle 3D Secure or other required actions
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          paymentResult.clientSecret
        );

        if (confirmError) {
          setError(confirmError.message || 'Payment confirmation failed');
          onError?.(confirmError.message || 'Payment confirmation failed');
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onSuccess?.(paymentIntent);
        }
      } else if (paymentResult.success) {
        onSuccess?.(paymentResult);
      } else {
        setError(paymentResult.error || 'Payment failed');
        onError?.(paymentResult.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'An unexpected error occurred');
      onError?.(error.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardChange = (elementType: 'number' | 'expiry' | 'cvc') => (event: any) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }

    setCardComplete({
      ...cardComplete,
      [elementType]: event.complete,
    });
  };

  const isFormComplete = cardComplete.number && cardComplete.expiry && cardComplete.cvc;
  const isDisabled = disabled || loading || isProcessing || !stripe || !elements;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Number */}
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card number</Label>
        <div className="relative">
          <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <CardNumberElement
              options={elementOptions}
              onChange={handleCardChange('number')}
            />
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <img
              src="https://cdn.jsdelivr.net/gh/stripe/stripe-js@v1.54.0/assets/visa.svg"
              alt="Visa"
              className="h-5 opacity-60"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/stripe/stripe-js@v1.54.0/assets/mastercard.svg"
              alt="Mastercard"
              className="h-5 opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cardExpiry">Expiry date</Label>
          <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <CardExpiryElement
              options={elementOptions}
              onChange={handleCardChange('expiry')}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardCvc">CVC</Label>
          <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <CardCvcElement
              options={elementOptions}
              onChange={handleCardChange('cvc')}
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <Lock className="h-4 w-4 text-green-600" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isDisabled || !isFormComplete}
        className="w-full py-6 text-lg font-semibold"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <span>Pay {formatAmountForDisplay(amount, currency)}</span>
          </div>
        )}
      </Button>
    </form>
  );
}