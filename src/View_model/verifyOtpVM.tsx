import { useState, useRef, useEffect,} from 'react';
 
import {TextInput,Alert} from 'react-native';
import OtpVerify from 'react-native-otp-verify';
import { verifyOtp, storeToken } from '../services/verifyOtpService';
 
 
 
export const useVerifyOtpViewModel = (mobileNumber: string,onOtpVerified: ()=>void) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [error, setError] = useState<string | null>(null);
 
 
 
 
  // Function to capture OTP automatically
  const handleOtpReceived = (otpMessage: string) => {
    const otpCode = otpMessage.match(/\d{6}/); // Extract 6-digit OTP
    if (otpCode) {
      const otpString = otpCode[0];
      setOtp(otpString.split('')); // Split OTP into individual digits
    }
  };
 
  useEffect(() => {
    OtpVerify.getOtp()
      .then(p => OtpVerify.addListener(handleOtpReceived))
      .catch(err => console.log(err));
     
 
    return () => {
      OtpVerify.removeListener();
    };
  }, []);
 
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
 
    // Move focus to the next box automatically if the text is entered
    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
 
    // Move focus to the previous box if the user deletes the character
    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
 
    setOtp(newOtp);
  };
 
  const verifyOtpHandler = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    const otpString = otp.join('');
 
    try {
      const response = await verifyOtp(mobileNumber, otpString);
 
      if (response.status === 'Success') {
        const jwtToken = response.data.session.access_token;
 
        await storeToken(jwtToken);
        setShowSuccess(true);
 
        setTimeout(() => {
          setShowSuccess(false);
          onOtpVerified();
        }, 2000);
      } else if (response.status === 'IncorrectOTP') {
        // Backend explicitly indicates incorrect OTP
        setError('Incorrect OTP. Please try again.');
      } else {
        // Handle unexpected response statuses
        setError('Failed to verify OTP. Please try again later.');
      }
    } catch (err) {
      // Catch network or other issues
      setError('Failed to verify OTP. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
 
 
 
  return {
    otp,
    loading,
    showSuccess,
    inputRefs,
    handleOtpChange,
    verifyOtpHandler,
    error
  };
};
 
 