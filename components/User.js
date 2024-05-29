import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { UserType } from '../UserContext';
import axios from 'axios';
import {
  getUserFriends,
  sendFriendRequest,
  sentFriendRequestRoute,
} from './ApiRoutes';
import Toast from 'react-native-root-toast';
import { errorStyle, successStyle } from './toastStyling';

const User = ({ item }) => {
  const { userObject } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  const userId = userObject._id;

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const { data } = await axios.get(`${sentFriendRequestRoute}/${userId}`);
        if (data.error) {
          Toast.show(data.error, errorStyle);
          return;
        } else {
          // Toast.show(data.message, successStyle);
          setFriendRequests(data.sentFriendRequest || []);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFriendRequests();
  }, [userId]);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const { data } = await axios.get(`${getUserFriends}/${userId}`);
        if (data.error) {
          Toast.show(data.error, errorStyle);
          return;
        } else {
          // Toast.show(data.message, successStyle);
          setUserFriends(data.friendIds || []);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserFriends();
  }, [userId]);

  const handleAddAndAcceptFriendRequest = async () => {
    const payload = {
      currentUserId: userId,
      selectedUserId: item?._id,
    };
    try {
      const { data } = await axios.post(sendFriendRequest, payload);

      if (data.error) {
        Toast.show(data.error, errorStyle);
        return;
      } else {
        Toast.show(data.message, successStyle);

        setRequestSent(true);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isFriend = userFriends?.find((friend) => friend?._id === item?._id);
  const hasSentRequest = friendRequests?.some(
    (friend) => friend._id === item._id
  );
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
      }}
    >
      <View>
        <Image
          source={{ uri: item?.image?.url }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: 'cover',
          }}
        />
      </View>

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontStyle: 'italic',
          }}
        >
          {item?.name}
        </Text>
        <Text
          style={{
            marginTop: 4,
            color: 'gray',
          }}
        >
          {item?.email}
        </Text>
      </View>

      {isFriend ? (
        <TouchableOpacity
          style={{
            backgroundColor: '#2196F3',
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 15,
              fontStyle: 'italic',
              fontWeight: 'bold',
            }}
          >
            Friend
          </Text>
        </TouchableOpacity>
      ) : requestSent || hasSentRequest ? (
        <TouchableOpacity
          style={{
            backgroundColor: '#9E9E9E',
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 14,
              paddingVertical: 5,
              fontStyle: 'italic',
              fontWeight: 'bold',
            }}
          >
            Request Sent
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleAddAndAcceptFriendRequest}
          style={{
            backgroundColor: '#FF9800',
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 15,
              fontStyle: 'italic',
              fontWeight: 'bold',
            }}
          >
            Add Friend
          </Text>
        </TouchableOpacity>
      )}

      {/* <TouchableOpacity
        onPress={handleAddAndAcceptFriendRequest}
        style={{
          backgroundColor: '#567189',
          padding: 10,
          borderRadius: 6,
          width: 105,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: 15,
            fontStyle: 'italic',
            fontWeight: 'bold',
          }}
        >
          Add Friend
        </Text>
      </TouchableOpacity> */}
    </TouchableOpacity>
  );
};

export default User;

const styles = StyleSheet.create({});
