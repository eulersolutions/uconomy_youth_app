import React, { Component } from 'react';
import {View} from 'react-native';

class Divider extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <View
            style={{
              borderBottomColor: 'lightgrey',
              borderBottomWidth: 0.8,
            }}
          />
        );
    }
}

export default Divider;