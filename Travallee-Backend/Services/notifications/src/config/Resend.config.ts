import { Resend } from "resend";

interface EmailResponse {
  id: string;
  from: string;
  to: string;
  created_at: string;
}

const sendEmail = async (
  to: string,
  subject?: string,
  html?: string,
  options?: { name?: string },
): Promise<EmailResponse> => {
  try {
    if (!to) {
      throw new Error("Recipient email is required");
    }

    if (!process.env.RESEND_API) {
      throw new Error("RESEND_API environment variable is not set");
    }

    const resend = new Resend(process.env.RESEND_API);
    const emailSubject = subject || "Welcome to Travallee!";

    const response = await resend.emails.send({
      from: "kcprabin9.com.np <noreply@kcprabin9.com.np>",
      to,
      subject: emailSubject,
      html: html || `<p>Hello ${options?.name || "User"},</p>`,
    });

    if (response.error) {
      console.error(`[ Email Error] Failed to send: ${response.error.message}`);
      throw new Error(response.error.message);
    }

    return response.data as EmailResponse;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send email";
    throw new Error(errorMessage);
  }
};

export { sendEmail };
