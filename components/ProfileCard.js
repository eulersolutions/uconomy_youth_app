import React, { Component } from 'react';
import {List,ListItem,Left,Thumbnail,Body} from 'native-base';
import CustomText from './CustomText';
import moment from 'moment';
import DisplayImage from './DisplayImage';
import { TouchableOpacity } from 'react-native-gesture-handler';
class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    componentDidMount() {
      
    }
    render() {
        return (
            <List style={{ backgroundColor: "transparent", marginTop: 10 }}>
            <ListItem avatar>
            <TouchableOpacity onPress={() => {this.refs.imageViewer.showModal(this.props.profile.unl_avatar)}}>

              <Left>
                <Thumbnail
                large
                  source={{
                    uri: `https://youth.uconomy.co.za:8000${this.props.profile.unl_avatar}`,
                  }}
                  style={{margin:5}}
                />
              </Left>
              </TouchableOpacity>
              <Body>
                <CustomText
                  content={this.props.profile.unl_name + " " + this.props.profile.unl_surname}
                />
                <CustomText note={true} content={this.props.profile.unl_tagline} />
                {
                    this.props.profile.unl_date_added ?
                    <CustomText note={true} content={"Date Joined: " + moment(this.props.profile.unl_date_added).format("DD MMMM YYYY")} style={{fontSize:12}} />
                    :
                    null
                }
              </Body>
            </ListItem>
            <DisplayImage ref = "imageViewer"/>
          </List>
        );
    }
}

export default ProfileCard;