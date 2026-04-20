/**
 * Email Template Functions
 * All templates use {{variable}} syntax for interpolation
 */

// Type definitions for template parameters
export interface WelcomeLoginParams {
  user_name: string;
  app_link: string;
  unsubscribe_link: string;
  preferences_link: string;
  view_online_link: string;
}

export interface BookingConfirmationParams {
  user_name: string;
  hotel_name: string;
  booking_id: string;
  check_in_date: string;
  check_out_date: string;
  nights: string;
  total_price: string;
  card_last_4: string;
  booking_link: string;
  modify_link: string;
  unsubscribe_link: string;
  preferences_link: string;
  view_online_link: string;
}

export interface BookingCancellationParams {
  user_name: string;
  hotel_name: string;
  booking_id: string;
  check_in_date: string;
  cancellation_date: string;
  refund_status: string;
  refund_amount: string;
  refund_method: string;
  feedback_link: string;
  browse_link: string;
  unsubscribe_link: string;
  preferences_link: string;
  view_online_link: string;
}

export interface BookingReminderParams {
  user_name: string;
  hotel_name: string;
  booking_id: string;
  check_in_date: string;
  room_number: string;
  hotel_phone: string;
  booking_link: string;
  unsubscribe_link: string;
  preferences_link: string;
  view_online_link: string;
}

export interface PaymentSuccessParams {
  user_name: string;
  hotel_name: string;
  transaction_id: string;
  amount: string;
  payment_method: string;
  payment_date: string;
  user_email: string;
  booking_link: string;
  support_link: string;
  unsubscribe_link: string;
  preferences_link: string;
  view_online_link: string;
}

export interface PaymentFailedParams {
  user_name: string;
  hotel_name: string;
  booking_id: string;
  amount: string;
  error_reason: string;
  expiry_hours: string;
  retry_payment_link: string;
  support_link: string;
  unsubscribe_link: string;
  preferences_link: string;
  view_online_link: string;
}

export interface ResetPasswordParams {
  user_name: string;
  reset_link: string;
  unsubscribe_link: string;
  preferences_link: string;
  view_online_link: string;
}

export interface TwoFactorAuthParams {
  user_name: string;
  otp_code: string;
  security_link: string;
  unsubscribe_link: string;
  preferences_link: string;
  view_online_link: string;
}

export interface DeleteAccountParams {
  user_name: string;
  deletion_date: string;
  user_email: string;
  unsubscribe_link: string;
  preferences_link: string;
  view_online_link: string;
}

export interface CheckInReminderParams {
  user_name: string;
  hotel_name: string;
  check_in_time: string;
  check_in_date: string;
  hotel_address: string;
  room_number: string;
  hotel_phone: string;
  check_out_time: string;
  booking_id: string;
  total_nights: string;
  support_phone: string;
  unsubscribe_link: string;
  preferences_link: string;
  view_online_link: string;
}


function interpolateTemplate(html: string, params: Record<string, string>): string {
  let result = html;
  for (const [key, value] of Object.entries(params)) {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), value || '');
  }
  return result;
}

/**
 * Welcome/Login Template
 */
export function getWelcomeLoginTemplate(params: WelcomeLoginParams): string {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Travallee</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #0f0f0f; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; }
        .header { background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; margin-bottom: 10px; }
        .tagline { font-size: 14px; color: rgba(255,255,255,0.8); }
        .banner { width: 100%; height: 300px; background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #888; border-bottom: 2px solid #e040fb; }
        .content { padding: 40px 30px; }
        .content h2 { font-size: 26px; color: #fff; margin-bottom: 15px; }
        .content p { color: #b0b0b0; margin-bottom: 15px; font-size: 15px; }
        .highlight { color: #e040fb; font-weight: 600; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 30px 0; font-size: 15px; }
        .cta-button:hover { opacity: 0.9; }
        .features { background-color: #252525; padding: 25px; border-radius: 6px; margin: 30px 0; }
        .feature-item { margin-bottom: 15px; padding-left: 20px; position: relative; }
        .feature-item::before { content: "✓"; position: absolute; left: 0; color: #e040fb; font-weight: bold; }
        .feature-item:last-child { margin-bottom: 0; }
        .footer-section { background-color: #252525; padding: 30px; text-align: center; border-top: 2px solid #333; }
        .footer-links { margin-bottom: 20px; }
        .footer-links a { color: #e040fb; text-decoration: none; margin: 0 10px; font-size: 13px; }
        .footer-links a:hover { text-decoration: underline; }
        .social-icons { margin: 20px 0; }
        .social-icons a { display: inline-block; width: 40px; height: 40px; background-color: #333; border-radius: 50%; line-height: 40px; text-align: center; margin: 0 8px; color: #e040fb; text-decoration: none; font-size: 18px; }
        .social-icons a:hover { background-color: #e040fb; color: #1a1a1a; }
        .address { color: #888; font-size: 12px; margin: 20px 0; }
        .copyright { color: #666; font-size: 12px; margin-top: 15px; }
        .divider { height: 1px; background-color: #333; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Travallee</div>
            <div class="tagline">Your Journey Awaits</div>
        </div>
        <div class="banner">[Header Image - 600x300px]</div>
        <div class="content">
            <h2>Welcome to Travallee, {{user_name}}! 🎉</h2>
            <p>We're thrilled to have you join our community of modern travelers. Get ready to discover, book, and experience amazing hotels around the world.</p>
            <div class="features">
                <div class="feature-item">Instant booking confirmation and real-time updates</div>
                <div class="feature-item">24/7 customer support for peace of mind</div>
                <div class="feature-item">Exclusive deals and early access to new properties</div>
                <div class="feature-item">Earn rewards on every booking</div>
            </div>
            <p>Your account is now active and ready to explore. Dive into our handpicked collection of hotels and create unforgettable memories.</p>
            <center>
                <a href="{{app_link}}" class="cta-button">Start Exploring</a>
            </center>
            <p style="font-size: 14px; color: #888; margin-top: 20px;">Questions? We're here to help. Reply to this email or contact our support team.</p>
        </div>
        <div class="divider"></div>
        <div class="footer-section">
            <div class="footer-links">
                <a href="{{unsubscribe_link}}">Unsubscribe</a> | 
                <a href="{{preferences_link}}">Preferences</a> | 
                <a href="{{view_online_link}}">View Online</a>
            </div>
            <div class="social-icons">
                <a href="https://facebook.com/travallee" title="Facebook">f</a>
                <a href="https://instagram.com/travallee" title="Instagram">📷</a>
                <a href="https://twitter.com/travallee" title="Twitter">𝕏</a>
                <a href="https://tiktok.com/@travallee" title="TikTok">♪</a>
                <a href="https://youtube.com/travallee" title="YouTube">▶</a>
            </div>
            <div class="address">
                [YOUR ADDRESS HERE]<br>
                Phone: [YOUR PHONE]<br>
                Email: support@travallee.com
            </div>
            <div class="copyright">
                © 2025 Travallee. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
  return interpolateTemplate(html, params as unknown as Record<string, string>);
}

/**
 * Booking Confirmation Template
 */
export function getBookingConfirmationTemplate(params: BookingConfirmationParams): string {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmed</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #0f0f0f; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; }
        .header { background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; margin-bottom: 10px; }
        .tagline { font-size: 14px; color: rgba(255,255,255,0.8); }
        .banner { width: 100%; height: 300px; background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #888; border-bottom: 2px solid #e040fb; }
        .content { padding: 40px 30px; }
        .content h2 { font-size: 26px; color: #fff; margin-bottom: 15px; }
        .success-badge { display: inline-block; background-color: #1db954; color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .booking-card { background-color: #252525; border-left: 4px solid #e040fb; padding: 20px; margin: 25px 0; border-radius: 6px; }
        .booking-row { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #333; }
        .booking-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .booking-label { color: #888; font-size: 13px; }
        .booking-value { color: #e040fb; font-weight: 600; font-size: 14px; }
        .content p { color: #b0b0b0; margin-bottom: 15px; font-size: 15px; }
        .highlight { color: #e040fb; font-weight: 600; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 30px 0; font-size: 15px; }
        .cta-button:hover { opacity: 0.9; }
        .info-box { background-color: #2a2a2a; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #b0b0b0; }
        .footer-section { background-color: #252525; padding: 30px; text-align: center; border-top: 2px solid #333; }
        .footer-links { margin-bottom: 20px; }
        .footer-links a { color: #e040fb; text-decoration: none; margin: 0 10px; font-size: 13px; }
        .footer-links a:hover { text-decoration: underline; }
        .social-icons { margin: 20px 0; }
        .social-icons a { display: inline-block; width: 40px; height: 40px; background-color: #333; border-radius: 50%; line-height: 40px; text-align: center; margin: 0 8px; color: #e040fb; text-decoration: none; font-size: 18px; }
        .social-icons a:hover { background-color: #e040fb; color: #1a1a1a; }
        .address { color: #888; font-size: 12px; margin: 20px 0; }
        .copyright { color: #666; font-size: 12px; margin-top: 15px; }
        .divider { height: 1px; background-color: #333; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Travallee</div>
            <div class="tagline">Your Journey Awaits</div>
        </div>
        <div class="banner">[Hotel Image - 600x300px]</div>
        <div class="content">
            <div class="success-badge">✓ BOOKING CONFIRMED</div>
            <h2>Your Booking is Confirmed!</h2>
            <p>Hi {{user_name}},</p>
            <p>Great news! Your booking at <span class="highlight">{{hotel_name}}</span> has been confirmed. We're excited for your upcoming stay!</p>
            <div class="booking-card">
                <div class="booking-row">
                    <span class="booking-label">Booking ID</span>
                    <span class="booking-value">{{booking_id}}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Hotel</span>
                    <span class="booking-value">{{hotel_name}}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Check-in</span>
                    <span class="booking-value">{{check_in_date}}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Check-out</span>
                    <span class="booking-value">{{check_out_date}}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Duration</span>
                    <span class="booking-value">{{nights}} Night(s)</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Total Price</span>
                    <span class="booking-value">{{total_price}}</span>
                </div>
            </div>
            <p><span class="highlight">✓ Payment received</span> - Your credit card ending in {{card_last_4}} has been charged.</p>
            <div class="info-box">
                <strong>Check-in Instructions:</strong><br>
                Please arrive by 3:00 PM on your check-in date. Early check-in may be available upon request. Check your email for specific instructions closer to your arrival.
            </div>
            <center>
                <a href="{{booking_link}}" class="cta-button">View Booking Details</a>
            </center>
            <p style="font-size: 14px; color: #888;">Need to modify your booking? <a href="{{modify_link}}" style="color: #e040fb;">Click here to reschedule or make changes.</a></p>
        </div>
        <div class="divider"></div>
        <div class="footer-section">
            <div class="footer-links">
                <a href="{{unsubscribe_link}}">Unsubscribe</a> | 
                <a href="{{preferences_link}}">Preferences</a> | 
                <a href="{{view_online_link}}">View Online</a>
            </div>
            <div class="social-icons">
                <a href="https://facebook.com/travallee" title="Facebook">f</a>
                <a href="https://instagram.com/travallee" title="Instagram">📷</a>
                <a href="https://twitter.com/travallee" title="Twitter">𝕏</a>
                <a href="https://tiktok.com/@travallee" title="TikTok">♪</a>
                <a href="https://youtube.com/travallee" title="YouTube">▶</a>
            </div>
            <div class="address">
                [YOUR ADDRESS HERE]<br>
                Phone: [YOUR PHONE]<br>
                Email: support@travallee.com
            </div>
            <div class="copyright">
                © 2025 Travallee. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
  return interpolateTemplate(html, params as unknown as Record<string, string>);
}

/**
 * Booking Cancellation Template
 */
export function getBookingCancellationTemplate(params: BookingCancellationParams): string {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Cancelled</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #0f0f0f; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; }
        .header { background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; margin-bottom: 10px; }
        .tagline { font-size: 14px; color: rgba(255,255,255,0.8); }
        .banner { width: 100%; height: 300px; background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #888; border-bottom: 2px solid #e040fb; }
        .content { padding: 40px 30px; }
        .content h2 { font-size: 26px; color: #fff; margin-bottom: 15px; }
        .cancel-badge { display: inline-block; background-color: #ff6b6b; color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .booking-card { background-color: #252525; border-left: 4px solid #ff6b6b; padding: 20px; margin: 25px 0; border-radius: 6px; }
        .booking-row { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #333; }
        .booking-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .booking-label { color: #888; font-size: 13px; }
        .booking-value { color: #ff6b6b; font-weight: 600; font-size: 14px; }
        .content p { color: #b0b0b0; margin-bottom: 15px; font-size: 15px; }
        .highlight { color: #e040fb; font-weight: 600; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 30px 0; font-size: 15px; }
        .cta-button:hover { opacity: 0.9; }
        .info-box { background-color: #2a2a2a; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #b0b0b0; }
        .refund-info { background-color: rgba(29, 185, 84, 0.1); border-left: 4px solid #1db954; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #b0b0b0; }
        .footer-section { background-color: #252525; padding: 30px; text-align: center; border-top: 2px solid #333; }
        .footer-links { margin-bottom: 20px; }
        .footer-links a { color: #e040fb; text-decoration: none; margin: 0 10px; font-size: 13px; }
        .footer-links a:hover { text-decoration: underline; }
        .social-icons { margin: 20px 0; }
        .social-icons a { display: inline-block; width: 40px; height: 40px; background-color: #333; border-radius: 50%; line-height: 40px; text-align: center; margin: 0 8px; color: #e040fb; text-decoration: none; font-size: 18px; }
        .social-icons a:hover { background-color: #e040fb; color: #1a1a1a; }
        .address { color: #888; font-size: 12px; margin: 20px 0; }
        .copyright { color: #666; font-size: 12px; margin-top: 15px; }
        .divider { height: 1px; background-color: #333; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Travallee</div>
            <div class="tagline">Your Journey Awaits</div>
        </div>
        <div class="banner">[Banner Image - 600x300px]</div>
        <div class="content">
            <div class="cancel-badge">✕ BOOKING CANCELLED</div>
            <h2>Your Booking Has Been Cancelled</h2>
            <p>Hi {{user_name}},</p>
            <p>We've processed the cancellation of your booking at <span class="highlight">{{hotel_name}}</span>. We're sorry to see you go!</p>
            <div class="booking-card">
                <div class="booking-row">
                    <span class="booking-label">Booking ID</span>
                    <span class="booking-value">{{booking_id}}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Hotel</span>
                    <span class="booking-value">{{hotel_name}}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Original Check-in</span>
                    <span class="booking-value">{{check_in_date}}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Cancellation Date</span>
                    <span class="booking-value">{{cancellation_date}}</span>
                </div>
            </div>
            <div class="refund-info">
                <strong>Refund Status: {{refund_status}}</strong><br>
                Your refund of {{refund_amount}} will be processed to {{refund_method}} within 5-7 business days.
            </div>
            <div class="info-box">
                <strong>Why did you cancel?</strong><br>
                Your feedback helps us serve you better. <a href="{{feedback_link}}" style="color: #e040fb;">Share your feedback here.</a>
            </div>
            <p>Looking to rebook? We have amazing properties waiting for your next adventure!</p>
            <center>
                <a href="{{browse_link}}" class="cta-button">Browse Hotels</a>
            </center>
            <p style="font-size: 14px; color: #888;">Need help? Contact our support team at support@travallee.com</p>
        </div>
        <div class="divider"></div>
        <div class="footer-section">
            <div class="footer-links">
                <a href="{{unsubscribe_link}}">Unsubscribe</a> | 
                <a href="{{preferences_link}}">Preferences</a> | 
                <a href="{{view_online_link}}">View Online</a>
            </div>
            <div class="social-icons">
                <a href="https://facebook.com/travallee" title="Facebook">f</a>
                <a href="https://instagram.com/travallee" title="Instagram">📷</a>
                <a href="https://twitter.com/travallee" title="Twitter">𝕏</a>
                <a href="https://tiktok.com/@travallee" title="TikTok">♪</a>
                <a href="https://youtube.com/travallee" title="YouTube">▶</a>
            </div>
            <div class="address">
                [YOUR ADDRESS HERE]<br>
                Phone: [YOUR PHONE]<br>
                Email: support@travallee.com
            </div>
            <div class="copyright">
                © 2025 Travallee. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
  return interpolateTemplate(html, params as unknown as Record<string, string>);
}

/**
 * Booking Reminder (24 hours before check-in) Template
 */
export function getBookingReminderTemplate(params: BookingReminderParams): string {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Reminder</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #0f0f0f; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; }
        .header { background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; margin-bottom: 10px; }
        .tagline { font-size: 14px; color: rgba(255,255,255,0.8); }
        .banner { width: 100%; height: 300px; background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #888; border-bottom: 2px solid #e040fb; }
        .content { padding: 40px 30px; }
        .content h2 { font-size: 26px; color: #fff; margin-bottom: 15px; }
        .countdown-badge { display: inline-block; background-color: #ffa500; color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .booking-card { background-color: #252525; border-left: 4px solid #ffa500; padding: 20px; margin: 25px 0; border-radius: 6px; }
        .booking-row { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #333; }
        .booking-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .booking-label { color: #888; font-size: 13px; }
        .booking-value { color: #ffa500; font-weight: 600; font-size: 14px; }
        .content p { color: #b0b0b0; margin-bottom: 15px; font-size: 15px; }
        .highlight { color: #e040fb; font-weight: 600; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 30px 0; font-size: 15px; }
        .cta-button:hover { opacity: 0.9; }
        .tips-box { background-color: #252525; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .tips-box strong { color: #e040fb; }
        .footer-section { background-color: #252525; padding: 30px; text-align: center; border-top: 2px solid #333; }
        .footer-links { margin-bottom: 20px; }
        .footer-links a { color: #e040fb; text-decoration: none; margin: 0 10px; font-size: 13px; }
        .footer-links a:hover { text-decoration: underline; }
        .social-icons { margin: 20px 0; }
        .social-icons a { display: inline-block; width: 40px; height: 40px; background-color: #333; border-radius: 50%; line-height: 40px; text-align: center; margin: 0 8px; color: #e040fb; text-decoration: none; font-size: 18px; }
        .social-icons a:hover { background-color: #e040fb; color: #1a1a1a; }
        .address { color: #888; font-size: 12px; margin: 20px 0; }
        .copyright { color: #666; font-size: 12px; margin-top: 15px; }
        .divider { height: 1px; background-color: #333; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Travallee</div>
            <div class="tagline">Your Journey Awaits</div>
        </div>
        <div class="banner">[Hotel Image - 600x300px]</div>
        <div class="content">
            <div class="countdown-badge">⏰ CHECK-IN IN 24 HOURS</div>
            <h2>Your Stay at {{hotel_name}} Starts Tomorrow!</h2>
            <p>Hi {{user_name}},</p>
            <p>Your check-in is coming up! Here are the details for your upcoming stay.</p>
            <div class="booking-card">
                <div class="booking-row">
                    <span class="booking-label">Booking ID</span>
                    <span class="booking-value">{{booking_id}}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Hotel</span>
                    <span class="booking-value">{{hotel_name}}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Check-in Date</span>
                    <span class="booking-value">{{check_in_date}}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Check-in Time</span>
                    <span class="booking-value">3:00 PM</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Room Number</span>
                    <span class="booking-value">{{room_number}}</span>
                </div>
            </div>
            <div class="tips-box">
                <strong>📋 Before You Arrive:</strong><br>
                • Keep your booking confirmation ready<br>
                • Bring a valid ID<br>
                • Contact the hotel if you need early check-in<br>
                • Review house rules on the app
            </div>
            <center>
                <a href="{{booking_link}}" class="cta-button">View Check-in Details</a>
            </center>
            <p style="font-size: 14px; color: #888;">Have questions? Message the hotel directly from your booking or call {{hotel_phone}}</p>
        </div>
        <div class="divider"></div>
        <div class="footer-section">
            <div class="footer-links">
                <a href="{{unsubscribe_link}}">Unsubscribe</a> | 
                <a href="{{preferences_link}}">Preferences</a> | 
                <a href="{{view_online_link}}">View Online</a>
            </div>
            <div class="social-icons">
                <a href="https://facebook.com/travallee" title="Facebook">f</a>
                <a href="https://instagram.com/travallee" title="Instagram">📷</a>
                <a href="https://twitter.com/travallee" title="Twitter">𝕏</a>
                <a href="https://tiktok.com/@travallee" title="TikTok">♪</a>
                <a href="https://youtube.com/travallee" title="YouTube">▶</a>
            </div>
            <div class="address">
                [YOUR ADDRESS HERE]<br>
                Phone: [YOUR PHONE]<br>
                Email: support@travallee.com
            </div>
            <div class="copyright">
                © 2025 Travallee. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
  return interpolateTemplate(html, params as unknown as Record<string, string>);
}

/**
 * Payment Success Template
 */
export function getPaymentSuccessTemplate(params: PaymentSuccessParams): string {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #0f0f0f; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; }
        .header { background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; margin-bottom: 10px; }
        .tagline { font-size: 14px; color: rgba(255,255,255,0.8); }
        .banner { width: 100%; height: 300px; background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #888; border-bottom: 2px solid #e040fb; }
        .content { padding: 40px 30px; }
        .content h2 { font-size: 26px; color: #fff; margin-bottom: 15px; }
        .success-badge { display: inline-block; background-color: #1db954; color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .payment-card { background-color: #252525; border-left: 4px solid #1db954; padding: 20px; margin: 25px 0; border-radius: 6px; }
        .payment-row { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #333; }
        .payment-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .payment-label { color: #888; font-size: 13px; }
        .payment-value { color: #1db954; font-weight: 600; font-size: 14px; }
        .content p { color: #b0b0b0; margin-bottom: 15px; font-size: 15px; }
        .highlight { color: #e040fb; font-weight: 600; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 30px 0; font-size: 15px; }
        .cta-button:hover { opacity: 0.9; }
        .receipt-box { background-color: #2a2a2a; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #b0b0b0; }
        .footer-section { background-color: #252525; padding: 30px; text-align: center; border-top: 2px solid #333; }
        .footer-links { margin-bottom: 20px; }
        .footer-links a { color: #e040fb; text-decoration: none; margin: 0 10px; font-size: 13px; }
        .footer-links a:hover { text-decoration: underline; }
        .social-icons { margin: 20px 0; }
        .social-icons a { display: inline-block; width: 40px; height: 40px; background-color: #333; border-radius: 50%; line-height: 40px; text-align: center; margin: 0 8px; color: #e040fb; text-decoration: none; font-size: 18px; }
        .social-icons a:hover { background-color: #e040fb; color: #1a1a1a; }
        .address { color: #888; font-size: 12px; margin: 20px 0; }
        .copyright { color: #666; font-size: 12px; margin-top: 15px; }
        .divider { height: 1px; background-color: #333; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Travallee</div>
            <div class="tagline">Your Journey Awaits</div>
        </div>
        <div class="banner">[Payment Success Image - 600x300px]</div>
        <div class="content">
            <div class="success-badge">✓ PAYMENT RECEIVED</div>
            <h2>Payment Successful!</h2>
            <p>Hi {{user_name}},</p>
            <p>Thank you! We've successfully received your payment for {{hotel_name}}. Your booking is confirmed.</p>
            <div class="payment-card">
                <div class="payment-row">
                    <span class="payment-label">Transaction ID</span>
                    <span class="payment-value">{{transaction_id}}</span>
                </div>
                <div class="payment-row">
                    <span class="payment-label">Amount</span>
                    <span class="payment-value">{{amount}}</span>
                </div>
                <div class="payment-row">
                    <span class="payment-label">Payment Method</span>
                    <span class="payment-value">{{payment_method}}</span>
                </div>
                <div class="payment-row">
                    <span class="payment-label">Date</span>
                    <span class="payment-value">{{payment_date}}</span>
                </div>
            </div>
            <div class="receipt-box">
                <strong>📧 Receipt:</strong><br>
                A detailed receipt has been sent to {{user_email}}. Keep it safe for your records.
            </div>
            <p>You're all set! Your booking confirmation details have been sent to your email. Start packing and get ready for an amazing experience at {{hotel_name}}.</p>
            <center>
                <a href="{{booking_link}}" class="cta-button">View Booking</a>
            </center>
            <p style="font-size: 14px; color: #888;">Questions about your payment? <a href="{{support_link}}" style="color: #e040fb;">Contact support</a></p>
        </div>
        <div class="divider"></div>
        <div class="footer-section">
            <div class="footer-links">
                <a href="{{unsubscribe_link}}">Unsubscribe</a> | 
                <a href="{{preferences_link}}">Preferences</a> | 
                <a href="{{view_online_link}}">View Online</a>
            </div>
            <div class="social-icons">
                <a href="https://facebook.com/travallee" title="Facebook">f</a>
                <a href="https://instagram.com/travallee" title="Instagram">📷</a>
                <a href="https://twitter.com/travallee" title="Twitter">𝕏</a>
                <a href="https://tiktok.com/@travallee" title="TikTok">♪</a>
                <a href="https://youtube.com/travallee" title="YouTube">▶</a>
            </div>
            <div class="address">
                [YOUR ADDRESS HERE]<br>
                Phone: [YOUR PHONE]<br>
                Email: support@travallee.com
            </div>
            <div class="copyright">
                © 2025 Travallee. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
  return interpolateTemplate(html, params as unknown as Record<string, string>);
}

/**
 * Payment Failed Template
 */
export function getPaymentFailedTemplate(params: PaymentFailedParams): string {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #0f0f0f; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; }
        .header { background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; margin-bottom: 10px; }
        .tagline { font-size: 14px; color: rgba(255,255,255,0.8); }
        .banner { width: 100%; height: 300px; background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #888; border-bottom: 2px solid #e040fb; }
        .content { padding: 40px 30px; }
        .content h2 { font-size: 26px; color: #fff; margin-bottom: 15px; }
        .error-badge { display: inline-block; background-color: #ff6b6b; color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .error-card { background-color: #252525; border-left: 4px solid #ff6b6b; padding: 20px; margin: 25px 0; border-radius: 6px; }
        .error-row { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #333; }
        .error-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .error-label { color: #888; font-size: 13px; }
        .error-value { color: #ff6b6b; font-weight: 600; font-size: 14px; }
        .content p { color: #b0b0b0; margin-bottom: 15px; font-size: 15px; }
        .highlight { color: #e040fb; font-weight: 600; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 30px 0; font-size: 15px; }
        .cta-button:hover { opacity: 0.9; }
        .reasons-box { background-color: #2a2a2a; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #b0b0b0; }
        .reasons-box strong { color: #ff6b6b; }
        .footer-section { background-color: #252525; padding: 30px; text-align: center; border-top: 2px solid #333; }
        .footer-links { margin-bottom: 20px; }
        .footer-links a { color: #e040fb; text-decoration: none; margin: 0 10px; font-size: 13px; }
        .footer-links a:hover { text-decoration: underline; }
        .social-icons { margin: 20px 0; }
        .social-icons a { display: inline-block; width: 40px; height: 40px; background-color: #333; border-radius: 50%; line-height: 40px; text-align: center; margin: 0 8px; color: #e040fb; text-decoration: none; font-size: 18px; }
        .social-icons a:hover { background-color: #e040fb; color: #1a1a1a; }
        .address { color: #888; font-size: 12px; margin: 20px 0; }
        .copyright { color: #666; font-size: 12px; margin-top: 15px; }
        .divider { height: 1px; background-color: #333; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Travallee</div>
            <div class="tagline">Your Journey Awaits</div>
        </div>
        <div class="banner">[Error Image - 600x300px]</div>
        <div class="content">
            <div class="error-badge">✕ PAYMENT FAILED</div>
            <h2>Payment Could Not Be Processed</h2>
            <p>Hi {{user_name}},</p>
            <p>Unfortunately, your payment for {{hotel_name}} could not be processed. Your booking is on hold until we receive a valid payment.</p>
            <div class="error-card">
                <div class="error-row">
                    <span class="error-label">Booking ID</span>
                    <span class="error-value">{{booking_id}}</span>
                </div>
                <div class="error-row">
                    <span class="error-label">Amount</span>
                    <span class="error-value">{{amount}}</span>
                </div>
                <div class="error-row">
                    <span class="error-label">Error Reason</span>
                    <span class="error-value">{{error_reason}}</span>
                </div>
                <div class="error-row">
                    <span class="error-label">Expiry Window</span>
                    <span class="error-value">{{expiry_hours}} hours</span>
                </div>
            </div>
            <div class="reasons-box">
                <strong>Why did this happen?</strong><br>
                • Insufficient funds<br>
                • Card expired or invalid<br>
                • Incorrect billing address<br>
                • Issuer declined the transaction
            </div>
            <p>Don't worry, your booking will be available for {{expiry_hours}} hours. Please try a different payment method or contact your bank.</p>
            <center>
                <a href="{{retry_payment_link}}" class="cta-button">Retry Payment</a>
            </center>
            <p style="font-size: 14px; color: #888;">Still having issues? Our support team is ready to help. <a href="{{support_link}}" style="color: #e040fb;">Contact us</a></p>
        </div>
        <div class="divider"></div>
        <div class="footer-section">
            <div class="footer-links">
                <a href="{{unsubscribe_link}}">Unsubscribe</a> | 
                <a href="{{preferences_link}}">Preferences</a> | 
                <a href="{{view_online_link}}">View Online</a>
            </div>
            <div class="social-icons">
                <a href="https://facebook.com/travallee" title="Facebook">f</a>
                <a href="https://instagram.com/travallee" title="Instagram">📷</a>
                <a href="https://twitter.com/travallee" title="Twitter">𝕏</a>
                <a href="https://tiktok.com/@travallee" title="TikTok">♪</a>
                <a href="https://youtube.com/travallee" title="YouTube">▶</a>
            </div>
            <div class="address">
                [YOUR ADDRESS HERE]<br>
                Phone: [YOUR PHONE]<br>
                Email: support@travallee.com
            </div>
            <div class="copyright">
                © 2025 Travallee. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
  return interpolateTemplate(html, params as unknown as Record<string, string>);
}

/**
 * Reset Password Template
 */
export function getResetPasswordTemplate(params: ResetPasswordParams): string {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #0f0f0f; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; }
        .header { background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; margin-bottom: 10px; }
        .tagline { font-size: 14px; color: rgba(255,255,255,0.8); }
        .banner { width: 100%; height: 300px; background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #888; border-bottom: 2px solid #e040fb; }
        .content { padding: 40px 30px; }
        .content h2 { font-size: 26px; color: #fff; margin-bottom: 15px; }
        .security-badge { display: inline-block; background-color: #4c8ff7; color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 30px 0; font-size: 15px; }
        .cta-button:hover { opacity: 0.9; }
        .content p { color: #b0b0b0; margin-bottom: 15px; font-size: 15px; }
        .highlight { color: #e040fb; font-weight: 600; }
        .warning-box { background-color: #2a2a2a; border-left: 4px solid #ffa500; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #b0b0b0; }
        .link-box { background-color: #252525; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
        .link-box p { margin-bottom: 10px; color: #888; font-size: 12px; }
        .link-box a { display: inline-block; background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
        .footer-section { background-color: #252525; padding: 30px; text-align: center; border-top: 2px solid #333; }
        .footer-links { margin-bottom: 20px; }
        .footer-links a { color: #e040fb; text-decoration: none; margin: 0 10px; font-size: 13px; }
        .footer-links a:hover { text-decoration: underline; }
        .social-icons { margin: 20px 0; }
        .social-icons a { display: inline-block; width: 40px; height: 40px; background-color: #333; border-radius: 50%; line-height: 40px; text-align: center; margin: 0 8px; color: #e040fb; text-decoration: none; font-size: 18px; }
        .social-icons a:hover { background-color: #e040fb; color: #1a1a1a; }
        .address { color: #888; font-size: 12px; margin: 20px 0; }
        .copyright { color: #666; font-size: 12px; margin-top: 15px; }
        .divider { height: 1px; background-color: #333; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Travallee</div>
            <div class="tagline">Your Journey Awaits</div>
        </div>
        <div class="banner">[Security Image - 600x300px]</div>
        <div class="content">
            <div class="security-badge">🔐 SECURE PASSWORD RESET</div>
            <h2>Reset Your Password</h2>
            <p>Hi {{user_name}},</p>
            <p>We received a request to reset your Travallee account password. Click the button below to create a new password.</p>
            <div class="link-box">
                <p>This link will expire in 1 hour</p>
                <a href="{{reset_link}}">Reset Password</a>
            </div>
            <p><strong>Or copy this link into your browser:</strong></p>
            <div style="background-color: #2a2a2a; padding: 12px; border-radius: 6px; margin: 15px 0; word-break: break-all; font-size: 12px; color: #888; font-family: monospace;">
                {{reset_link}}
            </div>
            <div class="warning-box">
                <strong>⚠️ If you didn't request this:</strong><br>
                Don't worry! Your password is still secure. If you didn't ask to reset your password, please ignore this email or let us know immediately.
            </div>
            <p style="font-size: 13px; color: #b0b0b0;"><strong>For your security:</strong><br>
            • Never share your password with anyone<br>
            • We'll never ask you to reset your password via email<br>
            • Always use the official Travallee app or website
            </p>
        </div>
        <div class="divider"></div>
        <div class="footer-section">
            <div class="footer-links">
                <a href="{{unsubscribe_link}}">Unsubscribe</a> | 
                <a href="{{preferences_link}}">Preferences</a> | 
                <a href="{{view_online_link}}">View Online</a>
            </div>
            <div class="social-icons">
                <a href="https://facebook.com/travallee" title="Facebook">f</a>
                <a href="https://instagram.com/travallee" title="Instagram">📷</a>
                <a href="https://twitter.com/travallee" title="Twitter">𝕏</a>
                <a href="https://tiktok.com/@travallee" title="TikTok">♪</a>
                <a href="https://youtube.com/travallee" title="YouTube">▶</a>
            </div>
            <div class="address">
                [YOUR ADDRESS HERE]<br>
                Phone: [YOUR PHONE]<br>
                Email: support@travallee.com
            </div>
            <div class="copyright">
                © 2025 Travallee. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
  return interpolateTemplate(html, params as unknown as Record<string, string>);
}

/**
 * Two-Factor Authentication Template
 */
export function getTwoFactorAuthTemplate(params: TwoFactorAuthParams): string {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your 2FA Code</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #0f0f0f; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; }
        .header { background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; margin-bottom: 10px; }
        .tagline { font-size: 14px; color: rgba(255,255,255,0.8); }
        .banner { width: 100%; height: 300px; background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #888; border-bottom: 2px solid #e040fb; }
        .content { padding: 40px 30px; }
        .content h2 { font-size: 26px; color: #fff; margin-bottom: 15px; }
        .security-badge { display: inline-block; background-color: #4c8ff7; color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .content p { color: #b0b0b0; margin-bottom: 15px; font-size: 15px; }
        .highlight { color: #e040fb; font-weight: 600; }
        .otp-box { background: linear-gradient(135deg, #f700ff15 0%, #d700ff15 100%); border: 2px dashed #e040fb; padding: 30px; border-radius: 6px; margin: 30px 0; text-align: center; }
        .otp-code { font-size: 48px; font-weight: 900; color: #e040fb; letter-spacing: 8px; font-family: monospace; margin: 20px 0; }
        .otp-info { color: #888; font-size: 12px; margin-top: 15px; }
        .warning-box { background-color: #2a2a2a; border-left: 4px solid #ffa500; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #b0b0b0; }
        .footer-section { background-color: #252525; padding: 30px; text-align: center; border-top: 2px solid #333; }
        .footer-links { margin-bottom: 20px; }
        .footer-links a { color: #e040fb; text-decoration: none; margin: 0 10px; font-size: 13px; }
        .footer-links a:hover { text-decoration: underline; }
        .social-icons { margin: 20px 0; }
        .social-icons a { display: inline-block; width: 40px; height: 40px; background-color: #333; border-radius: 50%; line-height: 40px; text-align: center; margin: 0 8px; color: #e040fb; text-decoration: none; font-size: 18px; }
        .social-icons a:hover { background-color: #e040fb; color: #1a1a1a; }
        .address { color: #888; font-size: 12px; margin: 20px 0; }
        .copyright { color: #666; font-size: 12px; margin-top: 15px; }
        .divider { height: 1px; background-color: #333; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Travallee</div>
            <div class="tagline">Your Journey Awaits</div>
        </div>
        <div class="banner">[Security Image - 600x300px]</div>
        <div class="content">
            <div class="security-badge">🔐 TWO-FACTOR AUTHENTICATION</div>
            <h2>Your Verification Code</h2>
            <p>Hi {{user_name}},</p>
            <p>We need to verify your identity to keep your account secure. Use the code below to complete your login.</p>
            <div class="otp-box">
                <p style="color: #888; font-size: 12px; margin-bottom: 10px;">VERIFICATION CODE</p>
                <div class="otp-code">{{otp_code}}</div>
                <div class="otp-info">
                    Valid for <span class="highlight">10 minutes</span> only
                </div>
            </div>
            <p>If you didn't try to login, <span class="highlight">ignore this email</span>. Your account is safe.</p>
            <div class="warning-box">
                <strong>⚠️ Security Tips:</strong><br>
                • Never share this code with anyone<br>
                • Travallee staff will never ask for this code<br>
                • This code expires in 10 minutes
            </div>
            <p style="font-size: 13px; color: #b0b0b0;">Didn't request this? Your account password is still secure. <a href="{{security_link}}" style="color: #e040fb;">Review your account activity.</a></p>
        </div>
        <div class="divider"></div>
        <div class="footer-section">
            <div class="footer-links">
                <a href="{{unsubscribe_link}}">Unsubscribe</a> | 
                <a href="{{preferences_link}}">Preferences</a> | 
                <a href="{{view_online_link}}">View Online</a>
            </div>
            <div class="social-icons">
                <a href="https://facebook.com/travallee" title="Facebook">f</a>
                <a href="https://instagram.com/travallee" title="Instagram">📷</a>
                <a href="https://twitter.com/travallee" title="Twitter">𝕏</a>
                <a href="https://tiktok.com/@travallee" title="TikTok">♪</a>
                <a href="https://youtube.com/travallee" title="YouTube">▶</a>
            </div>
            <div class="address">
                [YOUR ADDRESS HERE]<br>
                Phone: [YOUR PHONE]<br>
                Email: support@travallee.com
            </div>
            <div class="copyright">
                © 2025 Travallee. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
  return interpolateTemplate(html, params as unknown as Record<string, string>);
}

/**
 * Delete Account Template
 */
export function getDeleteAccountTemplate(params: DeleteAccountParams): string {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deletion Confirmation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #0f0f0f; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; }
        .header { background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; margin-bottom: 10px; }
        .tagline { font-size: 14px; color: rgba(255,255,255,0.8); }
        .banner { width: 100%; height: 300px; background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #888; border-bottom: 2px solid #e040fb; }
        .content { padding: 40px 30px; }
        .content h2 { font-size: 26px; color: #fff; margin-bottom: 15px; }
        .delete-badge { display: inline-block; background-color: #ff6b6b; color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .content p { color: #b0b0b0; margin-bottom: 15px; font-size: 15px; }
        .highlight { color: #e040fb; font-weight: 600; }
        .info-box { background-color: #2a2a2a; border-left: 4px solid #ffa500; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #b0b0b0; }
        .info-box strong { color: #ffa500; }
        .deletion-details { background-color: #252525; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #b0b0b0; }
        .deletion-row { display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #333; }
        .deletion-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .deletion-label { color: #888; }
        .deletion-value { color: #ff6b6b; }
        .footer-section { background-color: #252525; padding: 30px; text-align: center; border-top: 2px solid #333; }
        .footer-links { margin-bottom: 20px; }
        .footer-links a { color: #e040fb; text-decoration: none; margin: 0 10px; font-size: 13px; }
        .footer-links a:hover { text-decoration: underline; }
        .social-icons { margin: 20px 0; }
        .social-icons a { display: inline-block; width: 40px; height: 40px; background-color: #333; border-radius: 50%; line-height: 40px; text-align: center; margin: 0 8px; color: #e040fb; text-decoration: none; font-size: 18px; }
        .social-icons a:hover { background-color: #e040fb; color: #1a1a1a; }
        .address { color: #888; font-size: 12px; margin: 20px 0; }
        .copyright { color: #666; font-size: 12px; margin-top: 15px; }
        .divider { height: 1px; background-color: #333; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Travallee</div>
            <div class="tagline">Your Journey Awaits</div>
        </div>
        <div class="banner">[Account Image - 600x300px]</div>
        <div class="content">
            <div class="delete-badge">⚠️ ACCOUNT DELETED</div>
            <h2>Your Account Has Been Deleted</h2>
            <p>Hi {{user_name}},</p>
            <p>Your Travallee account has been successfully deleted. All your personal data has been removed from our servers.</p>
            <div class="deletion-details">
                <div class="deletion-row">
                    <span class="deletion-label">Deletion Date</span>
                    <span class="deletion-value">{{deletion_date}}</span>
                </div>
                <div class="deletion-row">
                    <span class="deletion-label">Account Email</span>
                    <span class="deletion-value">{{user_email}}</span>
                </div>
            </div>
            <div class="info-box">
                <strong>What was deleted:</strong><br>
                • Account profile and preferences<br>
                • Booking history and reservations<br>
                • Payment information<br>
                • Communication history<br>
                • Reward points and credits
            </div>
            <p><strong>Can I recover my account?</strong><br>
            No, deleted accounts cannot be restored. If you change your mind, you'll need to create a new account and start fresh.</p>
            <p style="font-size: 13px; color: #b0b0b0; margin-top: 20px;">Thank you for being part of the Travallee community. We hope to see you again in the future!<br><br>
            Questions or concerns? Contact us at support@travallee.com
            </p>
        </div>
        <div class="divider"></div>
        <div class="footer-section">
            <div class="footer-links">
                <a href="{{unsubscribe_link}}">Unsubscribe</a> | 
                <a href="{{preferences_link}}">Preferences</a> | 
                <a href="{{view_online_link}}">View Online</a>
            </div>
            <div class="social-icons">
                <a href="https://facebook.com/travallee" title="Facebook">f</a>
                <a href="https://instagram.com/travallee" title="Instagram">📷</a>
                <a href="https://twitter.com/travallee" title="Twitter">𝕏</a>
                <a href="https://tiktok.com/@travallee" title="TikTok">♪</a>
                <a href="https://youtube.com/travallee" title="YouTube">▶</a>
            </div>
            <div class="address">
                [YOUR ADDRESS HERE]<br>
                Phone: [YOUR PHONE]<br>
                Email: support@travallee.com
            </div>
            <div class="copyright">
                © 2025 Travallee. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
  return interpolateTemplate(html, params as unknown as Record<string, string>);
}

/**
 * Check-In Reminder (Day of check-in) Template
 */
export function getCheckInReminderTemplate(params: CheckInReminderParams): string {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check-In Day Reminder</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #0f0f0f; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; }
        .header { background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; margin-bottom: 10px; }
        .tagline { font-size: 14px; color: rgba(255,255,255,0.8); }
        .banner { width: 100%; height: 300px; background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #888; border-bottom: 2px solid #e040fb; }
        .content { padding: 40px 30px; }
        .content h2 { font-size: 26px; color: #fff; margin-bottom: 15px; }
        .checkin-badge { display: inline-block; background-color: #4facfe; color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .content p { color: #b0b0b0; margin-bottom: 15px; font-size: 15px; }
        .highlight { color: #e040fb; font-weight: 600; }
        .countdown { background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0; color: #fff; }
        .countdown-time { font-size: 48px; font-weight: 900; margin: 10px 0; font-family: 'Courier New', monospace; }
        .countdown-label { font-size: 13px; opacity: 0.9; }
        .hotel-card { background-color: #252525; padding: 15px; border-radius: 6px; border-left: 4px solid #4facfe; margin: 20px 0; }
        .hotel-name { font-size: 16px; color: #fff; font-weight: 600; margin-bottom: 8px; }
        .hotel-detail { display: flex; justify-content: space-between; margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px solid #333; font-size: 13px; }
        .hotel-detail:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .detail-label { color: #888; }
        .detail-value { color: #4facfe; font-weight: 500; }
        .instructions-box { background-color: #2a2a2a; border-left: 4px solid #e040fb; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .instructions-box h4 { color: #e040fb; font-size: 14px; margin-bottom: 10px; }
        .instructions-box ul { margin-left: 20px; font-size: 13px; color: #b0b0b0; }
        .instructions-box li { margin-bottom: 6px; }
        .cta-button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #e040fb 0%, #c2185b 100%); color: white; text-decoration: none; border-radius: 4px; font-weight: 600; margin: 20px 0; font-size: 15px; border: none; cursor: pointer; }
        .cta-button:hover { opacity: 0.9; }
        .info-box { background-color: #2a2a2a; border-left: 4px solid #ffa500; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #b0b0b0; }
        .info-box strong { color: #ffa500; }
        .footer-section { background-color: #252525; padding: 30px; text-align: center; border-top: 2px solid #333; }
        .footer-links { margin-bottom: 20px; }
        .footer-links a { color: #e040fb; text-decoration: none; margin: 0 10px; font-size: 13px; }
        .footer-links a:hover { text-decoration: underline; }
        .social-icons { margin: 20px 0; }
        .social-icons a { display: inline-block; width: 40px; height: 40px; background-color: #333; border-radius: 50%; line-height: 40px; text-align: center; margin: 0 8px; color: #e040fb; text-decoration: none; font-size: 18px; }
        .social-icons a:hover { background-color: #e040fb; color: #1a1a1a; }
        .address { color: #888; font-size: 12px; margin: 20px 0; }
        .copyright { color: #666; font-size: 12px; margin-top: 15px; }
        .divider { height: 1px; background-color: #333; margin: 30px 0; }
        .contact-info { display: flex; justify-content: space-around; margin: 20px 0; padding: 15px 0; border-top: 1px solid #333; border-bottom: 1px solid #333; }
        .contact-item { text-align: center; font-size: 13px; }
        .contact-label { color: #888; margin-bottom: 5px; }
        .contact-value { color: #4facfe; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Travallee</div>
            <div class="tagline">Your Journey Awaits</div>
        </div>
        <div class="banner">[Hotel Image - 600x300px]</div>
        <div class="content">
            <div class="checkin-badge">✓ CHECK-IN TODAY</div>
            <h2>Your Check-In is Today!</h2>
            <p>Hi {{user_name}},</p>
            <p>Get ready for an amazing stay! Your booking at <span class="highlight">{{hotel_name}}</span> starts today. Here's everything you need to know.</p>
            
            <div class="countdown">
                <div class="countdown-label">CHECK-IN TIME</div>
                <div class="countdown-time">{{check_in_time}}</div>
                <div class="countdown-label">Standard check-in time</div>
            </div>

            <div class="hotel-card">
                <div class="hotel-name">{{hotel_name}}</div>
                <div class="hotel-detail">
                    <span class="detail-label">📍 Address</span>
                    <span class="detail-value">{{hotel_address}}</span>
                </div>
                <div class="hotel-detail">
                    <span class="detail-label">🏨 Room Number</span>
                    <span class="detail-value">{{room_number}}</span>
                </div>
                <div class="hotel-detail">
                    <span class="detail-label">📞 Contact</span>
                    <span class="detail-value">{{hotel_phone}}</span>
                </div>
                <div class="hotel-detail">
                    <span class="detail-label">🔑 Check-Out</span>
                    <span class="detail-value">{{check_out_time}}</span>
                </div>
            </div>

            <div class="instructions-box">
                <h4>✓ Check-In Instructions</h4>
                <ul>
                    <li>Proceed to the front desk upon arrival</li>
                    <li>Have your booking reference ({{booking_id}}) ready</li>
                    <li>Provide a valid photo ID and payment method</li>
                    <li>Ask the receptionist about WiFi and amenities</li>
                    <li>Keep your room key card secure</li>
                    <li>Report any issues immediately to the front desk</li>
                </ul>
            </div>

            <div class="contact-info">
                <div class="contact-item">
                    <div class="contact-label">Booking Reference</div>
                    <div class="contact-value">{{booking_id}}</div>
                </div>
                <div class="contact-item">
                    <div class="contact-label">Total Nights</div>
                    <div class="contact-value">{{total_nights}}</div>
                </div>
            </div>

            <div class="info-box">
                <strong>💡 Need Early Check-In?</strong><br>
                Subject to availability, the hotel may accommodate early check-in. Contact them directly at {{hotel_phone}} to request early access. Early check-in may incur additional fees.
            </div>

            <p style="font-size: 13px; color: #b0b0b0; margin-top: 20px;">
                <strong>Questions or changes?</strong><br>
                Contact our support team at support@travallee.com or call {{support_phone}}. We're here to help!
            </p>
        </div>
        <div class="divider"></div>
        <div class="footer-section">
            <div class="footer-links">
                <a href="{{unsubscribe_link}}">Unsubscribe</a> | 
                <a href="{{preferences_link}}">Preferences</a> | 
                <a href="{{view_online_link}}">View Online</a>
            </div>
            <div class="social-icons">
                <a href="https://facebook.com/travallee" title="Facebook">f</a>
                <a href="https://instagram.com/travallee" title="Instagram">📷</a>
                <a href="https://twitter.com/travallee" title="Twitter">𝕏</a>
                <a href="https://tiktok.com/@travallee" title="TikTok">♪</a>
                <a href="https://youtube.com/travallee" title="YouTube">▶</a>
            </div>
            <div class="address">
                [YOUR ADDRESS HERE]<br>
                Phone: [YOUR PHONE]<br>
                Email: support@travallee.com
            </div>
            <div class="copyright">
                © 2025 Travallee. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;
  return interpolateTemplate(html, params as unknown as Record<string, string>);
}
