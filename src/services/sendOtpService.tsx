
import axios from 'axios';
import { API_URL_RequestOTP, AUTH_TOKEN } from '../ApiEndPoints/Constants';

export const requestOtp = async (mobileNumber: string) => {
  try {
    const response = await axios.post(
      API_URL_RequestOTP,
      { mobileNumber },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
