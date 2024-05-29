import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Entypo,
  Feather,
  Ionicons,
  FontAwesome,
  MaterialIcons,
} from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import { UserType } from '../UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import { errorStyle, successStyle } from '../components/toastStyling';
import {
  deleteMessagesRoute,
  fetchMessagesBetweenUsersRoute,
  getRecipientDataRoute,
  postImageMessageRoute,
  postTextMessageRoute,
} from '../components/ApiRoutes';
import * as imagePicker from 'expo-image-picker';
import Spinner from '../components/Spinner';

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amLoading, setAmLoading] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [recipientData, setRecipientData] = useState();
  const [selectedImage, setSelectedImage] = useState('');
  const { userObject, setUserObject } = useContext(UserType);
  const route = useRoute();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleContentSizeChange = () => {
    scrollToBottom();
  };

  const senderId = userObject._id;
  const { recipientId } = route.params;

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${fetchMessagesBetweenUsersRoute}/${senderId}/${recipientId}`
      );

      if (data.error) {
        Toast.show(data.error, errorStyle);
        return;
      } else {
        setMessages(data.messages);
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchRecipientData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${getRecipientDataRoute}/${recipientId}`
        );

        if (data.error) {
          Toast.show(data.error, errorStyle);
          return;
        } else {
          setRecipientData(data.recipient);
          return;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipientData();
  }, []);

  const handleSend = async (messageType, imageUrl) => {
    setAmLoading(true);
    try {
      const formData = new FormData();
      formData.append('senderId', senderId);
      formData.append('recipientId', recipientId);

      if (messageType === 'image') {
        formData.append('messageType', 'image');
        formData.append('imageUrl', {
          uri: imageUrl,
          name: 'image.jpg',
          type: 'image/jpeg',
        });
      } else {
        formData.append('messageType', 'text');
        formData.append('message', message);
        console.log(formData);

        // use the endpoint prepared to receive only text
      }

      console.log(formData);
      const { data } = await axios.post(postTextMessageRoute, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      if (data.error) {
        Toast.show(data.error, errorStyle);
        return;
      } else {
        Toast.show(data.message, successStyle);
        setMessage('');
        fetchMessages();
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAmLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
          {selectedMessages?.length > 0 ? (
            <View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                }}
              >
                {selectedMessages?.length}
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  resizeMode: 'cover',
                }}
                source={{ uri: recipientData?.image?.url }}
              />
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 15,
                  fontWeight: 'bold',
                }}
              >
                {recipientData?.name}
              </Text>
            </View>
          )}
        </View>
      ),

      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Ionicons name="arrow-redo-sharp" size={24} color="black" />
            <Ionicons name="arrow-undo" size={24} color="black" />
            <FontAwesome name="star" size={24} color="black" />
            <MaterialIcons
              onPress={() => deleteMessages(selectedMessages)}
              name="delete"
              size={24}
              color="black"
            />
          </View>
        ) : null,
    });
  }, [recipientData, selectedMessages]);

  const deleteMessages = async (messageIds) => {
    try {
      const { data } = await axios.post(deleteMessagesRoute, {
        messages: messageIds,
      });
      if (data.error) {
        Toast.show(data.error, errorStyle);
        return;
      } else {
        Toast.show(data.message, successStyle);
        setSelectedMessages((prevSelectedMessages) =>
          prevSelectedMessages.filter((id) => !messageIds.includes(id))
        );
        fetchMessages();
        // 04:19:41
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const formatTime = (time) => {
  //   const options = { hour: 'numeric', minute: 'numeric' };
  //   return new Date(time).toLocaleString('en-us', options);
  // };

  const formatTime = (time) => {
    const date = new Date(time);
    const option = {
      hour: 'numeric',
      minute: 'numeric',
    };
    return date.toLocaleTimeString('en-us', option);
  };

  const pickImage = async () => {
    try {
      let result = await imagePicker.launchImageLibraryAsync({
        mediaTypes: imagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('IMAGE:', result.assets[0].uri);
      if (!result.canceled) {
        handleSend('image', result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectMessage = (message) => {
    const isSelected = selectedMessages.includes(message._id);
    if (isSelected) {
      setSelectedMessages((prevMessages) =>
        prevMessages.filter((id) => id !== message._id)
      );
    } else {
      setSelectedMessages((prevMessages) => [...prevMessages, message._id]);
    }
  };

  console.log('selected messages: ', selectedMessages);

  if (loading || isLoading || amLoading) {
    return <Spinner />;
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: '#F0F0F0',
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages &&
          messages?.map((item, index) => {
            if (item.messageType === 'text') {
              const isSelected = selectedMessages.includes(item._id);
              return (
                <TouchableOpacity
                  onLongPress={() => handleSelectMessage(item)}
                  key={index}
                  style={[
                    item?.senderId._id === senderId
                      ? {
                          alignSelf: 'flex-end',
                          backgroundColor: '#DCF8C6',
                          padding: 8,
                          maxWidth: '60%',
                          borderRadius: 7,
                        }
                      : {
                          alignSelf: 'flex-start',
                          backgroundColor: 'white',
                          padding: 8,
                          margin: 10,
                          borderRadius: 7,
                          maxWidth: '60%',
                        },

                    isSelected && { width: '100%', backgroundColor: '#F0FFFF' },
                  ]}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 13,
                        textAlign: isSelected ? 'right' : 'left',
                      }}
                    >
                      {item?.message}
                    </Text>

                    <Text
                      style={{
                        textAlign: 'right',
                        fontSize: 9,
                        color: 'gray',
                        marginTop: 5,
                      }}
                    >
                      {formatTime(item?.createdAt)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }

            if (item.messageType === 'image') {
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    item?.senderId._id === senderId
                      ? {
                          alignSelf: 'flex-end',
                          backgroundColor: '#DCF8C6',
                          padding: 8,
                          maxWidth: '60%',
                          borderRadius: 7,
                          margin: 10,
                        }
                      : {
                          alignSelf: 'flex-start',
                          backgroundColor: 'white',
                          padding: 8,
                          margin: 10,
                          borderRadius: 7,
                          maxWidth: '60%',
                        },
                  ]}
                >
                  <View>
                    {/* <Text
                      style={{
                        fontSize: 13,
                        textAlign: 'left',
                      }}
                    >
                      {item?.url}
                    </Text> */}

                    <Image
                      source={{ uri: item?.image?.url }}
                      style={{
                        width: 200,
                        height: 200,
                        borderRadius: 7,
                        resizeMode: 'contain',
                      }}
                    />

                    <Text
                      style={{
                        textAlign: 'right',
                        fontSize: 9,
                        position: 'absolute',
                        right: 10,
                        bottom: 7,
                        color: 'gray',
                        marginTop: 5,
                      }}
                    >
                      {formatTime(item?.createdAt)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }
          })}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: '#dddddd',
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{
            marginRight: 15,
          }}
          name="emoji-happy"
          size={24}
          color="gray"
        />

        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: '#dddddd',
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message..."
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
          <Feather name="mic" size={24} color="gray" />
        </View>

        <TouchableOpacity
          onPress={() => handleSend('text')}
          style={{
            backgroundColor: '#007bff',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>
      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          style={{
            height: 250,
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});
