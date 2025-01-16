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
import { useLoginViewModel } from '../View_model/SendOtpVM';

const LoginPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const {
    mobile,
    isValid,
    otpSent,
    errorMessage,
    setMobile,
    setIsValid,
    handleGetMagicCode,
    handleRetry,
    setErrorMessage,
  } = useLoginViewModel();

  const labelPosition = useRef(new Animated.Value(20)).current;
  const labelFontSize = useRef(new Animated.Value(14)).current;
  const labelColor = useRef(new Animated.Value(0)).current;

  const [buttonPressed, setButtonPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Update validation pattern for mobile
  const validateMobileNumber = (text: string) => {
    const mobileNumberPattern = /^\+91\d{10}$/; // Ensure number starts with +91
    return mobileNumberPattern.test(text);
  };

  const handleMobileChange = (text: string) => {
    setMobile(text);
    if (errorMessage) {
      setErrorMessage('');
    }
    setIsValid(validateMobileNumber(text));
  };

  const navigateToVerifyOtp = () => {
    setButtonPressed(true);
    if (isValid) {
      handleGetMagicCode(navigation);
    }
  };

  useEffect(() => {
    Animated.timing(labelPosition, {
      toValue: mobile && mobile !== '' || isFocused ? -10 : 20,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(labelFontSize, {
      toValue: mobile && mobile !== '' || isFocused ? 12 : 14,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(labelColor, {
      toValue: isValid ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [mobile, isValid, isFocused]);

  const interpolatedLabelColor = labelColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#B0B0B0', '#FF0000'],
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <View style={styles.topSection}>
            <Text style={styles.title}>Litz Chill</Text>
            <Text style={styles.subheading}>Let's Get You In!</Text>
            <Text style={styles.description}>
              Enter your mobile number and we will send a magic code!
            </Text>
            <View style={styles.inputContainer}>
              <View
                style={[styles.inputWrapper, { borderColor: buttonPressed && !isValid ? '#FF0000' : '#FFFFFF' }]}>
                <Icon name="phone" size={20} color="#FFFFFF" style={styles.icon} />
                <TextInput
                  style={[styles.input, { fontSize: 18 }]}
                  keyboardType="phone-pad"
                  value={mobile}
                  onChangeText={handleMobileChange}
                  onBlur={() => {
                    setIsFocused(false);
                    setIsValid(validateMobileNumber(mobile));
                  }}
                  onFocus={() => setIsFocused(true)}
                  placeholderTextColor="#B0B0B0"
                />
                {!isValid && buttonPressed && (
                  <MaterialIcons name="error-outline" size={20} color="#FF0000" style={styles.warningIcon} />
                )}
              </View>
              <Animated.Text
                style={[styles.floatingLabel, {
                  top: labelPosition,
                  fontSize: labelFontSize,
                  color: interpolatedLabelColor,
                }]}>
                Phone Number
              </Animated.Text>
              {!isValid && buttonPressed && <Text style={styles.errorText}>Oops! That doesn't look right</Text>}
            </View>
          </View>

          {/* Error message */}
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
              <TouchableOpacity onPress={() => handleRetry(navigation)}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {otpSent && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>OTP sent successfully!</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, {
              backgroundColor: buttonPressed && !isValid ? '#FF0000' : '#E21F27',
              opacity: isValid ? 1 : 0.6,
            }]}
            onPress={navigateToVerifyOtp}
            disabled={!isValid}
          >
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

  errorContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  errorMessage: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 4,
  },
  retryText: {
    color: '#E21F27',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default LoginPage;

