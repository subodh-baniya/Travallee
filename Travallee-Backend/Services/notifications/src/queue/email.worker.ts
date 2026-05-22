//@ts-ignore
import { Worker, Job } from 'bullmq';
import { sendEmail } from '../config/Resend.config.js';
import { getWelcomeLoginTemplate } from "../templates/index.js";
import { getTwoFactorAuthTemplate } from '../templates/index.js';
import { getBookingConfirmationTemplate } from '../templates/index.js';
import { getHotelRegistrationTemplate } from '../templates/index.js';

const connection = {
  host: process.env.REDIS_HOST as string,
  port: Number(process.env.REDIS_PORT)
}

interface RegisterEmailJobData {
  userName: string;
  to: string;
  userId: string;
}

interface OTPEmailJobData {
  Name: string;
  otp: number;
  email: string;
  subject?: string;
}

interface BookingConfirmationJobData {
  email: string;
  userName: string;
  bookingId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string;
  otp?: string;
}

interface BookingCancellationJobData {
  email: string;
  userName: string;
  bookingId: string;
  hotelName: string;
}

interface PaymentSuccessJobData {
  email: string;
  userName: string;
  amount: number;
  transactionId: string;
}

interface PaymentFailedJobData {
  email: string;
  userName: string;
  amount: number;
  failureReason: string;
}

interface HotelRegistrationJobData {
  userID: string;
  hotelName: string;
  location: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
}

const registerEmailWorker = new Worker<RegisterEmailJobData>(
  "Register",
  async (job: Job<RegisterEmailJobData>) => {
    try {
      const { userName, to, userId } = job.data;
      
      console.log(`Processing email job #${job.id} for user: ${userName}`);
      
      await sendEmail(
        to,
        "Welcome to Travallee - Your Journey Begins Here!",
        getWelcomeLoginTemplate({
          user_name: userName,
          app_link: process.env.APP_LINK || "https://kcprabin9.com.np",
          unsubscribe_link: `${process.env.APP_LINK}/unsubscribe`,
          preferences_link: `${process.env.APP_LINK}/preferences`,
          view_online_link: `${process.env.APP_LINK}/view-online`
        })
      );
      
      console.log(`Email successfully sent to ${to} for user ${userName}`);
      return { 
        success: true, 
        email: to, 
        userId,
        message: "Welcome email sent successfully" 
      };
    } catch (error) {
      console.error(`Error sending welcome email:`, error);
      throw error;
    }
  },
  {
    connection,
  }
);

const otpEmailWorker = new Worker<OTPEmailJobData>(
  "OTP",
  async (job: Job<OTPEmailJobData>) => {
    try {
      const { Name, otp , email , subject } = job.data;
      console.log(`Processing OTP email job #${job.id} for user: ${Name}`);
      const appLink = process.env.APP_LINK || "https://kcprabin9.com.np";
      await sendEmail(email, subject || "Your OTP Code for Travallee", getTwoFactorAuthTemplate({
        user_name: Name,
        otp_code: otp.toString(),
        security_link: `${appLink}/security`,
        unsubscribe_link: `${appLink}/unsubscribe`,
        preferences_link: `${appLink}/preferences`,
        view_online_link: `${appLink}/view-online`
      }));
      console.log(`OTP email successfully sent to ${email} for user ${Name}`);
      
    } catch (error: any) {
      console.error(`Error sending OTP email:`, error);
      throw error;
    }
  },
  {
    connection,
  }
);

const deleteAccountOtpWorker = new Worker<OTPEmailJobData>(
  "DeleteAccountOTP",
  async (job: Job<OTPEmailJobData>) => {
    try {
      const { Name, otp , email } = job.data;
      const appLink = process.env.APP_LINK || "https://kcprabin9.com.np";
      await sendEmail(email, "Your OTP Code for Account Deletion", getTwoFactorAuthTemplate({
        user_name: Name,
        otp_code: otp.toString(),
        security_link: `${appLink}/security`,
        unsubscribe_link: `${appLink}/unsubscribe`,
        preferences_link: `${appLink}/preferences`,
        view_online_link: `${appLink}/view-online`
      }));
      console.log(`Delete Account OTP email successfully sent to ${email} for user ${Name}`); 
    } catch (error: any) {
      console.error(`Error sending Delete Account OTP email:`, error);
      throw error;
    }
  },
  {
    connection,
  }
);

const bookingConfirmationWorker = new Worker<BookingConfirmationJobData>(
  "BookingConfirmation",
  async (job: Job<BookingConfirmationJobData>) => {
    const { email, userName, bookingId, hotelName, checkInDate, checkOutDate, roomNumber, otp } = job.data;
    try {
      const appLink = process.env.APP_LINK || "https://kcprabin9.com.np";
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const oneDay = 24 * 60 * 60 * 1000;
      const nights = Math.max(1, Math.round(Math.abs((checkOut.getTime() - checkIn.getTime()) / oneDay))).toString();

      const bookingEmailHtml = getBookingConfirmationTemplate({
        user_name: userName,
        user_email: email,
        hotel_name: hotelName,
        booking_id: bookingId || "Pending",
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        room_number: roomNumber || "N/A",
        booking_otp: otp || "Not required",
        nights,
        total_price: "Will be shown in booking details",
        card_last_4: "N/A",
        booking_link: `${appLink}/bookings`,
        modify_link: `${appLink}/bookings/${bookingId || ""}`,
        unsubscribe_link: `${appLink}/unsubscribe`,
        preferences_link: `${appLink}/preferences`,
        view_online_link: `${appLink}/view-online`
      });

      await sendEmail(
        email,
        "Your Booking Confirmation - Travallee",
        bookingEmailHtml
      );

      console.log(`Booking confirmation email successfully sent to ${email}`);
    } catch (error) {
      console.error(`Error sending booking confirmation email:`, error);
      throw error;
    }
  },
  {
    connection,
  }
);

const HotelRegistrationWorker = new Worker<HotelRegistrationJobData>(
  "HotelRegistration",
  async (job: Job<HotelRegistrationJobData>) => {
    const { hotelName, location, description, contactEmail, contactPhone } = job.data;
    console.log(`Received hotel registration email job #${job.id} for hotel: ${hotelName} with contact email: ${contactEmail}`);
    console.log(`Processing hotel registration email job #${job.id} for hotel: ${hotelName} for email: ${contactEmail}`);
    try {
      await sendEmail(
        contactEmail,
        "Your Hotel Registration is Being Processed - Travallee",
        getHotelRegistrationTemplate({
          user_name: hotelName,
          hotel_name: hotelName,
          location: location,
          description: description,
          contact_email: contactEmail,
          contact_phone: contactPhone
        })
      );
      console.log(`Hotel registration email successfully sent to ${contactEmail} for hotel ${hotelName}`);
    } catch (error) {
      console.error(`Error sending hotel registration email for hotel ${hotelName} to ${contactEmail}:`, error);
      throw error;
    }
  },
  {
    connection,
  }
);  


const bookingCancellationWorker = new Worker<BookingCancellationJobData>(
  "BookingCancellation",
  async (job: Job<BookingCancellationJobData>) => {
    // Implement booking cancellation email sending logic here
  },
  {
    connection,
  }
);

const paymentSuccessWorker = new Worker<PaymentSuccessJobData>(
  "PaymentSuccess",
  async (job: Job<PaymentSuccessJobData>) => {
    // Implement payment success email sending logic here
  },
  {
    connection,
  }
);

const paymentFailedWorker = new Worker<PaymentFailedJobData>(
  "PaymentFailed",
  async (job: Job<PaymentFailedJobData>) => {
    // Implement payment failure email sending logic here
  },
  {
    connection,
  }
);  





