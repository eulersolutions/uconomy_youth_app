import React, { Component } from "react";
import {
  Tabs,
  Tab,
  Content,
  Card,
  CardItem,
  Right,
  List,
  ListItem,
  Body,
  Button,
  Icon,
  Form,
  Item,
  Label,
  Input,
  Header,
  Title
} from "native-base";
import { View, StyleSheet, Image } from "react-native";
import CustomText from "./CustomText";
import FeedPost from "./FeedPost";
import * as Linking from "expo-linking";
import Global from "../constants/Global";
import { BallIndicator } from "react-native-indicators";
import Requests from "../api/Requests";
import MessageDialog from "../components/Dialog";
import Modal from 'react-native-modal';
import * as DocumentPicker from 'expo-document-picker';
import EducationHistory from "./EducationHistory";
import WorkHistory from "./WorkHistory";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      isLoading: false,
      isModalVisible: false,
      document: '',
      documentName: '',
      documentFileName: '',
      posts: '',
      documents: ''
    };
  }

  componentDidMount() {
    this.setState({ token: Global.token }, () => {
      this.retrievePostHistory();
      this.retrieveDocuments();
    });
  }

  retrievePostHistory = () => {
    this.setState({ isLoading: true }, () => {
        Requests.retrievePostHistory(this.state.token)
          .then((response) => {
            if (response.data.success) {
              this.setState({ isLoading: false,posts:response.data.data});
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

retrieveDocuments = () => {
  this.setState({ isLoading: true }, () => {
      Requests.retrieveDocuments(this.state.token)
        .then((response) => {
          if (response.data.success) {
            this.setState({ isLoading: false,documents:response.data.data});
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

  showModal = () => {
    this.setState({isModalVisible: true})
} 

hideModal = () => {
    this.setState({isModalVisible:false})
}


pickDocument = async () => {
  try {
    let result = await DocumentPicker.getDocumentAsync({
      multiple: false
    })
    if (!result.cancelled) {
      this.setState({ document: result.uri,documentFileName:result.name });
    }

    console.log(result);
  } catch (E) {
    console.log(E);
  }
};

  parseItem = (item) => {
    return JSON.parse(item);
  };

  uploadDocument = () => {
    const {document,documentName} = this.state;
    const formValues = {
      document: document,
      documentName: documentName
    }

    this.setState({ isLoading: true }, () => {
      Requests.uploadDocument(this.state.token,formValues)
        .then((response) => {
          if (response.data.success) {
            this.setState({ isLoading: false});
            this.refs.dialog.showAlert("", response.data.message);
            this.retrieveDocuments();
            this.hideModal();
            
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
      })

    
  }

  deletePost = (postId) => {
    this.setState({ isLoading: true }, () => {
      Requests.deletePost(this.state.token, postId)
        .then((response) => {
          if (response.data.success) {
            this.setState({ isLoading: false });
            this.refs.dialog.showAlert("", response.data.message);
            this.retrievePostHistory();
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
    });
  };

  render() {
    const { isLoading,isModalVisible,documentFileName,posts,documents } = this.state;
    return (
      <Tabs>
        <Tab heading="About">
          <Content>
            <MessageDialog ref="dialog" />

            <View style={{ flex: 1, flexDirection: "column", margin: 10 }}>
              <CustomText
                content={"About " + this.props.profile.unl_name}
                style={{ fontSize: 24, margin: 5,color:'darkslategrey' }}
              />
              <CustomText
                content={this.props.profile.unl_about}
                style={styles.historyValueStyle}
              />
            </View>
            <Card>
              <CardItem header bordered>
                <CustomText content="Basic Information" />
              </CardItem>
              <CardItem bordered style={{ justifyContent: "space-between" }}>
                <CustomText content="Full Name" />
                <Right>
                  <CustomText
                    note={true}
                    content={
                      this.props.profile.unl_name +
                      " " +
                      this.props.profile.unl_surname
                    }
                  />
                </Right>
              </CardItem>
              <CardItem bordered style={{ justifyContent: "space-between" }}>
                <CustomText content="Gender" />
                <Right>
                  <CustomText
                    note={true}
                    content={this.props.profile.unl_gender}
                  />
                </Right>
              </CardItem>
              <CardItem bordered style={{ justifyContent: "space-between" }}>
                <CustomText content="Email" style={{ textAlign: "right" }} />
                <Right>
                  <CustomText
                    note={true}
                    content={this.props.profile.unl_email}
                    style={{ textAlign: "right" }}
                  />
                </Right>
              </CardItem>
              <CardItem bordered style={{ justifyContent: "space-between" }}>
                <CustomText content="Cell" />
                <Right>
                  <CustomText
                    note={true}
                    content={this.props.profile.unl_mobile}
                  />
                </Right>
              </CardItem>
              <CardItem bordered style={{ justifyContent: "space-between" }}>
                <CustomText content="Disability" />
                <Right>
                  <CustomText
                    note={true}
                    content={this.props.profile.unl_disability}
                  />
                </Right>
              </CardItem>
              <CardItem bordered style={{ justifyContent: "space-between" }}>
                <CustomText content="Race" />
                <Right>
                  <CustomText
                    note={true}
                    content={this.props.profile.unl_race}
                  />
                </Right>
              </CardItem>
              <CardItem bordered style={{ justifyContent: "space-between" }}>
                <CustomText content="Highest NQF Level" />
                <Right>
                  <CustomText
                    note={true}
                    content={this.props.profile.unl_highest_nqf_level}
                  />
                </Right>
              </CardItem>
              <CardItem bordered style={{ justifyContent: "space-between" }}>
                <CustomText content="Location" />
                <Right>
                  <CustomText
                    note={true}
                    content={this.props.profile.unl_location}
                  />
                </Right>
              </CardItem>
            </Card>

            <Card>
              <CardItem header bordered>
                <CustomText content="Traits" />
              </CardItem>
              <CardItem bordered>
                {this.props.profile.unl_personal_skills &&
                  this.parseItem(
                    this.props.profile.unl_personal_skills
                  ).map((item) => (
                    <View style= {{ margin: 2, borderRadius:10, borderColor:'deepskyblue',borderWidth:1}} key={Global.getKey()}>
                    <CustomText
                      note={true}
                      content={item}
                      style={{padding:2}}
                    />
                    </View>

                  ))}
              </CardItem>
            </Card>
            <Card>
              <CardItem header bordered>
                <CustomText content="Skills" />
              </CardItem>
              <CardItem bordered>
                {this.props.profile.unl_professional_skills &&
                  this.parseItem(
                    this.props.profile.unl_professional_skills
                  ).map((item) => (
                    <View style= {{ margin: 2, borderRadius:10, borderColor:'deepskyblue',borderWidth:1}} key={Global.getKey()}>

                    <CustomText
                      style={{ margin: 2 }}
                      note={true}
                      key={Global.getKey()}
                      content={item}
                      style={{padding:2}}
                    />
                    </View>
                  ))}
              </CardItem>
            </Card>
          </Content>
        </Tab>
        <Tab heading="History">
          <Content>
            <List>
              <ListItem itemHeader key={Global.getKey()}>
                <CustomText note={true} content="Work Experience" />
              </ListItem>
              {this.props.profile.unl_work_experience &&
                this.parseItem(this.props.profile.unl_work_experience).map(
                  (item) => (
                    <WorkHistory key={Global.getKey()} item={item}/>
                  )
                )}
              <ListItem itemHeader key={Global.getKey()}>
                <CustomText note={true} content="Education" />
              </ListItem>
              {this.props.profile.unl_education &&
                this.parseItem(this.props.profile.unl_education).map((item) => (
                  <EducationHistory key={Global.getKey()} item={item}/>
                ))}
            </List>
          </Content>

        </Tab>

        {/* JSX Expressions must have a parent element, so we cant have two tabs together without
                  a wrapper element. Unfortunately this means we have to create two separate instances
                  of a tab at each time. Sorry. 😢 */}

        {this.props.isOwnProfile ? (
          <Tab heading="Posts">
            <Content>
              {!posts.length ? 
                  <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'column',margin:20}}>
                  <CustomText
                  note={true}
                    style={{ textAlign: "center"}}
                    content="You do not have any posts"
                  />
                  <Icon type="AntDesign" name="meh" style={{fontSize:80,color:'lightgrey'}}/>
                  </View>
              : null}
              {posts &&
                posts.map((post) => (
                  <View key={Global.getKey()}>
                    <FeedPost navigation={this.props.navigation} content={post} />

                    <Button
                      iconLeft
                      transparent
                      block
                      onPress={() => {
                        this.deletePost(post.id);
                      }}
                    >
                      {isLoading ? (
                        <BallIndicator  color='lightgrey' size={30} />
                      ) : (
                        <CustomText content="Delete post" />
                      )}
                    </Button>
                  </View>
                ))}
            </Content>
          </Tab>
        ) : null}
        {this.props.isOwnProfile && (
          <Tab heading="Documents">
            <Content>
              <View style={{margin:10}}>
                <CustomText
                note={true}
                style={{ textAlign: "center" }}
                content="Only Uconomy Youth Administrators can see any documentation you upload"
              />
                    <Button small info rounded block onPress={() => {this.showModal()}}>
                      <CustomText
                        content="Upload A Document"
                      />
                    </Button>
              </View>

          <Modal isVisible={isModalVisible} coverScreen={true} backdropOpacity={0.95} hasBackdrop={true} backdropColor='ghostwhite'>
          <Header>
          <Body>
            <Title style={{fontFamily:'Noto',fontSize:18,fontWeight:'bold'}}>Upload a document</Title>
          </Body>
          <Right>
            <Button transparent>
              <CustomText content="Cancel"/>
            </Button>
          </Right>
        </Header>
        
        <View style={{flex:1,flexDirection:'column',justifyContent:'space-between'}}>


        <View style={{flex:1,justifyContent:'center'}}>
            <Form>
              <Item stackedLabel>
                <Label>
                  <CustomText content="Choose a document:"/>
                </Label>
                <Button transparent onPress={()=> {this.pickDocument()}}>
                  <Icon type="AntDesign" name='camerao'/>
                  <CustomText content="Choose"/>
                </Button>
              </Item>
              { documentFileName ?
                    <CustomText note={true} content={documentFileName}/>
                  :
                  null
                }
              <Item stackedLabel>
                <Label>
                  <CustomText content="Provide a name for this document:"/>
                </Label>
                <Input onChangeText={(val)=> {this.setState({documentName:val})}} style={{fontFamily:'Noto',color:'gray',fontSize:14}} placeholder="Enter a document name"/>
              </Item>
            </Form>
            </View>
            <View style={{flex:1,flexDirection:'column'}}>
            <Button block primary rounded onPress={()=> {this.uploadDocument()}}>
             {
               isLoading ?
               <BallIndicator color='lightgrey' size={30} /> :
             <CustomText content="Upload"/>
             }
            </Button>
            <Button block transparent onPress={()=> {this.hideModal()}}>
            <CustomText content="Cancel"/>
            </Button>
            </View>
            </View>
        </Modal>
              <List>
                <ListItem itemHeader key={Global.getKey()}>
                  <Body>
                    <CustomText
                      note={true}
                      content="My Documents"
                    />
                  </Body>
                </ListItem >
                {!documents.length ? (
                  <Card
                    style={{
                      height: 200,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CustomText
                    note={true}
                      style={{ textAlign: "center", marginBottom: 15 }}
                      content="You do not have any documents."
                    />
                    <Icon type="AntDesign" name="meh" style={{fontSize:80,color:'lightgrey'}}/>

                  </Card>
                ) : null}
                {documents &&
                  documents.map((item) => (
                    <ListItem
                    key={Global.getKey()}
                      onPress={() => {
                        Linking.openURL(
                          `https://youth.uconomy.co.za:8000${item.unl_document}`
                        ).catch((err) =>
                          console.error("Couldn't load page", err)
                        );
                      }}
                    >
                      <Body>
                        <CustomText content={item.unl_document_name} />
                        <CustomText
                          note={true}
                          content={item.unl_upload_date}
                        />
                      </Body>
                      <Right>

                        <Icon type="AntDesign" name="caretright" style={{fontSize:12}}/>
                      </Right>
                    </ListItem>
                  ))}
              </List>
            </Content>
          </Tab>
        )}
      </Tabs>
    );
  }
}

const styles = StyleSheet.create({
  fieldStyle: {
    fontSize: 22,
    textAlign: "center",
  },
  fieldValueStyle: {
    fontSize: 14,
    color: "darkgrey",
    textAlign: "center",
  },
  historyValueStyle: {
    fontSize: 14,
    color: "darkgrey",
    margin: 5,
  },
  tabHeadingStyle: {},
  tabStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Noto",
    color: "ghostwhite",
    fontSize: 13,
  },
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 35,
    backgroundColor: "#ffffff",
  },
  HeadStyle: {
    height: 50,
    alignContent: "center",
    backgroundColor: "#ffe0f0",
  },
  TableText: {
    margin: 10,
    fontFamily: "Noto",
    textAlign: "center",
  },
});

export default UserProfile;
