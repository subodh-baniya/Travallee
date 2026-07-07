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


const buildAppRedirectUrl = (path: string, params: Record<string, string> = {}) => {
  const scheme = process.env.APP_DEEP_LINK_SCHEME;
  const query = new URLSearchParams(params).toString();
  const queryString = query ? `?${query}` : "";

  if (scheme) {
 
    return `${scheme}://${path}${queryString}`;
  }

  return `${process.env.FRONTEND_URL}/${path}${queryString}`;
};

export const initiatePayment = asyncHandler(async (req: any, res: any) => {
  const { bookingId, amount, method, hotelId } = req.body;

  if (!bookingId || !amount || !method || !hotelId) {
    return apiError(res, 400, "bookingId, amount, method and hotelId are required");
  }

  try {
    console.log("Payment initiation:", { bookingId, amount, method, hotelId });
    
    if (method === "ESEWA") {
      const result = await initiateEsewa(bookingId, amount, hotelId);
      console.log("eSewa initiation success:", result);
      return apiResponse(res, 200, true, "eSewa payment initiated", result);
    }

    if (method === "KHALTI") {
      const result = await initiateKhalti(bookingId, amount, hotelId);
      console.log("Khalti initiation success:", result);
      return apiResponse(res, 200, true, "Khalti payment initiated", result);
    }

    return apiError(res, 400, "Invalid payment method");
  } catch (err: any) {
    console.error("Payment initiation error:", err.message, err.response?.data);
    return apiError(res, 500, err.message || "Payment initiation failed");
  }
});


export const esewaFormPage = asyncHandler(async (req: any, res: any) => {
  const { bookingId, amount, hotelId } = req.query;

  if (!bookingId || !amount || !hotelId) {
    return res.status(400).send("Missing required parameters: bookingId, amount, hotelId");
  }

  try {
    const result = await initiateEsewa(bookingId as string, Number(amount), hotelId as string);
    const fields = result.formFields;

    const fieldInputs = Object.entries(fields)
      .map(([key, value]) => `<input type="hidden" name="${key}" value="${value}" />`)
      .join("\n      ");

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Redirecting to eSewa...</title>
  <style>
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #1a1a1a;
      color: #f0f0f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .loader {
      text-align: center;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #333;
      border-top-color: #7ED321;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    p { font-size: 14px; color: #aaa; }
  </style>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <p>Redirecting to eSewa...</p>
  </div>
  <form id="esewaForm" method="POST" action="${result.redirectUrl}">
      ${fieldInputs}
  </form>
  <script>
    document.getElementById('esewaForm').submit();
  </script>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    return res.send(html);
  } catch (err: any) {
    return res.status(500).send(`Payment initiation failed: ${err.message}`);
  }
});


export const esewaCallback = asyncHandler(async (req: any, res: any) => {
  const data = req.query.data || req.body?.data;
 
  if (!data) {
    console.error("eSewa callback: No 'data' parameter found in query or body");
    return res.redirect(buildAppRedirectUrl("payment-result", { status: "failure", reason: "no_data" }));
  }
 
  try {
    const decoded = JSON.parse(Buffer.from(data as string, "base64").toString("utf8"));
 
    const hotelId = await getHotelId(decoded.transaction_uuid);
    const { success, bookingId } = await verifyEsewa(data as string, hotelId);
 
    await updateBooking(bookingId, success);
 
    return res.redirect(
      buildAppRedirectUrl("payment-result", {
        status: success ? "success" : "failure",
        bookingId,
      })
    );
  } catch (error: any) {
    console.error("eSewa callback error:", {
      message: error.message,
      response: error.response?.data,
    });
    return res.redirect(buildAppRedirectUrl("payment-result", { status: "failure" }));
  }
});
 

export const khaltiCallback = asyncHandler(async (req: any, res: any) => {
  const { pidx, purchase_order_id } = req.query;
  if (!pidx || !purchase_order_id) {
    return res.redirect(buildAppRedirectUrl("payment-result", { status: "failure" }));
  }

  try {
    const hotelId = await getHotelId(purchase_order_id as string);
    const { success } = await verifyKhalti(pidx as string, hotelId);
    await updateBooking(purchase_order_id as string, success);

    return res.redirect(
      buildAppRedirectUrl("payment-result", {
        status: success ? "success" : "failure",
        bookingId: purchase_order_id as string,
      })
    );
  } catch {
    return res.redirect(buildAppRedirectUrl("payment-result", { status: "failure" }));
  }
});