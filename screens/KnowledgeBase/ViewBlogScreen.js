import React, { Component } from 'react';
import {View,Image} from 'react-native';
import Global from '../../constants/Global';
import Requests from '../../api/Requests';
import { Card, CardItem, Left, Body, Content } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomText from '../../components/CustomText';
import Spinner from '../../components/Spinner';
import moment from 'moment';

class ViewBlogScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            token: '',
            isLoading: false,
            blogId: '',
            blog: {}
         };
    }

    componentDidMount() {
        const {blogId} = this.props.route.params;
        this.setState({blogId:blogId,token:Global.token},() => {
            this.retrieveIndividualBlog();
        })
    }

    retrieveIndividualBlog = () => {
        this.setState({isLoading:true},() => {
            Requests.retrieveSingleBlog(this.state.token,this.state.blogId)
            .then((response) => {
                if (response.data.success) {
                  this.setState({ blog: response.data.data,isLoading: false});
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
        const {blog,isLoading} = this.state;
        if (isLoading) {
            return (
                <Spinner/>
            )
        } else {
            return (
                <View style={{flex:1}}>
                    <Content>
                        <Card>
                        <CardItem bordered>
                          <Left>
                            <Body>
                                <TouchableOpacity>
                                <CustomText note={true} content={blog.unl_blog_title} style={{color:'deepskyblue'}}/>
                              <CustomText content={moment(blog.unl_blog_date).format("DD MMMM YYYY")}/>
                                </TouchableOpacity>
                            </Body>
                          </Left>
                        </CardItem>
                        <CardItem bordered>
                          <Body>
                            <Image source={{uri: `https://youth.uconomy.co.za:8000${blog.unl_blog_image}`}} style={{height: 200, width: 400, resizeMode:'contain', alignSelf:'center'}}/>
                            <CustomText note={true} content={blog.unl_blog_body}/>
                          </Body>
                        </CardItem>
                        <CardItem bordered>
                          <Left>
                              <CustomText content={blog.unl_blog_category}/>
                          </Left>
                        </CardItem>
                      </Card> 
                      </Content>
                </View>
            );
        }

    }
}

export default ViewBlogScreen;