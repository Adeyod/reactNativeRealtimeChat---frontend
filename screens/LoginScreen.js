import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import { errorStyle, successStyle } from '../components/toastStyling';
import { loginRoute } from '../components/ApiRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SplashScreen from './SplashScreen';
import { UserType } from '../UserContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { userObject, setUserObject } = useContext(UserType);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        setLoading(true);
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (!userInfo) {
          console.log('userInfo not found');
          return;
        }

        if (userInfo) {
          const parseUserInfo = JSON.parse(userInfo);
          const token = parseUserInfo.token;

          console.log('parseUserInfo:', parseUserInfo.user);

          if (token) {
            setUserObject(parseUserInfo.user);
            setLoading(false);
            navigation.replace('Home');
            return;
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        Toast.show('All fields are required', errorStyle);
        return;
      }

      const user = { email, password };

      const { data } = await axios.post(`${loginRoute}`, user);
      if (data.error) {
        Toast.show(data.error, errorStyle);
        return;
      } else {
        Toast.show(data.message, successStyle);
        const userInfo = {
          user: data.user,
          token: data.token,
        };

        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        const myInfo = await AsyncStorage.getItem('userInfo');
        const parsedUser = JSON.parse(myInfo);
        setUserObject(parsedUser.user);
        setEmail('');
        setPassword('');

        navigation.replace('Home');
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
      }}
    >
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#4A55A2',
              fontSize: 22,
              fontWeight: '600',
              textTransform: 'uppercase',
              fontStyle: 'italic',
            }}
          >
            Sign In
          </Text>
          <Text style={{ marginTop: 10, fontSize: 17, fontWeight: '600' }}>
            Sign Into your account
          </Text>
        </View>

        <View
          style={{
            marginTop: 50,
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

          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: 'gray',
              }}
            >
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                fontSize: password ? 18 : 18,
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 5,
                marginVertical: 2,
                width: 300,
                height: 50,
                paddingHorizontal: 10,
              }}
              placeholderTextColor={'black'}
              placeholder="Enter your password"
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            style={{
              width: 200,
              backgroundColor: isLoading ? 'gray' : '#4A55A2',
              padding: 15,
              marginTop: 50,
              marginLeft: 'auto',
              marginRight: 'auto',
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {isLoading ? 'LOADING...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={{
              marginTop: 15,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'gray',
                fontSize: 16,
              }}
            >
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={{
              marginTop: 15,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'gray',
                fontSize: 16,
              }}
            >
              Forgot Password
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
