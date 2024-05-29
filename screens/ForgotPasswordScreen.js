import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import { errorStyle, successStyle } from '../components/toastStyling';
import { useNavigation } from '@react-navigation/native';
import { forgotPasswordRoute } from '../components/ApiRoutes';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(forgotPasswordRoute, { email });
      if (data.error) {
        Toast.show(data.error, errorStyle);
        return;
      } else {
        Toast.show(data.message, successStyle);
        setEmail('');
        navigation.navigate('ResetPassword');
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
          Email
        </Text>
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{
            fontSize: email ? 18 : 18,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            marginVertical: 2,
            width: 300,
            height: 50,
            paddingHorizontal: 10,
          }}
          placeholderTextColor={'black'}
          placeholder="Enter your email"
        />
      </View>

      <TouchableOpacity
        onPress={handleForgotPassword}
        disabled={loading}
        style={{
          backgroundColor: loading ? 'gray' : '#4A55A2',
          marginTop: 15,
          padding: 10,
          borderRadius: 5,
          width: 170,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          {loading ? 'Loading...' : 'Reset Password'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({});
