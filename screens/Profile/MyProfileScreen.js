import React, { Component } from 'react';
import Requests from '../../api/Requests';
import Spinner from '../../components/Spinner';
import Global from '../../constants/Global';
import {View} from 'react-native';
import CustomText from '../../components/CustomText';
import MessageDialog from '../../components/Dialog';
import UserProfile from '../../components/UserProfile';
import ProfileCard from '../../components/ProfileCard';
import {Button} from 'native-base';

class MyProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            isLoading: false,
            token: '',
            profile: ''
         };
    }

    componentDidMount() {
        this.setState({token:Global.token},() => {
            this.retrieveProfileData();
        })
}

retrieveProfileData = () => {
    this.setState({ isLoading: true }, () => {
        Requests.retrieveOwnProfileData(this.state.token)
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
        } else {
            return (
                <View style={{flex:1,backgroundColor:'white'}}>

                    <ProfileCard profile={profile}/>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',margin:10}}>

                    <Button small rounded info onPress={() => {this.props.navigation.navigate('EditProfile')}}>
                    <CustomText content={"Edit profile"}/>
                    </Button>
                    <Button small rounded info onPress={() => {this.retrieveProfileData()}}>
                    <CustomText content={"Refresh"}/>
                    </Button>
                    </View>
                    <UserProfile profile={profile} 
                    isOwnProfile={true}
                    navigation={this.props.navigation}
                    />
                    <View>
                   <MessageDialog ref = "dialog"/>
                   </View>
                </View>
            );
        }

    }
}

export default MyProfileScreen;