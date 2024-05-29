import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const SplashScreen = () => {
  return (
    <View
      style={{
        paddingTop: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: '100%',
      }}
    >
      <View>
        <View>
          <Text
            style={{
              fontStyle: 'italic',
              fontSize: 25,
              textTransform: 'uppercase',
            }}
          >
            Welcome to
          </Text>
          <Text
            style={{
              fontStyle: 'italic',
              fontSize: 45,
              fontWeight: 'bold',
              marginVertical: 20,
              textTransform: 'uppercase',
            }}
          >
            friend zone
          </Text>
        </View>

        <LottieView
          autoPlay
          style={{
            width: 200,
            height: 200,
            marginRight: 'auto',
            marginLeft: 'auto',
            backgroundColor: 'white',
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require('../assets/friendZone.json')}
        />
        <Text
          style={{
            fontStyle: 'italic',
            fontSize: 18,
            textTransform: 'uppercase',
          }}
        >
          Please wait, it is loading...
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
