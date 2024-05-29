import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { fetchMessagesBetweenUsersRoute } from './ApiRoutes';
import { UserType } from '../UserContext';
import axios from 'axios';
import { errorStyle, successStyle } from './toastStyling';
import Toast from 'react-native-root-toast';

const UserChat = ({ item }) => {
  const navigation = useNavigation();
  const { userObject, setUserObject } = useContext(UserType);
  const [messages, setMessages] = useState([]);

  const senderId = userObject._id;

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `${fetchMessagesBetweenUsersRoute}/${senderId}/${item._id}`
      );

      if (data.error) {
        Toast.show(data.error, errorStyle);
        return;
      } else {
        Toast.show(data.message, successStyle);
        setMessages(data.messages);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  console.log(messages);

  const getMessage = () => {
    const userMessages = messages.filter(
      (message) => message.messageType === 'text'
    );

    const n = userMessages.length;

    return userMessages[n - 1];
  };

  const lastMessage = getMessage();

  console.log('lastMessage:', lastMessage);

  const formatTime = (time) => {
    const date = new Date(time);

    const option = {
      hour: 'numeric',
      minute: 'numeric',
    };

    return date.toLocaleTimeString('en-us', option);
  };

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Messages', {
          recipientId: item._id,
        })
      }
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 0.7,
        borderColor: '#D0D0D0',
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        padding: 10,
      }}
    >
      <Image
        style={{
          height: 50,
          width: 50,
          borderRadius: 25,
          resizeMode: 'cover',
        }}
        source={{ uri: item.image.url }}
      />

      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: '500',
          }}
        >
          {item.name}
        </Text>

        {lastMessage && (
          <Text
            style={{
              marginTop: 3,
              color: 'gray',
              fontWeight: '500',
            }}
          >
            {lastMessage?.message}
          </Text>
        )}
      </View>

      <View>
        <Text
          style={{
            fontSize: 11,
            fontWeight: '400',
            color: '#505050',
          }}
        >
          {lastMessage && formatTime(lastMessage.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserChat;

const styles = StyleSheet.create({});
