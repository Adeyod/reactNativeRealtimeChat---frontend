import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { UserType } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAllUserExceptLoggedInUserRoute,
  logoutRoute,
} from '../components/ApiRoutes';
import Toast from 'react-native-root-toast';
import { errorStyle, successStyle } from '../components/toastStyling';
import { decode } from 'base-64';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import User from '../components/User';
import Spinner from '../components/Spinner';
global.atob = decode;

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userObject, setUserObject } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Instant Chat</Text>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Ionicons
            onPress={() => navigation.navigate('Chats')}
            name="chatbox-ellipses-outline"
            size={24}
            color="black"
          />
          <MaterialIcons
            onPress={() => navigation.navigate('Friends')}
            name="people-outline"
            size={24}
            color="black"
          />

          <MaterialIcons
            onPress={handleLogout}
            name="logout"
            size={24}
            color="black"
          />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userId = userObject?._id;
        const { data } = await axios.get(
          `${getAllUserExceptLoggedInUserRoute}/${userId}`
        );

        if (data.error) {
          Toast.show(data.error, errorStyle);
          return;
        } else {
          setUsers(data?.users);
          return;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userInfo');
      setUserObject(null);
      navigation.replace('Login');

      Toast.show('Logged out successfully', successStyle);
      return;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return <Spinner />;
  }

  if (!userObject || userObject.length === 0 || userObject === undefined) {
    return null;
  }

  return (
    <View>
      <View
        style={{
          padding: 10,
        }}
      >
        {users && users?.map((item, index) => <User key={index} item={item} />)}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
