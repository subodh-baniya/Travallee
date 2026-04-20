


import type {
  WelcomeLoginParams,
  BookingConfirmationParams,
  BookingCancellationParams,
  BookingReminderParams,
  PaymentSuccessParams,
  PaymentFailedParams,
  ResetPasswordParams,
  TwoFactorAuthParams,
  DeleteAccountParams,
  CheckInReminderParams,
} from '../templates/index.js';
import {
  getWelcomeLoginTemplate,
  getBookingConfirmationTemplate,
  getBookingCancellationTemplate,
  getBookingReminderTemplate,
  getPaymentSuccessTemplate,
  getPaymentFailedTemplate,
  getResetPasswordTemplate,
  getTwoFactorAuthTemplate,
  getDeleteAccountTemplate,
  getCheckInReminderTemplate,
} from '../templates/index.js';

/**
 * Enum for all available email templates
 */
export enum EmailTemplate {
  WELCOME_LOGIN = 'WELCOME_LOGIN',
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  BOOKING_CANCELLATION = 'BOOKING_CANCELLATION',
  BOOKING_REMINDER = 'BOOKING_REMINDER',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  RESET_PASSWORD = 'RESET_PASSWORD',
  TWO_FACTOR_AUTH = 'TWO_FACTOR_AUTH',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  CHECK_IN_REMINDER = 'CHECK_IN_REMINDER',
}

/**
 * Union type for all template parameters
 */
export type TemplateParams =
  | WelcomeLoginParams
  | BookingConfirmationParams
  | BookingCancellationParams
  | BookingReminderParams
  | PaymentSuccessParams
  | PaymentFailedParams
  | ResetPasswordParams
  | TwoFactorAuthParams
  | DeleteAccountParams
  | CheckInReminderParams;

/**
 * Template metadata for logging and debugging
 */
interface TemplateMetadata {
  name: string;
  description: string;
  requiredParams: string[];
}

const TEMPLATE_METADATA: Record<EmailTemplate, TemplateMetadata> = {
  [EmailTemplate.WELCOME_LOGIN]: {
    name: 'Welcome Login',
    description: 'Welcome email sent to new users on first login',
    requiredParams: ['user_name', 'app_link'],
  },
  [EmailTemplate.BOOKING_CONFIRMATION]: {
    name: 'Booking Confirmation',
    description: 'Confirmation email sent when booking is confirmed',
    requiredParams: ['user_name', 'hotel_name', 'booking_id', 'check_in_date', 'check_out_date', 'total_price'],
  },
  [EmailTemplate.BOOKING_CANCELLATION]: {
    name: 'Booking Cancellation',
    description: 'Cancellation notification email with refund details',
    requiredParams: ['user_name', 'hotel_name', 'booking_id', 'refund_amount', 'refund_method'],
  },
  [EmailTemplate.BOOKING_REMINDER]: {
    name: 'Booking Reminder',
    description: '24-hour reminder before check-in with hotel details',
    requiredParams: ['user_name', 'hotel_name', 'booking_id', 'check_in_date'],
  },
  [EmailTemplate.PAYMENT_SUCCESS]: {
    name: 'Payment Success',
    description: 'Payment receipt and confirmation email',
    requiredParams: ['user_name', 'hotel_name', 'transaction_id', 'amount', 'payment_date'],
  },
  [EmailTemplate.PAYMENT_FAILED]: {
    name: 'Payment Failed',
    description: 'Payment failure notification with retry instructions',
    requiredParams: ['user_name', 'hotel_name', 'booking_id', 'amount', 'error_reason'],
  },
  [EmailTemplate.RESET_PASSWORD]: {
    name: 'Reset Password',
    description: 'Password reset link email',
    requiredParams: ['user_name', 'reset_link'],
  },
  [EmailTemplate.TWO_FACTOR_AUTH]: {
    name: 'Two-Factor Authentication',
    description: '2FA verification code email',
    requiredParams: ['user_name', 'otp_code'],
  },
  [EmailTemplate.DELETE_ACCOUNT]: {
    name: 'Account Deletion',
    description: 'Account deletion confirmation email',
    requiredParams: ['user_name', 'deletion_date', 'user_email'],
  },
  [EmailTemplate.CHECK_IN_REMINDER]: {
    name: 'Check-In Day Reminder',
    description: 'Day-of check-in reminder with instructions',
    requiredParams: ['user_name', 'hotel_name', 'check_in_time', 'hotel_address'],
  },
};

/**
 * TemplateRenderer class - Centralized template rendering system
 * Provides type-safe rendering with logging and validation
 */
export class TemplateRenderer {
  /**
   * Render an email template with the provided parameters
   * @param template - The template enum to render
   * @param params - Template parameters object
   * @returns Rendered HTML string with all variables interpolated
   * @throws Error if required parameters are missing
   */
  static render(template: EmailTemplate, params: TemplateParams): string {
    console.log(`[📧 Template] Rendering ${TEMPLATE_METADATA[template].name}...`);

    try {
      let html: string;

      switch (template) {
        case EmailTemplate.WELCOME_LOGIN:
          html = getWelcomeLoginTemplate(params as WelcomeLoginParams);
          break;

        case EmailTemplate.BOOKING_CONFIRMATION:
          html = getBookingConfirmationTemplate(params as BookingConfirmationParams);
          break;

        case EmailTemplate.BOOKING_CANCELLATION:
          html = getBookingCancellationTemplate(params as BookingCancellationParams);
          break;

        case EmailTemplate.BOOKING_REMINDER:
          html = getBookingReminderTemplate(params as BookingReminderParams);
          break;

        case EmailTemplate.PAYMENT_SUCCESS:
          html = getPaymentSuccessTemplate(params as PaymentSuccessParams);
          break;

        case EmailTemplate.PAYMENT_FAILED:
          html = getPaymentFailedTemplate(params as PaymentFailedParams);
          break;

        case EmailTemplate.RESET_PASSWORD:
          html = getResetPasswordTemplate(params as ResetPasswordParams);
          break;

        case EmailTemplate.TWO_FACTOR_AUTH:
          html = getTwoFactorAuthTemplate(params as TwoFactorAuthParams);
          break;

        case EmailTemplate.DELETE_ACCOUNT:
          html = getDeleteAccountTemplate(params as DeleteAccountParams);
          break;

        case EmailTemplate.CHECK_IN_REMINDER:
          html = getCheckInReminderTemplate(params as CheckInReminderParams);
          break;

        default:
          throw new Error(`Unknown template: ${template}`);
      }

      console.log(`[ Template] Successfully rendered ${TEMPLATE_METADATA[template].name}`);
      return html;
    } catch (error) {
      console.error(`[ Template Error] Failed to render ${TEMPLATE_METADATA[template].name}:`, error);
      throw error;
    }
  }

  /**
   * Get metadata for a template
   * @param template - The template enum
   * @returns Metadata object with name, description, and required params
   */
  static getMetadata(template: EmailTemplate): TemplateMetadata {
    return TEMPLATE_METADATA[template];
  }

  /**
   * List all available templates
   * @returns Array of template metadata
   */
  static listTemplates(): TemplateMetadata[] {
    return Object.values(TEMPLATE_METADATA);
  }

  /**
   * Validate template parameters before rendering
   * @param template - The template enum
   * @param params - Parameters to validate
   * @returns true if all required params are present, false otherwise
   */
  static validateParams(template: EmailTemplate, params: Record<string, any>): boolean {
    const metadata = TEMPLATE_METADATA[template];
    const missingParams = metadata.requiredParams.filter((param) => !params[param]);

    if (missingParams.length > 0) {
      console.warn(
        `[  Validation] Template "${metadata.name}" missing params: ${missingParams.join(', ')}`
      );
      return false;
    }

    return true;
  }
}

/**
 * Helper functions for common email scenarios
 */
export const TemplateHelper = {
  /**
   * Render welcome email for new user
   */
  renderWelcome: (userName: string, appLink: string, footerLinks: Partial<WelcomeLoginParams>) =>
    TemplateRenderer.render(EmailTemplate.WELCOME_LOGIN, {
      user_name: userName,
      app_link: appLink,
      unsubscribe_link: footerLinks.unsubscribe_link || '#',
      preferences_link: footerLinks.preferences_link || '#',
      view_online_link: footerLinks.view_online_link || '#',
    }),

  /**
   * Render booking confirmation with full details
   */
  renderBookingConfirmation: (
    userName: string,
    hotelName: string,
    bookingId: string,
    checkInDate: string,
    checkOutDate: string,
    nights: string,
    totalPrice: string,
    cardLast4: string,
    footerLinks: Partial<BookingConfirmationParams>
  ) =>
    TemplateRenderer.render(EmailTemplate.BOOKING_CONFIRMATION, {
      user_name: userName,
      hotel_name: hotelName,
      booking_id: bookingId,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      nights,
      total_price: totalPrice,
      card_last_4: cardLast4,
      booking_link: footerLinks.booking_link || '#',
      modify_link: footerLinks.modify_link || '#',
      unsubscribe_link: footerLinks.unsubscribe_link || '#',
      preferences_link: footerLinks.preferences_link || '#',
      view_online_link: footerLinks.view_online_link || '#',
    }),

  /**
   * Render OTP/2FA code email
   */
  renderTwoFactorAuth: (userName: string, otpCode: string, footerLinks: Partial<TwoFactorAuthParams>) =>
    TemplateRenderer.render(EmailTemplate.TWO_FACTOR_AUTH, {
      user_name: userName,
      otp_code: otpCode,
      security_link: footerLinks.security_link || '#',
      unsubscribe_link: footerLinks.unsubscribe_link || '#',
      preferences_link: footerLinks.preferences_link || '#',
      view_online_link: footerLinks.view_online_link || '#',
    }),

  /**
   * Render password reset email
   */
  renderPasswordReset: (userName: string, resetLink: string, footerLinks: Partial<ResetPasswordParams>) =>
    TemplateRenderer.render(EmailTemplate.RESET_PASSWORD, {
      user_name: userName,
      reset_link: resetLink,
      unsubscribe_link: footerLinks.unsubscribe_link || '#',
      preferences_link: footerLinks.preferences_link || '#',
      view_online_link: footerLinks.view_online_link || '#',
    }),

  /**
   * Render check-in day reminder with hotel details
   */
  renderCheckInReminder: (
    userName: string,
    hotelName: string,
    checkInTime: string,
    hotelAddress: string,
    roomNumber: string,
    hotelPhone: string,
    footerLinks: Partial<CheckInReminderParams>
  ) =>
    TemplateRenderer.render(EmailTemplate.CHECK_IN_REMINDER, {
      user_name: userName,
      hotel_name: hotelName,
      check_in_time: checkInTime,
      check_in_date: new Date().toLocaleDateString(),
      hotel_address: hotelAddress,
      room_number: roomNumber,
      hotel_phone: hotelPhone,
      check_out_time: '11:00 AM',
      booking_id: '#',
      total_nights: '1',
      support_phone: '+1-800-TRAVALLEE',
      unsubscribe_link: footerLinks.unsubscribe_link || '#',
      preferences_link: footerLinks.preferences_link || '#',
      view_online_link: footerLinks.view_online_link || '#',
    }),
};

/**
 * Export renderer functions for middleware/controllers
 */
export default TemplateRenderer;
