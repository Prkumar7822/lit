
import { useState } from 'react';
import { requestOtp } from '../services/sendOtpService'; // Ensure this service handles the OTP API call
import axios, { AxiosError } from 'axios';

export const useLoginViewModel = () => {
  const [mobile, setMobile] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateMobileNumber = (number: string): boolean => {
    const regex = /^\+91\d{10}$/; // Indian phone number validation
    return regex.test(number);
  };

  const handleGetMagicCode = async (navigation: any) => {
    if (!validateMobileNumber(mobile)) {
      setIsValid(false);
      setErrorMessage('Invalid mobile number. Please correct it and try again.');
      return;
    }

    setIsValid(true);
    setErrorMessage(''); // Reset error message if the mobile is valid
    try {
      await requestOtp(mobile); // Send OTP API call
      setOtpSent(true); // Mark OTP as sent
      setTimeout(() => {
        // Navigate to OTP verification page after 2 seconds
        navigation.navigate('VerifyOtpPage', { mobileNumber: mobile });
      }, 1000);
    } catch (error) {
      // Handle specific error cases
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          setErrorMessage('Unable to send the code. Please try again later.');
        } else if (error.request) {
          setErrorMessage('Network error. Please check your connection.');
        } else {
          setErrorMessage('An unknown error occurred. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      setOtpSent(false); // Reset OTP sent state on error
    }
  };

  // Retry function
  const handleRetry = async (navigation: any) => {
    setErrorMessage(''); // Clear any previous error messages
    setOtpSent(false); // Reset OTP sent state
    await handleGetMagicCode(navigation); // Retry the OTP request
  };

  return {
    mobile,
    isValid,
    otpSent,
    errorMessage,
    setMobile,
    setIsValid,
    setErrorMessage,
    validateMobileNumber,
    handleGetMagicCode,
    handleRetry, // Return handleRetry function
  };
};
