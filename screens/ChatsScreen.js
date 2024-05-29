import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import { errorStyle, successStyle } from '../components/toastStyling';
import { fetchFriendsRoute } from '../components/ApiRoutes';
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';
import Spinner from '../components/Spinner';

const ChatsScreen = () => {
  const [friends, setFriends] = useState([]);
  const { userObject } = useContext(UserType);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const userId = userObject?._id;

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data } = await axios.get(`${fetchFriendsRoute}/${userId}`);

        if (data.error) {
          Toast.show(data.error, errorStyle);
          return;
        } else {
          setFriends(data?.friends);
          return;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    console.log('It is loading please wait...');
    return <Spinner />;
  }

  if (!friends || friends.length === 0) {
    return (
      <View>
        <Text>No friends found</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableOpacity>
        {friends.map((item, index) => (
          <UserChat key={index} item={item} />
        ))}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
