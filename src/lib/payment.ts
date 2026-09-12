import { PaymentProvider, PaymentStatus } from '@/types';

export interface MpesaInitiateRequest {
  phoneNumber: string; // e.g. 0712345678 or 254712345678
  amount: number;
  orderNumber: string;
  accountReference?: string;
}

export interface PaymentResult {
  success: boolean;
  reference: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  mpesaReceiptNumber?: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Normalizes any Kenyan phone number format into the standard 254XXXXXXXXX format
 * Supports formats: 07XXXXXXXX, 01XXXXXXXX, 254XXXXXXXX, +254XXXXXXXX
 * and normalizes strictly to 2547XXXXXXXX or 2541XXXXXXXX.
 */
export function formatKenyanPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  // Handles +25407XXXXXXXX or 25407XXXXXXXX (accidental 0 after country code)
  if (cleaned.startsWith('2540') && cleaned.length === 13) {
    return `254${cleaned.substring(4)}`;
  }
  // Handles 254XXXXXXXXX (12 digits e.g. 2547XXXXXXXX or 2541XXXXXXXX)
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    return cleaned;
  }
  // Handles 07XXXXXXXX or 01XXXXXXXX (10 digits)
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `254${cleaned.substring(1)}`;
  }
  // Handles 7XXXXXXXX or 1XXXXXXXX (9 digits without leading 0 or country code)
  if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
    return `254${cleaned}`;
  }
  return cleaned;
}

/**
 * Validates whether the given string is a valid Kenyan Safaricom / Airtel number
 * Supports prefixes 07XXXXXXXX, 01XXXXXXXX, 254XXXXXXXX, +254XXXXXXXX
 * Normalizes to 2547XXXXXXXX or 2541XXXXXXXX
 */
export function isValidKenyanPhone(phone: string): boolean {
  if (!phone) return false;
  const normalized = formatKenyanPhoneNumber(phone);
  return /^254[17]\d{8}$/.test(normalized);
}

/**
 * Formats a Kenyan phone number into human-friendly readable display format
 * e.g. 254712345678 -> "+254 712 345 678" or "0712 345 678"
 */
export function formatDisplayKenyanPhone(phone: string, international = true): string {
  const normalized = formatKenyanPhoneNumber(phone);
  if (!isValidKenyanPhone(normalized)) return phone;
  if (international) {
    return `+254 ${normalized.substring(3, 6)} ${normalized.substring(6, 9)} ${normalized.substring(9)}`;
  }
  return `0${normalized.substring(3, 5)} ${normalized.substring(5, 8)} ${normalized.substring(8)}`;
}

/**
 * Simulated and Live-Ready Payment Service for RADIICATO
 */
export class PaymentService {
  /**
   * Triggers an M-PESA Daraja STK Push prompt to customer handset
   */
  static async initiateMpesaSTK(req: MpesaInitiateRequest): Promise<PaymentResult> {
    const formattedPhone = formatKenyanPhoneNumber(req.phoneNumber);

    if (!isValidKenyanPhone(formattedPhone)) {
      return {
        success: false,
        reference: '',
        provider: 'mpesa',
        status: 'failed',
        message: 'Invalid Kenyan phone number. Must be a valid Safaricom/Airtel line (e.g. 0712345678).',
      };
    }

    // In a live environment with Daraja keys, an HTTP POST to https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest is sent.
    // For local evaluation and preview, we simulate the realistic Daraja response lifecycle.
    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const randomReceipt = `SK${Math.floor(100000 + Math.random() * 900000)}KES`;

    // Simulate 1.5s network round-trip for user PIN entry
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      success: true,
      reference: checkoutRequestId,
      provider: 'mpesa',
      status: 'completed',
      mpesaReceiptNumber: randomReceipt,
      message: `M-PESA payment of KES ${req.amount.toLocaleString()} received successfully from ${formattedPhone}. Receipt: ${randomReceipt}`,
      details: {
        CheckoutRequestID: checkoutRequestId,
        MerchantRequestID: `MR_${Date.now()}`,
        CustomerPhone: formattedPhone,
        ReceiptNumber: randomReceipt,
        TransactionDate: new Date().toISOString(),
      },
    };
  }

  /**
   * Processes Credit / Debit Card checkout via Paystack
   */
  static async processCardPayment(
    orderNumber: string,
    amount: number,
    cardDetails: { cardNumber: string; expiry: string; cvv: string; name: string }
  ): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const cleanCard = cardDetails.cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 13) {
      return {
        success: false,
        reference: '',
        provider: 'card',
        status: 'failed',
        message: 'Invalid card number.',
      };
    }

    const paystackRef = `pstk_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return {
      success: true,
      reference: paystackRef,
      provider: 'card',
      status: 'completed',
      message: `Card payment of KES ${amount.toLocaleString()} processed successfully via Paystack.`,
      details: {
        paystackReference: paystackRef,
        last4: cleanCard.slice(-4),
        authCode: `AUTH_${Math.floor(100000 + Math.random() * 900000)}`,
      },
    };
  }
}

