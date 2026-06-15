import { asyncHandler } from "../config/asynchandler";
import { apiError, apiResponse } from "../config/apiResponse";
import { initiateEsewa, verifyEsewa } from "../providers/esewa";
import { initiateKhalti, verifyKhalti } from "../providers/khalti";
import axios from "axios";

const updateBooking = async (bookingId: string, success: boolean) => {
  await axios.post(`${process.env.BOOKING_SERVICE_URL}/payment-update`, {
    bookingId,
    success
  });
};

const getHotelId = async (bookingId: string) => {
  const res = await axios.get(`${process.env.BOOKING_SERVICE_URL}/hotel-id/${bookingId}`);
  return res.data.data.hotelId;
};

export const initiatePayment = asyncHandler(async (req: any, res: any) => {
  const { bookingId, amount, method, hotelId } = req.body;

  if (!bookingId || !amount || !method || !hotelId) {
    return apiError(res, 400, "bookingId, amount, method and hotelId are required");
  }

  try {
    if (method === "ESEWA") {
      const result = await initiateEsewa(bookingId, amount, hotelId);
      return apiResponse(res, 200, true, "eSewa payment initiated", result);
    }

    if (method === "KHALTI") {
      const result = await initiateKhalti(bookingId, amount, hotelId);
      return apiResponse(res, 200, true, "Khalti payment initiated", result);
    }

    return apiError(res, 400, "Invalid payment method");
  } catch (err: any) {
    return apiError(res, 500, err.message || "Payment initiation failed");
  }
});

export const esewaCallback = asyncHandler(async (req: any, res: any) => {
  const { data } = req.query;
  if (!data) return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);

  try {
    const decoded = JSON.parse(Buffer.from(data as string, "base64").toString("utf8"));
    const hotelId = await getHotelId(decoded.transaction_uuid);
    const { success, bookingId } = await verifyEsewa(data as string, hotelId);
    await updateBooking(bookingId, success);

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-${success ? "success" : "failure"}?bookingId=${bookingId}`
    );
  } catch {
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  }
});

export const khaltiCallback = asyncHandler(async (req: any, res: any) => {
  const { pidx, purchase_order_id } = req.query;
  if (!pidx || !purchase_order_id) return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);

  try {
    const hotelId = await getHotelId(purchase_order_id as string);
    const { success } = await verifyKhalti(pidx as string, hotelId);
    await updateBooking(purchase_order_id as string, success);

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-${success ? "success" : "failure"}?bookingId=${purchase_order_id}`
    );
  } catch {
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  }
});