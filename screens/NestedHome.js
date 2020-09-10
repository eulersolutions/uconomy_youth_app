import React, { Component } from 'react';
import {View,Text,Button} from 'react-native';

class NestedHome extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <View style={{flex:1,justifyContent:'center',alignContent:'center'}}>
                <Text style={{textAlign:'center',marginBottom:50}}>Nested Home screen (FeedStackNavigator)</Text>
            </View>
        );
    }
}

export default NestedHome;