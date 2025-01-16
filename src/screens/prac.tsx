import React, { useRef, useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
 
const MobileNumberInput = () => {
  const phoneInput = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
 
  const handleSubmit = () => {
    console.log('Entered Number:', phoneNumber);
    console.log('Formatted Number:', formattedValue);
  };
 
  return (
    <View style={styles.container}>
      <PhoneInput
        ref={phoneInput}
        defaultValue={phoneNumber}
        defaultCode="IN"
        layout="first"
        onChangeText={(text) => setPhoneNumber(text)}
        onChangeFormattedText={(text) => setFormattedValue(text)}
        withShadow
        autoFocus
        containerStyle={styles.phoneInputContainer}
        textContainerStyle={styles.textContainer}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  phoneInputContainer: {
    width: '80%',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  textContainer: {
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
});
 
export default MobileNumberInput;
