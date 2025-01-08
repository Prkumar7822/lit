import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import axios from 'axios';

type RootStackParamList = {
  LoginPage: undefined;
  VerifyOtpPage: { mobileNumber: string };
};

const LoginPage = () => {
  const [mobile, setMobile] = useState('');
  const [focused, setFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [otpSent, setOtpSent] = useState(false);

  // Animated label position and font size
  const labelPosition = useRef(new Animated.Value(20)).current;
  const labelFontSize = useRef(new Animated.Value(14)).current;

  // Animated label color
  const labelColor = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Label animations based on focus or input
  useEffect(() => {
    Animated.timing(labelPosition, {
      toValue: focused || mobile ? -10 : 20,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(labelFontSize, {
      toValue: focused || mobile ? 12 : 14,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // Animate label color based on validation
    Animated.timing(labelColor, {
      toValue: isValid ? 0 : 1, // 0 for gray, 1 for red
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused, mobile, isValid]);

  // Interpolate color change for the label
  const interpolatedLabelColor = labelColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#B0B0B0', '#FF0000'], // Gray to Red
  });

  // Validate mobile number
  const validateMobileNumber = (number: string): boolean => {
    const regex = /^\+91\d{10}$/;
    return regex.test(number);
  };

  // Handle OTP request
  const handleGetMagicCode = async () => {
    if (!validateMobileNumber(mobile)) {
      setIsValid(false);
      return;
    }
  
    setIsValid(true);
    try {
      const requestBody = { mobileNumber: mobile };
      console.log('Request Payload:', requestBody); // Log the payload to check the phone number
  
      const response = await axios.post(
        'https://ixnbfvyeniksbqcfdmdo.supabase.co/functions/v1/users/request-otp',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            // Fix the Authorization header to include 'Bearer' keyword
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bmJmdnllbmlrc2JxY2ZkbWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MDE3NjgsImV4cCI6MjA0Njk3Nzc2OH0.h4JtVbwtKAe38yvtOLYvZIbhmMy6v2QCVg51Q11ubYg`,
          },
        }
      );
      console.log('Response:', response.data);
  
      if (response.status === 200) {
        setOtpSent(true);
        navigation.navigate('VerifyOtpPage', { mobileNumber: mobile });
      } else {
        setOtpSent(false);
      }
    } catch (error) {
      setOtpSent(false);
      if (axios.isAxiosError(error)) {
        console.error('API call error:', error.response ? error.response.data : error.message);
      } else {
        console.error('API call error:', error);
      }
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <View style={styles.topSection}>
            <Text style={styles.title}>Litz Chill</Text>
            <Text style={styles.subheading}>Let's Get You In!</Text>
            <Text style={styles.description}>
              Enter your mobile number and we will send a{"\n"}magic code!
            </Text>
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  { borderColor: isValid ? '#FFFFFF' : '#FF0000' },
                ]}
              >
                {/* Fixed Phone Icon */}
                <Icon
                  name="phone"
                  size={20}
                  color="#FFFFFF"
                  style={styles.icon}
                />
                <TextInput
                  style={[
                    styles.input,
                    {
                      fontSize: 18, // Increased font size
                    },
                  ]}
                  keyboardType="phone-pad"
                  value={mobile}
                  onChangeText={(text) => setMobile(text)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => {
                    setFocused(false);
                    setIsValid(validateMobileNumber(mobile)); // Validate on blur
                  }}
                />

                {!isValid && (
                  <MaterialIcons
                    name="error-outline"
                    size={20}
                    color="#FF0000"
                    style={styles.warningIcon}
                  />
                )}
              </View>
              <Animated.Text
                style={[
                  styles.floatingLabel,
                  {
                    top: labelPosition,
                    fontSize: labelFontSize,
                    color: interpolatedLabelColor, // Use animated color
                  },
                ]}
              >
                Phone Number
              </Animated.Text>

              {!isValid && (
                <Text style={styles.errorText}>
                  Oops! That doesn’t look right.
                </Text>
              )}
            </View>
          </View>

          {otpSent && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>OTP sent successfully!</Text>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleGetMagicCode}>
            <Text style={styles.buttonText}>Get the Magic Code</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#000000',
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 32,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    marginLeft: 120,
  },
  subheading: {
    fontSize: 28,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 24,
    width: '100%',
  },
  inputWrapper: {
    width: '100%',
    borderRadius: 4,
    borderWidth: 3,
    paddingLeft: 40,
    paddingRight: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 14,
    color: '#FFFFFF',
  },
  icon: {
    position: 'absolute',
    left: 16,
    top: 15,
  },
  warningIcon: {
    position: 'absolute',
    right: 16,
    top: 15,
  },
  floatingLabel: {
    position: 'absolute',
    left: 40,
    color: '#B0B0B0',
    backgroundColor: '#000000',
    paddingHorizontal: 5,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
  },
  successContainer: {
    marginTop: 450,
    paddingVertical: 15,
    backgroundColor: '#00FF00',
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#E21F27',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginPage;

