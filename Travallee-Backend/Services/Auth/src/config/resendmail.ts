import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';



const sendEmail = async (to:string, subject?: string , html?: string , env ?: string) => {
    const resend = new Resend(env);
    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: to,
        subject: subject || 'Welcome to Travallee!',
        html: html || '<p>Thank you for joining Travallee. We are excited to have you on board!</p>'
    });
    
    if (error) {
        console.error('Resend API error:', error);
        throw new Error(error.message || 'Failed to send email');
    }
    
    return data;
}
export { sendEmail };