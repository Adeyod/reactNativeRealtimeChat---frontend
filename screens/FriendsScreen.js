import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { getFriendRequestsRoute } from '../components/ApiRoutes';
import { UserType } from '../UserContext';
import Toast from 'react-native-root-toast';
import { errorStyle, successStyle } from '../components/toastStyling';
import FriendRequest from '../components/FriendRequest';
import Spinner from '../components/Spinner';

const FriendsScreen = () => {
  const { userObject } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = userObject._id;

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${getFriendRequestsRoute}/${userId}`);
      if (data.error) {
        Toast.show(data.error, errorStyle);
        return;
      } else {
        setFriendRequests(data.friendRequests);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <View
      style={{
        padding: 3,
        marginHorizontal: 12,
      }}
    >
      {friendRequests !== null && friendRequests.length > 0 ? (
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            Friend Requests
          </Text>
          <Text
            style={{
              color: 'red',
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            {friendRequests.length}
          </Text>
        </View>
      ) : (
        <View
          style={{
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            No Friend Request at the moment!
          </Text>
        </View>
      )}

      {friendRequests.length > 0 &&
        friendRequests.map((item, index) => (
          <FriendRequest
            key={index}
            item={item}
            friendRequests={friendRequests}
            setFriendRequests={setFriendRequests}
          />
        ))}
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
