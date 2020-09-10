import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './navigation/createDrawerNavigator';
import AuthLoading from './screens/Auth/AuthLoading';
import LoginScreen from './screens/Auth/LoginScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { AppLoading } from 'expo';
import ErrorBoundary from './handlers/ErrorBoundary';
import { Root } from "native-base";
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Noto: require('./assets/fonts/NotoSans-Regular.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    const AppStack = createStackNavigator();

    return (
      <Root>
      <NavigationContainer>
      <AppStack.Navigator headerMode='none' initialRouteName= "AuthLoading">
      <AppStack.Screen name="AuthLoading"  component={AuthLoading} />
      <AppStack.Screen name="Main" component={DrawerNavigator}/>
      <AppStack.Screen name="Login" component={LoginScreen} /> 
      <AppStack.Screen name="SignUp" component={SignUpScreen} />  
      </AppStack.Navigator>
</NavigationContainer>
</Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
