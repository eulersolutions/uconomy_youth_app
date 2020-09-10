import React, { Component } from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {ActionSheet, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right } from 'native-base';
import CustomText from '../components/CustomText';
import Requests from '../api/Requests';
import MessageDialog from '../components/Dialog';
import Spinner from '../components/Spinner';
import Global from '../constants/Global';
import Divider from './Divider';
import moment from 'moment';
import DisplayImage from './DisplayImage';

var BUTTONS = ["Offensive", "Spam", "Targeted Abuse Or Harrassment", "Requiring Administrator Intervention", "Cancel"];
var CANCEL_INDEX = 4;

class FeedPost extends Component {
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

    reportPost = (reason,postId) => {
      if (reason == 'Cancel'){
        return;
      }
      const data = new FormData()
      data.append('post_id', postId);
      data.append('report_reason',reason);

      this.setState({ isLoading: true }, () => {
        Requests.reportFeedPost(this.state.token,data)
          .then((response) => {
            if (response.data.success) {
              this.setState({ isLoading: false});
              this.refs.dialog.showAlert("Success", response.data.message);
            } else {
              this.setState({ isLoading: false });
              this.refs.dialog.showAlert("Error", response.data.error);
              return;
            }
          })
          .catch((error) => {
            this.setState({ isLoading: false });
            if (error.response) {
              // Server Error
              // console.log(error.response.data);
              this.refs.dialog.showAlert(
                "Whoops!",
                "Something went wrong. Please try again later."
              );
              // console.log(error.response.status);
              // console.log(error.response.headers);
            } else if (error.request) {
              // Something else that's fucked up happened
              this.refs.dialog.showAlert(
                "Unable to connect with the server",
                "Please check your internet connection and try again."
              );
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }
          });
      });
    }
    render() {
        const item = this.props.content;
        const {isLoading} = this.state;
        if (isLoading) {
          return (
            <Spinner/>
          )
        }else {

        
        return (
        <Card>
            <CardItem>
              <Left>
                <TouchableOpacity onPress={() => {this.refs.imageViewer.showModal(item.unl_feed_posted_by.unl_avatar)}}>
                <Thumbnail source={{uri: `https://youth.uconomy.co.za:8000${item.unl_feed_posted_by.unl_avatar}`}} />
                </TouchableOpacity>
                <Body>
                  <TouchableOpacity onPress={() => {this.props.navigation.navigate('ViewUserProfile',{userId:item.unl_feed_posted_by.unl_num})}}>
                  <CustomText  content={item.unl_feed_posted_by.unl_name + ' ' + item.unl_feed_posted_by.unl_surname} style={{fontSize:13,color:'deepskyblue'}}/>
                  <CustomText note={true} content={item.unl_feed_posted_by.unl_tagline} style={{fontSize:11}}/>
                  </TouchableOpacity>
                </Body>
              </Left>
              <TouchableOpacity onPress={() =>
            ActionSheet.show(
              {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                title: "Provide a reason to report this post"
              },
              buttonIndex => {
                this.reportPost(BUTTONS[buttonIndex],item.id)
              }
            )}>
                <CustomText note={true} content="Report" style={{fontSize:10}}/>
              </TouchableOpacity>
            </CardItem>
            <Divider/>
            {
                item.unl_feed_post_image ? 
                <TouchableOpacity onPress={() => {this.refs.imageViewer.showModal(item.unl_feed_post_image)}}>
                <CardItem cardBody>
                <Image source={{uri: `https://youth.uconomy.co.za:8000${item.unl_feed_post_image}`}} style={{height: 200, width: null, flex: 1}}/>
              </CardItem>
              </TouchableOpacity>
               :
              null
            }

            <CustomText content={item.unl_feed_post_body} style={{fontSize:11,margin:10}}/>
            <CardItem style={{flex:1,justifyContent:"space-evenly"}}>
              <Left>
                <Button transparent onPress={() => {this.props.navigation.navigate('ViewPost',{postId:item.id})}}>
                  <Icon active name="chatbubbles" style={{color:'deepskyblue'}} />
                  <CustomText content = {item.unl_feed_comments.length + ' Comments'} style={{color:'deepskyblue'}}/>
                </Button>
              </Left>
              <Right>
                <CustomText note={true} content = {moment(item.unl_feed_post_date).format("DD MMMM YYYY")}/>
              </Right>
            </CardItem>
            <MessageDialog ref = "dialog"/>
            <DisplayImage ref = "imageViewer"/>
          </Card>
        );
      }
    }
}

export default FeedPost;