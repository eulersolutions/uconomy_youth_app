import React, { Component } from 'react';
import {ListItem, Body,Right} from 'native-base';
import CustomText from './CustomText';
import Global from '../constants/Global';

class EducationHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <ListItem key={Global.getKey()}>
            <Body>
              <CustomText content={this.props.item.qualification} />
              <CustomText note={true} content={this.props.item.institute} />
            </Body>
            <Right>
              <CustomText
                note={true}
                content={this.props.item.startDate + "-" + this.props.item.endDate}
                style={{ fontSize: 12, textAlign: "center" }}
              />
            </Right>
          </ListItem>
        );
    }
}

export default EducationHistory;