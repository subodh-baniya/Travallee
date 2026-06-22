import axios from "axios";

export const initiateKhalti = async (bookingId: string, amount: number, hotelId: string) => {
  const hotelRes = await axios.get(`${process.env.HOTEL_SERVICE_URL}/payment-credentials/${hotelId}`);
  const { khalti_SecretKey } = hotelRes.data.data;

  if (!khalti_SecretKey) throw new Error("Hotel has not configured Khalti payment");

  const returnUrl = `${process.env.PAYMENT_SERVICE_URL}/payment/khalti/callback`;

  const res = await axios.post(
    `${process.env.KHALTI_BASE_URL}/api/v2/epayment/initiate/`,
    {
      return_url: returnUrl,
      website_url: process.env.FRONTEND_URL,
      amount: amount * 100,
      purchase_order_id: bookingId,
      purchase_order_name: `Booking ${bookingId}`,
    },
    { headers: { Authorization: `Key ${khalti_SecretKey}` } }
  );

  return {
    redirectUrl: res.data.payment_url,
    pidx: res.data.pidx,
  };
};

export const verifyKhalti = async (pidx: string, hotelId: string) => {
  const hotelRes = await axios.get(`${process.env.HOTEL_SERVICE_URL}/payment-credentials/${hotelId}`);
  const { khalti_SecretKey } = hotelRes.data.data;

  const res = await axios.post(
    `${process.env.KHALTI_BASE_URL}/api/v2/epayment/lookup/`,
    { pidx },
    { headers: { Authorization: `Key ${khalti_SecretKey}` } }
  );

  return {
    success: res.data.status === "Completed",
    providerRef: res.data.transaction_id,
  };
};