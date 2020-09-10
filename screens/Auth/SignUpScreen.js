import React, { Component } from 'react';
import {View, StyleSheet} from 'react-native';
import AuthHeader from '../../components/AuthHeader';
import ValidationComponent from 'react-native-form-validator';
import CustomText from '../../components/CustomText';
import {Content, Button, Form, Item, Input, Label} from 'native-base';
import Requests from '../../api/Requests';
import MessageDialog from '../../components/Dialog';
import Spinner from '../../components/Spinner';

class SignUpScreen extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            isLoading: false
         };
    }

    async onSubmit (){
        const {email, firstName,lastName, password,confirmPassword} = this.state;
        this.validate({
          password: {required: true},
          email: {email: true,required:true},
          firstName: {required:true},
          lastName: {required:true},
          confirmPassword: {required:true}
        });
        if (password !== confirmPassword) {
            this.refs.dialog.showAlert('Error','Passwords do not match.')
            return;
        }
        if (this.isFormValid()) {
            const formData = {
                unl_email:email,
                unl_name: firstName,
                unl_surname: lastName,
                password:password
            };
            this.setState({isLoading: true},() => {
              Requests.performSignup(formData)
              .then(response=> {
                if (response.data.success) {
                  this.setState({isLoading:false});
                  this.refs.dialog.showAlert('Success', response.data.message);
                } else {
                  this.setState({isLoading:false});
                  this.refs.dialog.showAlert('Error', response.data.message);
                }
              })
              .catch(error => {
                this.setState({isLoading:false});
                if (error.response) {
                  // Server Error
                  console.log(error.response.data);
                  // console.log(error.response.status);
                  // console.log(error.response.headers);
                } else if (error.request) {
                  // Something else that's fucked up happened
                  console.log(error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message);
                }
              });
            })

        }
  
      }

    render() {
        const {showDialog, isLoading} = this.state;
        if (isLoading) {
          return  (
            <Spinner/>
          )
        } else {
          return (
            <View style = {{flex:1,justifyContent:'center'}}>
              <AuthHeader/>
              <Content>
              <Form>
              <MessageDialog ref = "dialog"/>

            <Item floatingLabel error={this.isFieldInError('email')}>
              <Label>
                <CustomText content="Email Address" style={{color:'darkgrey'}}/>
              </Label>
              <Input onBlur={()=>{this.validate({email: {required: true,email:true}})}} ref="email" onChangeText={(val)=> {this.setState({email:val})}} placeholder="Enter your email address" style={Styles.inputStyle} />
            </Item>
            <Item floatingLabel error={this.isFieldInError('firstName')}>
            <Label>
                <CustomText content="First Name" style={{color:'darkgrey'}}/>
              </Label>
              <Input onBlur={()=>{this.validate({firstName: {required: true}})}} ref="firstName" onChangeText={(val)=> {this.setState({firstName:val})}} placeholder="Enter your first name" style={Styles.inputStyle}/>
            </Item>
            <Item floatingLabel error={this.isFieldInError('lastName')}>
              <Label>
                <CustomText content="Last Name" style={{color:'darkgrey'}}/>
              </Label>
              <Input onBlur={()=>{this.validate({lastName: {required: true}})}} ref="lastName" onChangeText={(val)=> {this.setState({lastName:val})}} placeholder="Enter your last name" style={Styles.inputStyle} />
            </Item>
            <Item floatingLabel error={this.isFieldInError('password')}>
              <Label>
                <CustomText content="Password" style={{color:'darkgrey'}}/>
              </Label>
              <Input secureTextEntry={true} onBlur={()=>{this.validate({password: {required: true}})}} ref="password" onChangeText={(val)=> {this.setState({password:val})}} placeholder="Enter your email address" style={Styles.inputStyle} />
            </Item>
            <Item floatingLabel error={this.isFieldInError('confirmPassword')}>
              <Label>
                <CustomText content="Confirm Password" style={{color:'darkgrey'}}/>
              </Label>
              <Input secureTextEntry={true} onBlur={()=>{this.validate({confirmPassword: {required: true}})}} ref="confirmPassword" onChangeText={(val)=> {this.setState({confirmPassword:val})}} placeholder="Confirm your password" style={Styles.inputStyle} />
            </Item>
          </Form>
          <Button primary disabled={!this.isFormValid()} rounded block style={{margin:20}} onPress={() => {this.onSubmit()}}>
            <CustomText content="Continue" style={{fontSize:16}}/>
          </Button>
          <Button bordered rounded light block style={{margin:20}} onPress={() => {this.props.navigation.navigate('Login')}} >
          <CustomText content="Back to login" style={{fontSize:16, color:'deepskyblue'}}/>
          </Button>
          </Content>
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
  

export default SignUpScreen;