import React, { Component } from 'react';
import Requests from '../../api/Requests';
import Spinner from '../../components/Spinner';
import Global from '../../constants/Global';
import {Container,View} from 'native-base'
import ProfileCard from '../../components/ProfileCard';
import UserProfile from '../../components/UserProfile';
import MessageDialog from '../../components/Dialog';

class ViewUserProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            token: '',
            isLoading: false,
            userId: '',
            profile: ''
         };
    }

    componentDidMount() {
      /**
       * Gets the user ID from route params, passes it
       * to the endpoint, and receives the user's profile
       */
        const {userId} = this.props.route.params;
        this.setState({token:Global.token,userId:userId}, () => {
            this.retrieveUserProfileData();
        });
    }


    retrieveUserProfileData = () => {
        this.setState({ isLoading: true }, () => {
            Requests.viewUserProfile(this.state.token,this.state.userId)
              .then((response) => {
                if (response.data.success) {
                  this.setState({ isLoading: false,profile:response.data.data});
                  console.log(response.data.data);
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
        const {isLoading,profile} = this.state;
        if (isLoading) {
            return (
                <Spinner/>
            )
        }   else {
            return (
                <Container>
                   <View>
                   <MessageDialog ref = "dialog"/>
                   </View>
                <ProfileCard profile={profile}/>
               <UserProfile profile={profile}/>
               
              </Container>
            );
        }

    }
}



export default ViewUserProfileScreen;