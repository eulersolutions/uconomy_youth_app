import React, { Component } from 'react';
import {View,Text} from 'react-native';

class ContactScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <View style={{flex:1,justifyContent:'center',alignContent:'center'}}>
                <Text style={{textAlign:'center',marginBottom:50}}>Contact screen (ContactStackNavigator)</Text>
            </View>
        );
    }
}

export default ContactScreen;