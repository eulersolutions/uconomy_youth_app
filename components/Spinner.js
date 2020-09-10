import React, { Component } from 'react';
import {DotIndicator} from 'react-native-indicators';
import {View,Text} from 'native-base';
class Spinner extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <View style={{flex:1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
            <DotIndicator color='deepskyblue' />
            </View>
        );
    }
}

export default Spinner;