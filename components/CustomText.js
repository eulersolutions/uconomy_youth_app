import React, { Component } from 'react';
import {Text} from 'native-base';

class CustomText extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <Text note={this.props.note ? true : false} style={{fontFamily:'Noto',...this.props.style}}>{this.props.content}</Text>
        );
    }
}

export default CustomText;