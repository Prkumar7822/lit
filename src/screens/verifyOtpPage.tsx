import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image,ActivityIndicator,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useVerifyOtpViewModel } from '../View_model/verifyOtpVM';
import { RouteProp } from '@react-navigation/native';
import { requestOtp } from '../services/sendOtpService';
 
 
type RootStackParamList = {
  HomePage: undefined;
  VerifyOtpPage: { mobileNumber: string };
  LoginPage: undefined;
};
 
type VerifyOtpPageRouteProp = RouteProp<RootStackParamList, 'VerifyOtpPage'>;
 
const VerifyOtpPage = ({ route }: { route: VerifyOtpPageRouteProp }) => {
  const { mobileNumber } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
 
  const onOtpVerified = () => {
    navigation.navigate('HomePage');
  };
 
 
  const {
    otp,
    loading,
    showSuccess,
    inputRefs,
    handleOtpChange,
    verifyOtpHandler,
    error
  } = useVerifyOtpViewModel(mobileNumber, onOtpVerified);
 
  const handleResendOtp = async () => {
    try {
      await requestOtp(mobileNumber); // Call the OTP request service
      Alert.alert('Resend OTP', 'OTP has been resent to your phone number.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };
 
  const handleChangePhoneNumber = () => {
    navigation.navigate('LoginPage');
  };
 
 
    return (
    <View style={styles.container}>
     
      <Text style={styles.mainHeading}>Litz Chill</Text>
 
     
      <View style={styles.imageContainer}>
        <Image source={require('../assests/images/img.png')} style={styles.image} />
      </View>
 
     
      <View style={styles.subHeadingContainer}>
        <Text style={styles.subHeading}>It's Code Time!</Text>
      </View>
      <View style={styles.subHeadingContainer}>
        <Text style={styles.subHeading}>Look Out for Your SMS! ⏳</Text>
      </View>
 
     
      <View style={styles.smallHeadingContainer}>
        <Text style={styles.smallHeading}>Enter the 6-digit code we sent to</Text>
        <Text style={styles.smallHeading}>{mobileNumber}</Text>
      </View>
 
     
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            maxLength={1}
            keyboardType="number-pad"
            ref={(ref) => inputRefs.current[index] = ref}
          />
        ))}
      </View>
 
 
     
      <View style={styles.linksContainer}>
        <Text style={styles.normalText}>Didn't get it?</Text>
        <TouchableOpacity style={styles.resendLink} onPress={handleResendOtp}>
          <Text style={styles.linkText}>Resend code</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginLeft: 165, marginTop: 10 }}>
        <TouchableOpacity onPress={handleChangePhoneNumber}>
          <Text style={styles.linkText}>Use Different Phone Number</Text>
        </TouchableOpacity>
      </View>
 
     
     
      {showSuccess && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>OTP Verified Successfully!</Text>
        </View>
      )}
   
    {error && <Text style={styles.errorText}>{error}</Text>}
     
<TouchableOpacity style={styles.button} onPress={verifyOtpHandler} disabled={loading}>
  {loading ? (
    <ActivityIndicator size="small" color="#FFFFFF" />
  ) : (
    <Text style={styles.buttonText}>Verify & Continue</Text>
  )}
</TouchableOpacity>
 
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
  },
  mainHeading: {
    fontFamily: 'Montserrat',
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '400',
    textAlign: 'center',
    paddingBottom: 50,
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  subHeadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  subHeading: {
    fontFamily: 'Bricolage Grotesque',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'left',
    marginRight: 5,
    color: '#FFFFFF',
  },
  smallHeadingContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
    width: '100%',
  },
  smallHeading: {
    fontFamily: 'Inter',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'left',
    marginBottom: 5,
  },
  otpContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  otpInput: {
    width: 50,
    height: 50,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginHorizontal: 6,
    fontSize: 18,
    color: '#FFFFFF',
  },
  linksContainer: {
    marginTop: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  normalText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
    paddingLeft: 190,
  },
  resendLink: {
    alignItems: 'flex-end',
  },
  linkText: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  successContainer: {
    width: '100%',
    marginTop:160,
    paddingVertical: 15,
    backgroundColor: '#28A745',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#E21F27',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    marginLeft: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginTop: 60,
    textAlign: 'center',
  },
 
});
 
export default VerifyOtpPage;