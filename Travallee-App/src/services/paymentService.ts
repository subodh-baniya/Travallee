import * as WebBrowser from 'expo-web-browser';
import { API_URL } from '../constants/env';

export const openKhaltiPayment = async (redirectUrl: string) => {
  try {
    const result = await WebBrowser.openBrowserAsync(redirectUrl);
    return result;
  } catch (error) {
    console.error('Failed to open Khalti payment', error);
    throw error;
  }
};

export const openEsewaPayment = async (bookingId: string, amount: string, hotelId: string) => {
  try {

    const formUrl = `${API_URL}:8002/api/v1/payment/esewa/form?bookingId=${bookingId}&amount=${amount}&hotelId=${hotelId}`;
    const result = await WebBrowser.openBrowserAsync(formUrl);
    return result;
  } catch (error) {
    console.error('Failed to open eSewa payment', error);
    throw error;
  }
};
