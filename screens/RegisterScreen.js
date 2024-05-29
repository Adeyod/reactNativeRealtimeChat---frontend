import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import placeholderImage from '../assets/images/placeholderImage.png';
import Toast from 'react-native-root-toast';
import { registerRoute } from '../components/ApiRoutes';
import { errorStyle, successStyle } from '../components/toastStyling';
import Spinner from '../components/Spinner';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const pickImage = async () => {
    let result = {};

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Sorry, you need to give permission to continue');
      return;
    }
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets !== null) {
      setImage(result.assets[0].uri);
    } else {
      console.log('User closed the image picker');
      setImage(null);
    }

    // if (mode === 'gallery') {
    //   const { status } =
    //     await ImagePicker.requestMediaLibraryPermissionsAsync();

    //   if (status !== 'granted') {
    //     Alert.alert('Sorry, you need to give permission to continue');
    //     return;
    //   }
    //   result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     allowsEditing: true,
    //     aspect: [1, 1],
    //     quality: 1,
    //   });

    //   // console.log('result:', result);

    //   if (!result.canceled && result.assets !== null) {
    //     const imgUrl = result.assets[0];
    //     setImage(imgUrl);
    //   } else {
    //     console.log('User closed the image picker');
    //     setImage(null);
    //   }
    // } else if (mode === 'camera') {
    //   const { status } = await ImagePicker.requestCameraPermissionsAsync();

    //   if (status !== 'granted') {
    //     Alert.alert('Sorry, you need to give permission to continue');
    //     return;
    //   }
    //   result = await ImagePicker.launchCameraAsync({
    //     cameraType: ImagePicker.CameraType.front,
    //     allowsEditing: true,
    //     aspect: [1, 1],
    //     quality: 1,
    //   });

    //   // console.log('result:', result);

    //   if (!result.canceled && result.assets !== null) {
    //     const imgUrl = result.assets[0];
    //     setImage(imgUrl);
    //   } else {
    //     console.log('User closed the image picker');
    //     setImage(null);
    //   }
    // }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !image) {
      Toast.show('All fields are required', errorStyle);
      return;
    } else if (password !== confirmPassword) {
      Toast.show('Password and confirm password do not match', errorStyle);
      return;
    }
    const formData = new FormData();

    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    const sendImg = {
      uri: image,
      type: 'image/jpeg',
      name: 'photo.jpg',
    };
    formData.append('image', sendImg);

    setLoading(true);
    try {
      const { data } = await axios.post(`${registerRoute}`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.error) {
        Toast.show(data.error, errorStyle);
        console.log(data.error);
      } else {
        Toast.show(data.message, successStyle);
        console.log(data.message);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setImage(null);
        navigation.navigate('EmailVerification');
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <ScrollView
      style={{ backgroundColor: 'white' }}
      showsVerticalScrollIndicator={false}
    >
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
              marginTop: 60,
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
              Sign Up
            </Text>
            <Text style={{ marginTop: 10, fontSize: 17, fontWeight: '600' }}>
              Register an account
            </Text>
          </View>

          <View>
            <View
              style={{
                marginTop: 5,
              }}
            >
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  position: 'absolute',
                  right: 85,
                  bottom: 2,
                  zIndex: 10,
                }}
              >
                <Entypo
                  style={{
                    backgroundColor: 'lightgray',
                    borderRadius: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 7,
                  }}
                  name="camera"
                  size={30}
                  color="red"
                />
              </TouchableOpacity>

              <Image
                source={image ? { uri: image } : placeholderImage}
                imageStyle={{ borderRadius: 50 }}
                style={[
                  styles.image,
                  image ? styles.userImage : styles.placeholderImage,
                ]}
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
                Name
              </Text>
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                style={{
                  fontSize: name ? 18 : 18,
                  borderColor: 'gray',
                  borderWidth: 1,
                  borderRadius: 5,
                  marginVertical: 2,
                  width: 300,
                  height: 50,
                  paddingHorizontal: 10,
                }}
                placeholderTextColor={'black'}
                placeholder="Enter your name"
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

            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: 'gray',
                }}
              >
                Confirm Password
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                secureTextEntry={true}
                style={{
                  fontSize: confirmPassword ? 18 : 18,
                  borderColor: 'gray',
                  borderWidth: 1,
                  borderRadius: 5,
                  marginVertical: 2,
                  width: 300,
                  height: 50,
                  paddingHorizontal: 10,
                }}
                placeholderTextColor={'black'}
                placeholder="Confirm your password"
              />
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              style={{
                width: 200,
                backgroundColor: loading ? 'gray' : '#4A55A2',
                padding: 15,
                marginTop: image ? 20 : 50,
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
                {loading ? 'Loading...' : 'Register'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
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
                Have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  image: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'red',
    position: 'relative',
  },
  placeholderImage: {
    backgroundColor: 'green',

    // Style for the placeholder image
  },
  userImage: {
    // Any additional styles for the user-selected image
  },
});
