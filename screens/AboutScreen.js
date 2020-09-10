import React, { Component } from 'react';
import {View,Text} from 'react-native';

class AboutScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <View style={{flex:1,justifyContent:'center',alignContent:'center'}}>
                <Text style={{textAlign:'center',marginBottom:50}}>About screen (AboutStackNavigator)</Text>
                <Text style={{textAlign:'center',marginBottom:50}}>You can nest more screens inside this stack too</Text>
            </View>
        );
    }
}

export default AboutScreen;