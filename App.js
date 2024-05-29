import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './StackNavigator';
import { RootSiblingParent } from 'react-native-root-siblings';
import { UserContext } from './UserContext';

export default function App() {
  return (
    <>
      <UserContext>
        <RootSiblingParent>
          <StackNavigator />
        </RootSiblingParent>
      </UserContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
