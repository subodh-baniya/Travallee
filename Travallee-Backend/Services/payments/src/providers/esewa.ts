/// <reference types="node" />
import * as crypto from "crypto";
import axios from "axios";

export const initiateEsewa = async (bookingId: string, amount: number, hotelId: string) => {
  const hotelRes = await axios.get(`${process.env.HOTEL_SERVICE_URL}/payment-credentials/${hotelId}`);
  const { esewa_Merchantid } = hotelRes.data.data;

  const successUrl = `${process.env.PAYMENT_SERVICE_URL}/payment/esewa/callback`;
  const failureUrl = `${process.env.PAYMENT_SERVICE_URL}/payment/esewa/callback`;

  const message = `total_amount=${amount},transaction_uuid=${bookingId},product_code=${esewa_Merchantid}`;
  const signature = crypto
    .createHmac("sha256", process.env.ESEWA_SECRET_KEY!)
    .update(message)
    .digest("base64");

  return {
    redirectUrl: `${process.env.ESEWA_BASE_URL}/api/epay/main/v2/form`,
    formFields: {
      amount,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid: bookingId,
      product_code: esewa_Merchantid,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    },
  };
};

export const verifyEsewa = async (data: string, hotelId: string) => {
  const hotelRes = await axios.get(`${process.env.HOTEL_SERVICE_URL}/payment-credentials/${hotelId}`);
  const { esewa_Merchantid } = hotelRes.data.data;

  const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf8"));

  const res = await axios.get(`${process.env.ESEWA_BASE_URL}/api/epay/transaction/status/`, {
    params: {
      product_code: esewa_Merchantid,
      total_amount: decoded.total_amount,
      transaction_uuid: decoded.transaction_uuid,
    },
  });

  return {
    success: res.data.status === "COMPLETE",
    providerRef: decoded.ref_id,
    bookingId: decoded.transaction_uuid,
  };
};