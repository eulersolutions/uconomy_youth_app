import React, { Component } from 'react';
import Requests from '../../api/Requests';
import Spinner from '../../components/Spinner';
import Global from '../../constants/Global';
import {View, Image,TouchableOpacity} from 'react-native';
import CustomText from '../../components/CustomText';
import MessageDialog from '../../components/Dialog';
import {Body,Card,CardItem,Left,Right,Button,Form,Textarea,Item, Content,List,ListItem,Thumbnail} from 'native-base';
import ProfileCard from '../../components/ProfileCard';
import Modal from 'react-native-modal';
import ValidationComponent from "react-native-form-validator";

class ViewPostScreen extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = { 
            token: '',
            isLoading: false,
            postId: '',
            post: '',
            isModalVisible: false,
            comment_content: ''
    
    };
    }

    componentDidMount() {
      /**
       * Gets the ID of the selected post from the route params,
       * passes it to the endpoint, and receives a post to be rendered.
       */
        const {postId} = this.props.route.params;
        this.setState({token:Global.token,postId:postId}, () => {
            this.retrievePostData();
        });
    }

    showModal = () => {
        this.setState({isModalVisible: true})
    } 

    hideModal = () => {
        this.setState({isModalVisible:false})
    }

    parseItem = (item) => {
        return JSON.parse(item)
    }

    createComment = () => {
      this.validate({
        comment_content: {required: true}
      });
      if (this.isFormValid()) {
        let formData = {
          comment_content: this.state.comment_content,
          post_id: this.state.postId
        }
        this.setState({ isLoading: true }, () => {
        Requests.createPostComment(this.state.token, formData)
          .then((response) => {
            if (response.data.success) {
              this.setState({ isLoading: false});
              this.refs.dialog.showAlert("Success", response.data.message);
              this.hideModal();
              this.retrievePostData();
            } else {
              this.setState({ isLoading: false });
              this.refs.dialog.showAlert("Error", response.data.message);
              this.hideModal();
              return;
            }
          })
          .catch((error) => {
            this.setState({ isLoading: false });
            if (error.response) {
              // Server Error
              console.log(error.response.data);
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
  }
  

    retrievePostData = () => {
        this.setState({ isLoading: true }, () => {
            Requests.retrieveFeedPost(this.state.token,this.state.postId)
              .then((response) => {
                if (response.data.success) {
                  this.setState({ isLoading: false,post:response.data.data});
                  console.log(response.data.data);
                  console.log(response.data.data['unl_feed_posted_by'])
                } else {
                  this.setState({ isLoading: false });
                  this.refs.dialog.showAlert("Error", response.data.message);
                  return;
                }
              })
              .catch((error) => {
                this.setState({ isLoading: false });
                if (error.response) {
                  // Server Error
                  console.log(error.response.data);
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
            })
    }

    render() {
        const {isLoading,post,isModalVisible} = this.state;
        if (isLoading) {
            return (
                <Spinner/>
            )
        }else {
            return (
            <View style={{flex:1}}>
                <Content>
                {
                post ? <ProfileCard profile={post.unl_feed_posted_by}/> : null
                }
                <Card>
            <CardItem>
              <Body>
                <CustomText note={true} content={post.unl_feed_post_body} style={{textAlign:'center'}}/>
              </Body>
            </CardItem>
            {
                post.unl_feed_post_image && (
                <CardItem cardBody>
                    <Image source={{uri: `https://youth.uconomy.co.za:8000${post.unl_feed_post_image}`}} style={{height: 200, width: null, flex: 1}}/>
                  </CardItem>
                )
            }
            <CardItem>
              <Left>
                <View style={{flex:1,flexDirection:'row',flexWrap:'wrap'}}>
                    {
                        post.unl_feed_post_tags && this.parseItem(post.unl_feed_post_tags).map(item => (
                            <CustomText key={Global.getKey()} note={true} content={item.name}/>
                        ))
                    }
                  
                </View>
              </Left>
              <Right>
                <CustomText note={true} content={post.unl_feed_post_date}/>
              </Right>
            </CardItem>

          </Card>
          {
            !post.unl_feed_admin_post ?
            <View>
            <View style={{flex:1,justifyContent:'space-between',flexDirection:'row'}}>
            <CustomText content={"Comments"} style={{fontSize:22,margin:10}}/>
            <Button transparent onPress={()=> {this.showModal()}}>
                  <CustomText content="Leave a comment"/>
            </Button>
            </View>
            
            <View style={{borderBottomColor: 'lightgrey',borderBottomWidth: 1,margin:10}}/>
            { post.unl_feed_comments &&
                !post.unl_feed_comments.length ? 
                <CustomText note={true} content="No Comments Yet" style={{textAlign:'center'}}/>
                :
                null
              }
            <List>
                { post.unl_feed_comments &&
                    post.unl_feed_comments.map(comment => (
          <ListItem key={String(comment.id)} avatar itemDivider={false}>
            <Left>
              <Thumbnail small source={{ uri:  `https://youth.uconomy.co.za:8000${comment.unl_comment_by.unl_avatar}` }} />
            </Left>
            <Body>
              <TouchableOpacity onPress={() => {this.props.navigation.navigate('ViewUserProfile',{userId:comment.unl_comment_by.unl_num})}}>
              <CustomText content ={comment.unl_comment_by.unl_name + ' ' + comment.unl_comment_by.unl_surname} style={{color:'deepskyblue'}}/>
              <CustomText note={true} content ={comment.unl_comment_content}/>

              </TouchableOpacity>
            </Body>
            <Right>
              <CustomText note={true} content ={comment.unl_comment_date}/>
            </Right>
          </ListItem>
                    ))
                }
          
        </List>
        </View>
        :
        null
          }

                
          <Modal isVisible={this.state.isModalVisible} backdropOpacity={0.95} hasBackdrop={true} backdropColor='ghostwhite'>
          <View style={{flex: 1,justifyContent:'center'}}>
          { post ? <ProfileCard profile={post.unl_feed_posted_by}/> : null}
          <Form>
            <View>
          <Item error={this.isFieldInError("comment_content")}>
            <Textarea rowSpan={5} bordered placeholder="Leave a comment of your own..." 
              onBlur={() => {
                this.validate({
                  comment_content: { required: true, maxLength:200 },
                });
              }}
              ref="comment_content"
              onChangeText={(val) => {
                this.setState({ comment_content: val });
              }}
              style={{
                fontFamily: "Noto",
                color: "grey",
                borderRadius: 10,
                width: "95%",
                margin: 5,
              }}
            />
          </Item>
          </View>
          {this.isFieldInError("comment_content") && (
                      <CustomText
                        style={{
                          fontSize: 12,
                          color: "red",
                          textAlign: "center",
                        }}
                        content={"You must provide a comment"}
                      />
                    )}
          </Form>
          <View style={{flex:1,flexDirection:'column',margin:10}}>
          <Button primary block rounded 
          onPress={() => {this.createComment()}}
          disabled={!this.isFormValid()}
          >
                  <CustomText content="Comment"/>
            </Button>
            <Button transparent block rounded onPress={() => {this.hideModal()}}>
                  <CustomText content="Cancel"/>
            </Button>
          </View>

          </View>
        </Modal>  
                <View>
                <MessageDialog ref = "dialog"/> 
                </View>
                </Content>
            </View>
                );
        }

    }
}

export default ViewPostScreen;