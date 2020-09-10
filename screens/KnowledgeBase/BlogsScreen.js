import React, { Component } from 'react';
import { Image } from 'react-native';
import {Card, CardItem, Left, Body } from 'native-base';
import Spinner from '../../components/Spinner';
import Global from '../../constants/Global';
import Requests from '../../api/Requests';
import MessageDialog from '../../components/Dialog';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import CustomText from '../../components/CustomText';
import moment from 'moment';

class BlogsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            isLoading: false,
            token: '',
            blogs: []
         };
    }

    componentDidMount() {
        this.setState({token:Global.token},() => {
            this.getblogs();
        })
    }

    getblogs = () => {
        this.setState({isLoading:true},() => {
            Requests.retrieveBlogs(this.state.token)
            .then((response) => {
                if (response.data.success) {
                  this.setState({ blogs: response.data.data,isLoading: false});
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
        const {isLoading,blogs} = this.state;
        const renderItem = ({item}) => (
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('ViewBlog',{blogId:item.id})}}>
                       <Card style={{flex: 0}}>
                     <CardItem bordered>
                       <Left>
                         <Body>
                             <CustomText note={true} content={item.unl_blog_title} style={{color:'deepskyblue'}}/>
                           <CustomText content={moment(item.unl_blog_date).format("DD MMMM YYYY")}/>
                         </Body>
                       </Left>
                     </CardItem>
                     <CardItem bordered>
                       <Body>
                         <Image source={{uri: `https://youth.uconomy.co.za:8000${item.unl_blog_image}`}} style={{height: 200, width: 400, resizeMode:'contain', alignSelf:'center'}}/>
                         <CustomText note={true} content={item.unl_blog_body.length > 100 ? `${item.unl_blog_body.substring(0, 200)}...More` : item.unl_blog_body}/>
                       </Body>
                     </CardItem>
                     <CardItem bordered>
                       <Left>
                           <CustomText content={item.unl_blog_category}/>
                       </Left>
                     </CardItem>
                   </Card>
                   </TouchableOpacity>
         );
        if (isLoading) {
            return (
                <Spinner/>
            )
        } else {
            return (
            //     <Content>
            //     <Card style={{flex: 0}}>
            //       <CardItem>
            //         <Left>
            //           <Thumbnail source={{uri: 'Image URL'}} />
            //           <Body>
            //             <Text>NativeBase</Text>
            //             <Text note>April 15, 2016</Text>
            //           </Body>
            //         </Left>
            //       </CardItem>
            //       <CardItem>
            //         <Body>
            //           <Image source={{uri: 'Image URL'}} style={{height: 200, width: 200, flex: 1}}/>
            //           <Text>
            //             //Your text here
            //           </Text>
            //         </Body>
            //       </CardItem>
            //       <CardItem>
            //         <Left>
            //           <Button transparent textStyle={{color: '#87838B'}}>
            //             <Icon name="logo-github" />
            //             <Text>1,926 stars</Text>
            //           </Button>
            //         </Left>
            //       </CardItem>
            //     </Card>
            //     <MessageDialog ref = "dialog"/>
            //   </Content>
            <FlatList
        data={blogs}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
      />

                );
        }

    }
}

export default BlogsScreen;