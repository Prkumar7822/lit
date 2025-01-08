import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
    VerifyOtpPage: { mobileNumber: string };
  };

  type VerifyOtpPageRouteProp = RouteProp<RootStackParamList, 'VerifyOtpPage'>;

  const VerifyOtpPage = ({ route }: { route: VerifyOtpPageRouteProp })=> {
    const [otp, setOtp] = useState(['', '', '', '']);
    const { mobileNumber } = route.params;

    interface HandleChange {
        (text: string, index: number): void;
    }

    const handleChange: HandleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
    };

    return (
        <View style={styles.container}>
            {/* Main Heading */}
            <Text style={styles.mainHeading}>Litz Chill</Text>

            {/* Circular Container for Image */}
            <View style={styles.imageContainer}>
                <Image source={require('../assests/images/img.png')} style={styles.image} />
            </View>

            {/* Sub Heading with Timer Icon */}
            <View style={styles.subHeadingContainer}>
                <Text style={styles.subHeading}>It's Code Time!</Text>
            </View>

            <View style={styles.subHeadingContainer}>
                <Text style={styles.subHeading}>
                Look Out for Your SMS! ⏳</Text>

            </View>

            {/* Small Heading */}
            <View style={styles.smallHeadingContainer}>
                <Text style={styles.smallHeading}>Enter the 4-digit code we sent to</Text>
                <Text style={styles.smallHeading}>{mobileNumber}</Text>
            </View>

            {/* OTP Input Boxes */}
            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={styles.otpInput}
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                        maxLength={1}
                        keyboardType="number-pad"
                    />
                ))}
            </View>

            {/* Resend Code and Use Different Phone Number Links */}
            <View style={styles.linksContainer}>
                <Text style={styles.normalText}>Didn't get it?</Text>
                <TouchableOpacity style={styles.resendLink}>
                    <Text style={styles.linkText}>Resend code</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginLeft:165,marginTop:10 }}>
                <TouchableOpacity>
                    <Text style={styles.linkText}>Use Different Phone Number</Text>
                </TouchableOpacity>
            </View>


            {/* Button Section */}
                  <TouchableOpacity style={styles.button} >
                    <Text style={styles.buttonText}>Verify & Continue</Text>
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
        fontFamily:'Montserrat',
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
        borderRadius: 50, // Makes the container circular
        overflow: 'hidden',
        alignItems: 'center', // Center the image inside the container
        justifyContent: 'center', // Center the content inside the container
        marginRight: 20, // Optional: adds some space to the right if needed
        alignSelf: 'flex-start', // Align the image container to the left side of the screen
        borderWidth: 2, // Set the width of the border
        borderColor: '#FFFFFF', // Set the color of the border (black in this case)
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    subHeadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', // Align content to the left
        width: '100%', // Ensures the container takes up the full width for alignment
    },
    subHeading: {
        fontFamily: 'Bricolage Grotesque',
        fontSize: 28,
        fontWeight: 700,
        textAlign: 'left', // Align the text to the left
        marginRight: 5,
        color: '#FFFFFF',
    },
    smallHeadingContainer: {
        marginTop: 10,
        alignItems: 'flex-start', // Align text to the left
        width: '100%', // Take up full width to align left
    },
    smallHeading: {
        fontFamily: 'inter',
        color: '#FFFFFF',
    
        fontSize: 16,
        fontWeight: 400,
        textAlign: 'left', // Align the text to the left
        marginBottom: 5, // Optional: space between the lines of text
    },
    otpContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'flex-start', // Align OTP inputs to the left
        alignItems: 'center',
        width: '100%', // Take up full width to ensure proper spacing
    },
    otpInput: {
        width: 60,
        height: 60,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginHorizontal: 18,
        fontSize: 18,
    },
    linksContainer: {
        marginTop: 30,
        alignItems: 'center',
        flexDirection: 'row', // Make the container row to align items horizontally
        justifyContent: 'space-between', // Place "Didn't get it?" text on the left and "Resend code" on the right
    },
    normalText: {
        fontFamily:'Roboto',
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '400',
        paddingLeft: 190
    },
    resendLink: {
        alignItems: 'flex-end', // Align the "Resend code" link to the right side
    },
    linkText: {
        color: '#3B82F6',
        textDecorationLine: 'underline',
        fontSize: 16,
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
        marginLeft:20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default VerifyOtpPage;
