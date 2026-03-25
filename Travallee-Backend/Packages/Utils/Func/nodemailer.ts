import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendEmail = async (to: string, subject?: string, html?: string): Promise<any> => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject || 'Welcome to Travallee!',
      html: html || '<p>Thank you for joining Travallee. We are excited to have you on board!</p>',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Nodemailer error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send email');
  }
};

export { sendEmail };