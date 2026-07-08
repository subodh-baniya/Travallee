import cron from 'node-cron';
import { bookingModel } from '../../model/Booking.model.js';
import axios from 'axios';

export const startBookingExpiryCron = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    let staleBookings;
    try {
      staleBookings = await bookingModel.find({
        status: "PENDING",
        bookingPayment: "NOTPAID",
        expiresAt: { $lte: now },
      });
    } catch (error: any) {
      console.error("Booking expiry sweep failed to query:", error?.message || error);
      return;
    }

    for (const booking of staleBookings) {
      try {
        const updated = await bookingModel.findOneAndUpdate(
          { _id: booking._id, status: "PENDING", bookingPayment: "NOTPAID" },
          { status: "CANCELLED" },
          { new: true }
        );

        if (!updated) continue; 

        console.log(`Booking ${updated._id} expired (no payment within 30 min) — cancelled`);

        try {
          await axios.post(`${process.env.HOTEL_SERVICE_URL}/booking-history`, {
            bookingId: String(updated._id),
            hotelId: String(updated.hotel),
            status: "CANCELLED",
            bookingPayment: "NOTPAID",
          });
        } catch (syncError: any) {
          console.error(
            `Failed to sync expired booking ${updated._id} with Hotel service:`,
            syncError?.message || syncError
          );
        }
      } catch (error: any) {
        console.error(`Failed to expire booking ${booking._id}:`, error?.message || error);
      }
    }
  });

};