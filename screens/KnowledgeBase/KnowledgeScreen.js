import React, { Component } from 'react';
import {View} from 'react-native';
import CustomText from '../../components/CustomText';
import { Input, Form, Item,Thumbnail, Content, List, ListItem, Body } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Spinner from '../../components/Spinner';
import Global from '../../constants/Global';
import MessageDialog from '../../components/Dialog';
import Requests from '../../api/Requests';

class KnowledgeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            isLoading: false,
            token: '',
            faqs: '',
            result: ''
         };
    }

    componentDidMount() {
        this.setState({token:Global.token}, () => {
            this.retrieveFaq();

        })
    }

    retrieveFaq = () => {
        this.setState({isLoading:true},() => {
            Requests.retrieveFaq(this.state.token)
            .then((response) => {
                if (response.data.success) {
                  this.setState({ isLoading: false, faqs: response.data.data });
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

    searchFaq = (val) => {
        let result = this.state.faqs.filter(item => {
            return item.unl_faq_question.toLowerCase().includes(val.toLowerCase());
          });
          this.setState({
              result:result
          })
    }

    render() {
        const {isLoading,result} = this.state;
        if (isLoading) {
            return (
                <Spinner/>
            )
        } else {
            return (
                <View style={{flex:1,justifyContent:'center'}}>
                    <Content>
                    <View style={{flex:1,flexDirection:'column',margin:10,justifyContent:'space-evenly'}}>
                    <CustomText content="Have any questions you need answered?" style={{textAlign:'center'}}/>
                    <CustomText note={true} content="Use the search bar below for more information." style={{textAlign:'center'}}/>
                    <Form>
                        <Item>
                        <Input placeholder="Search keywords e.g 'Account'" 
                        onChangeText={(val)=> {this.searchFaq(val)}}
                        style={{width:'100%',textAlign:'center',fontFamily:'Noto'}}/>
                        </Item>
                    </Form>
                    <List>

                        {result ?
                        
                        result.length > 1 ?
                        
                        result.map(item => (
                            <ListItem key={Global.getKey()}>
                                <Body>
                                <CustomText content={item.unl_faq_question}/>
                            <CustomText note={true} content={item.unl_faq_answer}/>

                                </Body>
                            </ListItem>
                        )) 
                        :
                        <CustomText content="No matching FAQ"/>
                        :
                        null
                    }
                    </List>
                    <View style={{flex:1,justifyContent:"space-evenly",flexDirection:'row',marginTop:30}}>
                        <TouchableOpacity style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',margin:30}} onPress={() => {this.props.navigation.navigate('Documents')}}>
                            <Thumbnail 
                            square
                            source={require('../../assets/img/news.png')}
                            style={{alignSelf:'center',resizeMode:'contain'}}
                            />
                            <CustomText content="Documents"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',margin:30}} onPress={() => {this.props.navigation.navigate('Blogs')}}>
                            <Thumbnail 
                            square
                            source={require('../../assets/img/blog.png')}
                            style={{alignSelf:'center',resizeMode:'contain'}}
                            />
                            <CustomText content="Blogs"/>
                        </TouchableOpacity>
                    </View>
                    </View>
                    
                    <MessageDialog ref = "dialog"/>
                    </Content>
                </View>
            );
        }

    }
}

export default KnowledgeScreen;