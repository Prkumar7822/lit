import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { API_URL_VerifyOTP, AUTH_TOKEN } from '../ApiEndPoints/Constants';

export const verifyOtp = async (mobileNumber: string, otp: string) => {
  try {
    const response = await axios.post(
        API_URL_VerifyOTP,
      { mobileNumber, otp },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('OTP verification failed');
  }
};

export const storeToken = async (token: string) => {
  await Keychain.setGenericPassword('authToken', token);
};
