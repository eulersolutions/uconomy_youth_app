import React, { Component } from "react";
import {View, Image } from "react-native";
import Modal from 'react-native-modal';
import {
  Header,
  Content,
  Form,
  Item,
  Textarea,
  Body,
  Right,
  Title,
} from "native-base";
import CustomText from "./CustomText";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Button, Icon } from "native-base";
import TagInput from "react-native-tags-input";
import ValidationComponent from "react-native-form-validator";
import Requests from "../api/Requests";
import MessageDialog from "./Dialog";
import {
  BallIndicator
} from 'react-native-indicators';
import Global from "../constants/Global";
import ProfileCard from "./ProfileCard";

class CreatePostModal extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      image: null,
      isLoading: false,
      token: "",
      profile: "",
      unl_feed_post_body: "",
      tags: {
        tagsArray: [],
      },
    };
  }
  // https://github.com/gayucode/react-native-chip-input#readme

  updateTagState = (state) => {
    this.setState({
      tags: state,
    });
  };

  componentDidMount() {
    this.getPermissionAsync();
    this.getData();
  }

  getData = async () => {
    this.setState({token:Global.token},() => {this.getUserProfile()})
  };

  getUserProfile() {
    this.setState({ isLoading: true }, () => {
      Requests.retrieveUserProfile(this.state.token)
        .then((response) => {
          if (response.data.success) {
            this.setState({ isLoading: false, profile: response.data.data });
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

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  formatTags = () => {
    const {tags} = this.state;
    
    let taglist = []
    tags.tagsArray.map(item => {
      let tagObject = {}
      tagObject['name'] = item
      taglist.push(tagObject);
    })
    return JSON.stringify(taglist);
  }

  createFeedPost = () => {
    this.validate({
      unl_feed_post_body: {required: true}
    });
    if (this.isFormValid()) {
      var formData = {
        unl_feed_post_body: this.state.unl_feed_post_body,
        unl_feed_post_image: this.state.image ? this.state.image : null,
        unl_feed_post_tags: this.formatTags()
      }
      this.setState({ isLoading: true }, () => {
      Requests.createFeedPost(this.state.token, formData)
        .then((response) => {
          if (response.data.success) {
            this.setState({ isLoading: false});
            this.refs.dialog.showAlert("Success", response.data.message);
            this.hideModal();
            this.getData();
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



  };

  render() {
    const { modalVisible, image, isLoading, profile } = this.state;
      return (
        <View style={{ flex: 1 }}>

          <MessageDialog ref="dialog" />
          <Modal isVisible={modalVisible} coverScreen={true} backdropOpacity={0.95} hasBackdrop={true} backdropColor='ghostwhite'
          >

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignContent: "center",
              }}
            >
          <Header style={Constants.platform.ios ? {backgroundColor:'ghosthwite'} : null } >
          <Body>
            <Title style={{fontFamily:'Noto',fontSize:18,fontWeight:'bold'}}>Create A Post</Title>
          </Body>
          <Right>
            <Button transparent>
              <CustomText content="Cancel"/>
            </Button>
          </Right>
        </Header>
              <ProfileCard profile={profile}/>
              <Content>
                <Form>
                  <View>
                    <CustomText
                      content={"What do you want to talk about?"}
                      style={{
                        color: "gray",
                        fontSize: 18,
                        textAlign: "center",
                      }}
                    />
                    <Item error={this.isFieldInError("unl_feed_post_body")}>
                      <Textarea
                        bordered
                        rowSpan={5}
                        style={{
                          fontFamily: "Noto",
                          color: "grey",
                          borderRadius: 10,
                          width: "95%",
                          margin: 5,
                        }}
                        onBlur={() => {
                          this.validate({
                            unl_feed_post_body: { required: true },
                          });
                        }}
                        ref="unl_feed_post_body"
                        onChangeText={(val) => {
                          this.setState({ unl_feed_post_body: val });
                        }}
                      />
                    </Item>
                    {this.isFieldInError("unl_feed_post_body") && (
                      <CustomText
                        style={{
                          fontSize: 12,
                          color: "red",
                          textAlign: "center",
                        }}
                        content={"You must provide a body for your post"}
                      />
                    )}
                  </View>
                  <View style={{ margin: 10 }}>
                    <CustomText
                      content={"Attach an image (Optional)"}
                      style={{ color: "gray", margin: 10 }}
                    />
                    <Button
                      primary
                      rounded
                      onPress={() => {
                        this._pickImage();
                      }}
                      style={{ alignSelf: "center" }}
                    >
                      <CustomText content={"Choose an image"} />
                    </Button>
                  </View>

                  {image && (
                    <Image
                      source={{ uri: image }}
                      style={{ width: 200, height: 200, alignSelf: "center" }}
                    />
                  )}
                  <View style={{ margin: 10 }}>
                    <CustomText
                      content={"Provide tags for this post"}
                      style={{ color: "gray", margin: 10 }}
                    />
                    <CustomText note={true} content = "Press space after capturing a tag"/>
                    <TagInput
                      updateState={this.updateTagState}
                      tags={this.state.tags}
                      placeholder="Enter a hashtag..."
                      inputStyle={{ fontFamily: "Noto", borderColor: "red" }}
                      labelStyle={{
                        fontFamily: "Noto",
                        color: "darkslategrey",
                      }}
                      tagStyle={{ backgroundColor: "lightgrey" }}
                      tagTextStyle={{ fontFamily: "Noto" }}
                      containerStyle={{ borderColor: "yellow" }}
                      inputContainerStyle={{
                        borderColor: "lightgrey",
                        borderWidth: 1,
                        borderRadius: 15,
                      }}
                    />
                  </View>
                </Form>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-evenly",
                    flexDirection: "column",
                    margin: 10,
                  }}
                >
                  <Button
                    primary
                    disabled={!this.isFormValid()}
                    rounded
                    block
                    onPress={() => {this.createFeedPost()
                    }}
                  >
                    {
                    isLoading ?
                    <BallIndicator  color='lightgrey' size={30} />
                    :
                    <CustomText content="Save" />

                  }
                  </Button>

                  <Button
                    primary
                    transparent
                    rounded
                    block
                    onPress={() => {
                      this.hideModal();
                    }}
                  >
                    <CustomText content="Cancel" />
                  </Button>
                </View>
              </Content>
            </View>
          </Modal>
        </View>
      );
    
  }
}

export default CreatePostModal;
