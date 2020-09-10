import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Global from '../../constants/Global';

class AuthLoading extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        //You can check if a user's token is stored in localstorage and is valid.
        this.retrieveData();
        //  this.props.navigation.addListener('focus', () => {
        //     this.retrieveData()
        //   });
    
    }


    retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('token');
          if (value !== null) {
            Global.token = value;
            this.props.navigation.reset({
              index: 0,
              routes: [{name: 'Main'}],
            });
          
          } else {
            this.props.navigation.navigate('Login')
          }
        } catch (error) {
          // Error retrieving data
        }
      };

    render() {
        return (
            /** No need to return anything since this component does not render anything. 
            * It simply acts as a middleman between the main part of your app that only 
            * authenticated users
            see, and the parts of the app required to authenticate those users.
            */ 
            null
        );
    }
}

export default AuthLoading;