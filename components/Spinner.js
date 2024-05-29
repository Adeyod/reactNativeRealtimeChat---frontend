import { StyleSheet, Text, ActivityIndicator, View } from 'react-native';
import React from 'react';

const Spinner = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size={'large'} color="#82CD47" />
    </View>
  );
};

export default Spinner;

const styles = StyleSheet.create({});
