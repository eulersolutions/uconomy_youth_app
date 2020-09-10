import React, { Component } from 'react';
import {View} from 'react-native';
import {List, ListItem, Body, Right, Icon, Content} from 'native-base'
import CustomText from '../../components/CustomText';
import Spinner from '../../components/Spinner';
import Requests from '../../api/Requests';
import Global from '../../constants/Global';
import MessageDialog from '../../components/Dialog';
import * as Linking from "expo-linking";

class DocumentsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            documents: '',
            isLoading: false,
            token: ''
         };
    }

    componentDidMount() {
        this.setState({token:Global.token},() => {this.getDocuments()})
    }

    getDocuments() {
        this.setState({isLoading:true},() => {
            Requests.retrieveKnowledgeDocuments(this.state.token)
            .then((response) => {
                if (response.data.success) {
                  this.setState({ isLoading: false, documents: response.data.data });
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
        const {documents,isLoading} = this.state;
        if (isLoading) {
            return (
                <Spinner/>
            )
        } else {
            return (
                    <Content>
                    <List>
                        <ListItem itemHeader first key={Global.getKey()}>
                            <CustomText content="Documents uploaded by admins"/>
                        </ListItem>
                        {
                            documents ?
                            documents.length > 1 ?
                            documents.map(item => (
                                <ListItem key={Global.getKey()} onPress={() => {
                                    Linking.openURL(
                                      `https://youth.uconomy.co.za:8000${item.unl_document}`
                                    ).catch((err) =>
                                      console.error("Couldn't load page", err)
                                    );
                                  }}>
                                <Body>
                                    <CustomText content={item.unl_document_name}/>
                                    <CustomText note={true} content={item.unl_document_description}/>
                                    <CustomText note={true} content={item.unl_document_viewed_by.length+' Views'}/>
                                </Body>
                                <Right>
                                    <View style={{flexDirection:'column',alignItems:'center'}}>
                                    <CustomText note={true} content={item.unl_document_upload_date}/>
                                    <Icon type="AntDesign" name="caretright"/>
                                    </View>
                                </Right>
                            </ListItem>
                            ))
                            :
                            null
                            :
                            null
                        }

    
                    </List>
                    <MessageDialog ref = "dialog"/>
                    </Content>
                    

            );
        }

    }
}

export default DocumentsScreen;