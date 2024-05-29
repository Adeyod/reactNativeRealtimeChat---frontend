import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { emailVerificationRoute } from '../components/ApiRoutes';
import Toast from 'react-native-root-toast';
import { useNavigation } from '@react-navigation/native';
import { errorStyle, successStyle } from '../components/toastStyling';

const EmailVerificationScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pins, setPins] = useState(['', '', '', '', '', '']);

  const navigation = useNavigation();

  const handleToken = async () => {
    const value = pins.join('');
    const token = parseInt(value, 10);

    setIsLoading(true);
    try {
      const { data } = await axios.get(`${emailVerificationRoute}/${token}`);

      if (data.success === true) {
        Toast.show(data.message, successStyle);
        navigation.navigate('Login');
        return;
      } else {
        Alert.alert(data.error);
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (text, index) => {
    const newPins = [...pins];
    newPins[index] = text;
    setPins(newPins);

    if (text.length === 1 && index < 5) {
      inputRefs[index + 1].focus();
    }
  };

  const inputRefs = [];

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <View>
        <Text
          style={{ textAlign: 'center', fontSize: 30, fontStyle: 'italic' }}
        >
          Email Verification
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {pins.map((pin, index) => (
            <TextInput
              key={index}
              value={pin}
              ref={(ref) => (inputRefs[index] = ref)}
              onChangeText={(text) => handleChange(text, index)}
              keyboardType="numeric"
              maxLength={1}
              onFocus={() => {
                //clear input when focused
                const newPins = [...pins];
                newPins[index] = '';
                setPins(newPins);
              }}
              onBlur={() => {
                // Ensure all inputs have a value when blurred
                const newPins = [...pins];
                if (newPins[index] === '') {
                  newPins[index] = '';
                  setPins(newPins);
                }
              }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && index > 0) {
                  // Move focus to previous input on backspace press
                  inputRefs[index - 1].focus();
                }
              }}
              style={{
                borderColor: 'gray',
                flexDirection: 'column',
                borderWidth: 1,
                height: 70,
                width: 50,
                fontSize: 20,
                marginHorizontal: 3,
                marginVertical: 20,
                borderRadius: 2,
                textAlign: 'center',
              }}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleToken}
          disabled={isLoading}
          style={{
            marginRight: 'auto',
            marginLeft: 'auto',
            borderRadius: 10,
            backgroundColor: isLoading ? 'gray' : '#4A55A2',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              padding: 15,
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {isLoading ? 'Loading...' : 'Verify Email'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EmailVerificationScreen;

const styles = StyleSheet.create({});
