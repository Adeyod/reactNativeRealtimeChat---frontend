import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import Toast from 'react-native-root-toast';
import { errorStyle, successStyle } from '../components/toastStyling';
import axios from 'axios';
import { resetPasswordDetailsRoute } from '../components/ApiRoutes';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(['', '', '', '', '', '']);

  const handleChange = (text, index) => {
    const newPins = [...pins];
    newPins[index] = text;
    setPins(newPins);

    if (text.length === 1 && index < 5) {
      inputRefs[index + 1].focus();
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!newPassword || !confirmNewPassword || !pins) {
        Toast.show('All fields are required', errorStyle);
        return;
      }

      setLoading(true);

      const tokenValue = pins.join('');

      const token = parseInt(tokenValue, 10);

      const inputData = {
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
        token: token,
      };

      const { data } = await axios.post(resetPasswordDetailsRoute, inputData);
      if (data.error) {
        Toast.show(data.error, errorStyle);
        return;
      } else {
        Toast.show(data.message, successStyle);
        navigation.navigate('Login');
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const inputRefs = [];
  console.log('pins:', pins);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: -80,
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: 'gray',
          }}
        >
          New password
        </Text>
        <TextInput
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
          secureTextEntry={true}
          style={{
            fontSize: 18,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            marginVertical: 2,
            width: 300,
            height: 50,
            paddingHorizontal: 10,
          }}
          placeholderTextColor={'black'}
          placeholder="Enter new password"
        />
      </View>

      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: 'gray',
          }}
        >
          Confirm password
        </Text>
        <TextInput
          value={confirmNewPassword}
          onChangeText={(text) => setConfirmNewPassword(text)}
          secureTextEntry={true}
          style={{
            fontSize: 18,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            marginVertical: 2,
            width: 300,
            height: 50,
            paddingHorizontal: 10,
          }}
          placeholderTextColor={'black'}
          placeholder="Confirm your new password"
        />
      </View>

      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: 'gray',
          }}
        >
          Password reset code
        </Text>
        <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 5,
          }}
        >
          {pins.map((pin, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs[index] = ref)}
              value={pin}
              onChangeText={(text) => handleChange(text, index)}
              keyboardType="numeric"
              onFocus={() => {
                const newPins = [...pins];
                newPins[index] = '';
                setPins(newPins);
              }}
              onBlur={() => {
                const newPins = [...pins];
                if (newPins[index] === '') {
                  newPins[index] = '';
                  setPins(newPins);
                }
              }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  if (index > 0) {
                    inputRefs[index - 1].focus();
                  } else {
                    return null;
                  }
                }
              }}
              style={{
                fontSize: 18,
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 5,
                marginVertical: 2,
                width: 45,
                height: 60,
                paddingHorizontal: 10,
              }}
              maxLength={1}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleResetPassword}
        disabled={loading}
        style={{
          backgroundColor: loading ? 'gray' : '#4A55A2',
          marginTop: 15,
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            fontStyle: 'italic',
          }}
        >
          {loading ? 'Loading...' : 'Reset Password'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({});
