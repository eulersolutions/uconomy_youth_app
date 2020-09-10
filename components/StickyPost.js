import React, { Component } from 'react';
import {Image} from 'react-native';
import {View,Card, CardItem,Icon, Left, Body, Right } from 'native-base';
import CustomText from '../components/CustomText';
import MessageDialog from '../components/Dialog';
import Global from '../constants/Global';
import Divider from './Divider';
import moment from 'moment';


class StickyPost extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            clicked: null,
            isLoading: false,
            token: ''
         };
    }

    componentDidMount() {
      this.getData();
    }

    getData = async () => {
      this.setState({token:Global.token})
    }

    render() {
        const item = this.props.content;
        const {isLoading} = this.state;

        return (
        <Card>
            <CardItem>
              <Left>
                <Body>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignContent:'center'}}>
                      <Icon type='AntDesign' name='notification' style={{color:'lime',fontSize:20}}/>
                  <CustomText  content="Uconomy Youth Admin" style={{fontSize:13,color:'deepskyblue',textAlign:'center'}}/>
                  </View>
                </Body>
              </Left>
            </CardItem>
            <Divider/>
            {
                item.unl_feed_post_image ? 
                <CardItem cardBody>
                <Image source={{uri: `https://youth.uconomy.co.za:8000${item.unl_feed_post_image}`}} style={{height: 200, width: null, flex: 1}}/>
              </CardItem> :
              null
            }

            <CustomText content={item.unl_feed_post_body} style={{fontSize:11,margin:10}}/>
            <CardItem style={{flex:1,justifyContent:"space-evenly"}}>

              <Right>
                <CustomText note={true} content = {moment(item.unl_feed_post_date).format("DD MMMM YYYY")}/>
              </Right>
            </CardItem>
            <MessageDialog ref = "modal"/>
          </Card>
        );
      
    }
}

export default StickyPost;