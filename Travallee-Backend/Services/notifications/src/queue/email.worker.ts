//@ts-ignore
import { Worker, Job } from 'bullmq';
import { sendEmail } from '../config/Resend.config.js';
import { getWelcomeLoginTemplate } from "../templates/index.js";
import { getTwoFactorAuthTemplate } from '../templates/index.js';

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
}

interface BookingConfirmationJobData {
  email: string;
  userName: string;
  bookingId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string;
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
      const { Name, otp , email } = job.data;
      const appLink = process.env.APP_LINK || "https://kcprabin9.com.np";
      await sendEmail(email, "Your OTP Code for Travallee", getTwoFactorAuthTemplate({
        user_name: Name,
        otp_code: otp.toString(),
        security_link: `${appLink}/security`,
        unsubscribe_link: `${appLink}/unsubscribe`,
        preferences_link: `${appLink}/preferences`,
        view_online_link: `${appLink}/view-online`
      }));
    } catch (error: any) {
      console.error(`Error sending OTP email:`, error);
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
    // Implement booking confirmation email sending logic here
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



export {
  registerEmailWorker,
  otpEmailWorker,
  bookingConfirmationWorker,
  bookingCancellationWorker,
  paymentSuccessWorker,
  paymentFailedWorker
};

