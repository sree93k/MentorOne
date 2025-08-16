import { loadStripe } from '@stripe/stripe-js';
import environmentService from './environment';

// Initialize Stripe with publishable key from environment
const stripeConfig = environmentService.getStripeConfig();

if (!stripeConfig.publishableKey) {
  console.warn('⚠️ Stripe publishable key not found in environment configuration');
}

// Load Stripe instance
export const stripePromise = loadStripe(stripeConfig.publishableKey || '');

// Stripe configuration options
export const stripeOptions = {
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#dc2626',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Tab': {
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
      },
      '.Input': {
        backgroundColor: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '16px',
        padding: '12px',
      },
      '.Input:focus': {
        border: '1px solid #2563eb',
        boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)',
      },
      '.Label': {
        color: '#374151',
        fontSize: '14px',
        fontWeight: '500',
      },
    },
  },
  locale: 'en' as const,
};

// Payment method types configuration
export const paymentMethodTypes = [
  'card',
  'upi',
  'netbanking',
  'wallet',
] as const;

// Currency configuration
export const defaultCurrency = 'inr';

// Amount formatter for Stripe (in smallest currency unit)
export const formatAmountForStripe = (amount: number, currency: string = defaultCurrency): number => {
  // Stripe expects amounts in the smallest currency unit (paise for INR)
  return Math.round(amount * 100);
};

// Format amount for display
export const formatAmountForDisplay = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

// Validate Stripe configuration
export const validateStripeConfig = (): { valid: boolean; error?: string } => {
  if (!stripeConfig.publishableKey) {
    return {
      valid: false,
      error: 'Stripe publishable key is missing from environment configuration',
    };
  }

  if (!stripeConfig.publishableKey.startsWith('pk_')) {
    return {
      valid: false,
      error: 'Invalid Stripe publishable key format',
    };
  }

  return { valid: true };
};

export default {
  stripePromise,
  stripeOptions,
  paymentMethodTypes,
  defaultCurrency,
  formatAmountForStripe,
  formatAmountForDisplay,
  validateStripeConfig,
};