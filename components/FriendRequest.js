import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { UserType } from '../UserContext';
import { deleteFriendRequestRoute, sendFriendRequest } from './ApiRoutes';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import { errorStyle, successStyle } from './toastStyling';

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
  const { userObject, setUserObject } = useContext(UserType);
  const [acceptedFriendRequest, setAcceptedFriendRequest] = useState(false);

  const userId = userObject._id;

  const deleteFriendRequest = async () => {
    const payload = {
      currentUserId: userId,
      selectedUserId: item._id,
    };
    try {
      const { data } = await axios.post(deleteFriendRequestRoute, payload);

      if (data.error) {
        Toast.show(data.error, errorStyle);
        return;
      } else {
        Toast.show(data.message, successStyle);
        console.log(data.message);

        setAcceptedFriendRequest(true);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddAndAcceptFriendRequest = async () => {
    const payload = {
      currentUserId: userId,
      selectedUserId: item._id,
    };
    try {
      const { data } = await axios.post(sendFriendRequest, payload);

      if (data.error) {
        Toast.show(data.error, errorStyle);
        return;
      } else {
        Toast.show(data.message, successStyle);
        setFriendRequests(
          friendRequests.filter((request) => request._id !== item._id)
        );
        console.log(friendRequests);

        setAcceptedFriendRequest(true);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        gap: 10,
        flexWrap: 'wrap',
        height: 60,
        marginBottom: 30,
      }}
    >
      <View
        style={
          {
            // flex: 1,
          }
        }
      >
        <Image
          source={{ uri: item.image.url }}
          style={{ width: 90, height: 90, borderRadius: 45 }}
        />
      </View>

      <View
        style={{
          flex: 1,
          gap: 10,
        }}
      >
        <Text
          style={{
            // flex: 1,
            // marginLeft: 5,
            fontSize: 20,
            color: 'black',
            fontWeight: 'bold',
          }}
        >
          {item.name}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-around',
          }}
        >
          <TouchableOpacity
            onPress={handleAddAndAcceptFriendRequest}
            style={{
              backgroundColor: '#0066b2',
              padding: 10,
              borderRadius: 6,
              width: '50%',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 15,
              }}
            >
              Confirm
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={deleteFriendRequest}
            style={{
              backgroundColor: 'lightgray',
              padding: 10,
              borderRadius: 6,
              width: '50%',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'black',
                fontWeight: 'bold',
                fontSize: 15,
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
