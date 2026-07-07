/// <reference types="node" />
import * as crypto from "crypto";
import axios from "axios";

const getHotelServiceHeaders = () => {
  const token = process.env.INTERNAL_SERVICE_TOKEN;
  if (!token) {
    throw new Error("INTERNAL_SERVICE_TOKEN environment variable is not set");
  }
  const headers = {
    "x-internal-service-token": token,
  };
  console.log("🔐 Hotel Service Headers:", headers);
  return headers;
};

export const initiateEsewa = async (bookingId: string, amount: number, hotelId: string) => {
  try {
    console.log("Fetching payment credentials for hotelId:", hotelId);
    const hotelServiceUrl = `${process.env.HOTEL_SERVICE_URL}/payment-credentials/${hotelId}`;
    console.log("📍 Calling hotel service:", hotelServiceUrl);
    const hotelRes = await axios.get(hotelServiceUrl, {
      headers: getHotelServiceHeaders(),
    });
    
    if (!hotelRes.data || !hotelRes.data.data) {
      throw new Error("Invalid response from hotel service");
    }
    
    const { esewa_Merchantid } = hotelRes.data.data;
    console.log("Fetched eSewa Merchant ID:", esewa_Merchantid);

    if (!esewa_Merchantid) {
      throw new Error("eSewa Merchant ID not found for this hotel");
    }

    if (!process.env.ESEWA_SECRET_KEY) {
      throw new Error("ESEWA_SECRET_KEY environment variable is not set");
    }

    const baseUrl = process.env.PUBLIC_PAYMENT_SERVICE_URL || process.env.PAYMENT_SERVICE_URL;
    const successUrl = `https://developer.esewa.com.np/success`;
    const failureUrl = `https://developer.esewa.com.np/failure`;

    console.log("\n===== ESEWA INITIATION CONFIG =====");
    console.log({
      ESEWA_BASE_URL: process.env.ESEWA_BASE_URL,
      PUBLIC_PAYMENT_SERVICE_URL: process.env.PUBLIC_PAYMENT_SERVICE_URL,
      PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL,
      successUrl,
      failureUrl,
    });

    const amountStr = String(amount);
    const transactionUuid = `${bookingId}-${Date.now()}`;
    const message = `total_amount=${amountStr},transaction_uuid=${transactionUuid},product_code=${esewa_Merchantid}`;
    const signature = crypto
      .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
      .update(message)
      .digest("base64");

    console.log("DEBUG - eSewa Signature Generation:", {
      amount: amountStr,
      bookingId,
      transactionUuid,
      esewa_Merchantid,
      secretKey: process.env.ESEWA_SECRET_KEY,
      message,
      signature,
    });
    console.log("===== END INITIATION CONFIG =====\n");

    const formFields = {
      amount: amountStr,
      tax_amount: 0,
      total_amount: amountStr,
      transaction_uuid: transactionUuid,
      product_code: esewa_Merchantid,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    };

    console.log("📤 Form Fields Being Sent to eSewa:", JSON.stringify(formFields, null, 2));

    return {
      redirectUrl: `${process.env.ESEWA_BASE_URL}/api/epay/main/v2/form`,
      formFields,
    };
  } catch (error: any) {
    console.error("eSewa initiation error:", error.message, error.response?.data);
    throw error;
  }
};

export const verifyEsewa = async (data: string, hotelId: string) => {
  try {
    console.log("Starting eSewa verification for data:", data.substring(0, 50) + "...");
    
    const hotelRes = await axios.get(`${process.env.HOTEL_SERVICE_URL}/payment-credentials/${hotelId}`, {
      headers: getHotelServiceHeaders(),
    });
    const { esewa_Merchantid } = hotelRes.data.data;

    const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
    console.log("Decoded eSewa data:", {
      transaction_uuid: decoded.transaction_uuid,
      total_amount: decoded.total_amount,
      product_code: decoded.product_code,
      status: decoded.status,
      ref_id: decoded.ref_id,
    });

    if (decoded.status === "COMPLETE") {
      console.log("eSewa marked payment as COMPLETE, skipping verification");
      return {
        success: true,
        providerRef: decoded.ref_id,
        bookingId: decoded.transaction_uuid,
      };
    }

    console.log("Verifying with eSewa backend for merchant:", esewa_Merchantid);
    const res = await axios.get(`${process.env.ESEWA_BASE_URL}/api/epay/transaction/status/`, {
      params: {
        product_code: esewa_Merchantid,
        total_amount: decoded.total_amount,
        transaction_uuid: decoded.transaction_uuid,
      },
    });

    console.log("eSewa verification response:", res.data);

    return {
      success: res.data.status === "COMPLETE",
      providerRef: decoded.ref_id || res.data.ref_id,
      bookingId: decoded.transaction_uuid,
    };
  } catch (error: any) {
    console.error("eSewa verification error:", error.message, error.response?.data);
    throw error;
  }
};