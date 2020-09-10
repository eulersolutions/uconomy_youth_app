import React, { Component } from 'react';
import { View,StyleSheet} from 'react-native';

import { Button, Form, Item, Input, Label, Icon} from 'native-base';
import CustomText from '../../components/CustomText';
import AsyncStorage from '@react-native-community/async-storage';
import Requests from '../../api/Requests';
import ValidationComponent from 'react-native-form-validator';
import AuthHeader from '../../components/AuthHeader';
import MessageDialog from '../../components/Dialog';
import Spinner from '../../components/Spinner';
import Global from '../../constants/Global';

class LoginScreen extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {  
          email: '',
          password: '',
          isLoading: false
        };
    }

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    storeToken = async (value) => {
      Global.token = value;
      try {
        await AsyncStorage.setItem('token', value)
      } catch (e) {
        this.refs.dialog.showAlert('Error',e.message);
      }
    }


     onSubmit = async () => {
      const {email, password} = this.state;
      this.validate({
        password: {required: true},
        email: {email: true,required:true}
      });
      if (this.isFormValid()) {
        const formData = {unl_email:email,password:password};
        this.setState({isLoading:true}, () => {
          Requests.performLogin(formData)
          .then(response=> {
            if (response.data.success) {
              this.setState({isLoading:false});
              this.refs.dialog.showAlert('Success',response.data.message);
              this.storeToken(response.data.token);
              this.props.navigation.navigate('Main',{screen:'Feed'})
            } else{
              this.setState({isLoading:false});
              console.log(response.data.error)
              this.refs.dialog.showAlert('Error',response.data.error);
              return;
            }
          })
          .catch(error => {
            this.setState({isLoading:false});
            if (error.response) {
              // Server Error
              // console.log(error.response.data);
              this.refs.dialog.showAlert('Whoops!','Something went wrong. Please try again later.');
              // console.log(error.response.status);
              // console.log(error.response.headers);
            } else if (error.request) {
              // Something else that's fucked up happened
              this.refs.dialog.showAlert('Unable to connect with the server','Please check your internet connection and try again.');
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
          });
        })
      }
      
    }

    render() {
      const  {email,password, isLoading} = this.state;
      if (isLoading) {
        return (
          <Spinner/>
        )
      } else {
        return (
          <View style = {{flex:1,justifyContent:'center'}}>
            <AuthHeader/>
        <Form>
        <MessageDialog ref = "dialog"/>
          <Item floatingLabel error={this.isFieldInError('email')}>
            <Label>
              <CustomText content="Email Address" style={{color:'darkgrey'}}/>
            </Label>
            <Input onBlur={()=>{this.validate({email: {required: true,email:true}})}} ref="email" onChangeText={(val)=> {this.setState({email:val})}} placeholder="Enter your email address" style={Styles.inputStyle} />
            <Icon active name={this.isFieldInError('email') ? 'close-circle': 'mail'} style={{color:'darkgrey',fontSize:20}} />
          </Item>
          <Item floatingLabel error={this.isFieldInError('password')}>
          <Label>
              <CustomText content="Password" style={{color:'darkgrey'}}/>
            </Label>
            <Input secureTextEntry={true} onBlur={()=>{this.validate({password: {required: true}})}} ref="password" onChangeText={(val)=> {this.setState({password:val})}} placeholder="Enter your password" style={Styles.inputStyle}/>
            <Icon active name={this.isFieldInError('password') ? 'close-circle': 'key'} style={Styles.iconStyle} />
          </Item>
        </Form>
        <Button primary disabled={!this.isFormValid()} rounded block style={{margin:20}} onPress={() => {this.onSubmit()}}>
          <CustomText content="Login" style={{fontSize:16}}/>
        </Button>
        <Button bordered rounded light block style={{margin:20}} onPress={() => {this.props.navigation.navigate('SignUp')}} >
        <CustomText content="Sign Up" style={{fontSize:16, color:'deepskyblue'}}/>
        </Button>
          </View>
      ); 
      }
 
    }
}

const Styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  bannerImageStyle: {
    width:'90%',
    alignSelf:'center'
  },
  inputStyle: {
    fontFamily:'Noto', 
    color:'grey',
    fontSize:15,
    padding:10
  },
  iconStyle: {
    color:'darkgrey',
    fontSize:20
  },
  
})

export default LoginScreen;