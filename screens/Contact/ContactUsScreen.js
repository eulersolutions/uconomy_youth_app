import React, { Component } from 'react';
import {View,Text, StyleSheet,Picker} from 'react-native';
import Global from '../../constants/Global';
import { Form, Item, Label, Input, Button, Content } from 'native-base';
import CustomText from '../../components/CustomText';
import ValidationComponent from 'react-native-form-validator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { requestCameraPermissionsAsync } from 'expo-image-picker';
import Requests from '../../api/Requests';
import Spinner from '../../components/Spinner';
import MessageDialog from '../../components/Dialog';


class ContactUsScreen extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = { 
            isLoading: false,
            token: '',
            email: '',
            fullName: '',
            needHelpWith: '',
            IdNumber: '',
            cellNumber: '',
            issueDetail: ''
         };
    }

    componentDidMount() {
        this.setState({token:Global.token});
    }

    onSubmit =() => {
        console.log(this.isFormValid());
        this.validate({
            email: {required:true},
            fullName: {required:true},
            needHelpWith: {required: true},
            IdNumber: {required:true},
            cellNumber: {required:true},
            issueDetail: {required:true}
        })
        let formValues = new FormData();
        /**
         * Sorry, the form is fucking massive and contains a lot
         * of unnecessary shit. Very poorly designed from the Uconomy perspective.
         * Nobody wants to touch it either so looks like it is destined to remain
         * in this fucked state.
         */
        formValues.append('ust_type','115');
        formValues.append('ust_category',this.state.needHelpWith);
        formValues.append('ust_recipient_name',this.state.fullName);
        formValues.append('ust_email',this.state.email);
        formValues.append('ust_recipient_tel',this.state.cellNumber);
        formValues.append('ust_priority','119');
        formValues.append('ust_status','110');
        formValues.append('ust_title','New Ticket From Uconomy Youth Mobile App');
        formValues.append('ust_description',this.state.issueDetail);
        formValues.append('ust_id',this.state.IdNumber);
        formValues.append('ust_recipient_email',this.state.email);
        formValues.append('ust_created_by','9999');

        this.setState({isLoading:true},() => {
            Requests.createTicket(this.state.token,formValues)
            .then((response) => {
                if (response.data.success) {
                  this.setState({ isLoading: false});
                  this.refs.dialog.showAlert("Success", response.data.message);
                } else {
                  this.setState({ isLoading: false });
                  this.refs.dialog.showAlert("Error", response.data.message);
                  return;
                }
              })
              .catch((error) => {
                this.setState({ isLoading: false });
                if (error.response) {
                //   console.log(error.response.data);
                  this.refs.dialog.showAlert(
                    "Whoops!",
                    "Something went wrong. Please try again later."
                  );
                } else if (error.request) {
                  this.refs.dialog.showAlert(
                    "Unable to connect with the server",
                    "Please check your internet connection and try again."
                  );
                } else {
                  console.log("Error", error.message);
                }
              });
        })
    }


    render() {
        const {isLoading} = this.state;
        if (isLoading) {
            return (
                <Spinner/>
            )
        } else {
            return (
                <View style={{flex:1}}>
                    <Content>
                    <KeyboardAwareScrollView>
                    <Form>
                        
                        <Item stackedLabel error={this.isFieldInError('email')}>
                            <Label>
                                <CustomText content="Email Address"/>
                            </Label>
                            <Input onChangeText={
                                    (val)=> {
                                        this.setState({email:val})
                                    }
                                } 
                                onBlur={() => {
                                    this.validate({email:{required:true}})
                                }}
                                placeholder="Enter an email address"
                                ref ="email"
                                style={styles.inputStyle}
                                />
                        </Item>
                        
                        {this.isFieldInError('email') &&
                        <CustomText style={styles.errorStyle} content="Please enter an email address"/>
                        }
                        <Item stackedLabel error={this.isFieldInError('fullName')}>
                            <Label>
                                <CustomText content="Full Name"/>
                            </Label>
                            <Input onChangeText={
                                    (val)=> {
                                        this.setState({fullName:val})
                                    }
                                } 
                                onBlur={() => {
                                    this.validate({fullName:{required:true}})
                                }}
                                placeholder="Enter your full name"
                                ref ="fullName"
                                style={styles.inputStyle}
                                />
                        </Item>
                        {this.isFieldInError('fullName') &&
                        <CustomText style={styles.errorStyle} content="Please enter your full name"/>
                        }
                        <Item stackedLabel error={this.isFieldInError('IdNumber')}>
                            <Label>
                                <CustomText content="ID Number"/>
                            </Label>
                            <Input onChangeText={
                                    (val)=> {
                                        this.setState({IdNumber:val})
                                    }
                                } 
                                onBlur={() => {
                                    this.validate({IdNumber:{required:true}})
                                }}
                                placeholder="Enter your ID number"
                                ref ="IdNumber"
                                style={styles.inputStyle}
                                />
                        </Item>
                        {this.isFieldInError('IdNumber') &&
                        <CustomText style={styles.errorStyle} content="Please enter your ID Number"/>
                        }
                        <Item stackedLabel error={this.isFieldInError('cellNumber')}>
                            <Label>
                                <CustomText content="Cell Number"/>
                            </Label>
                            <Input onChangeText={
                                    (val)=> {
                                        this.setState({cellNumber:val})
                                    }
                                } 
                                onBlur={() => {
                                    this.validate({cellNumber:{required:true}})
                                }}
                                placeholder="Enter your cellphone number"
                                ref ="cellNumber"
                                style={styles.inputStyle}
                                />
                        </Item>
                        {this.isFieldInError('cellNumber') &&
                        <CustomText style={styles.errorStyle} content="Please enter your Cell Number"/>
                        }
                        <Item stackedLabel error={this.isFieldInError('issueDetail')}>
                            <Label>
                                <CustomText content="Details about your issue"/>
                            </Label>
                            <Input onChangeText={
                                    (val)=> {
                                        this.setState({issueDetail:val})
                                    }
                                } 
                                onBlur={() => {
                                    this.validate({issueDetail:{required:true}})
                                }}
                                multiline={true}
                                placeholder="..."
                                ref ="issueDetail"
                                style={styles.inputStyle}
                                />
                        </Item>
                        {this.isFieldInError('issueDetail') &&
                        <CustomText style={styles.errorStyle} content="Please elaborate about your issue"/>
                        }
                        <View style={{marginLeft:15,marginTop:10}}>
                            <Label>
            <CustomText content="I need help with"/>
                            </Label>
                        <Picker
                  mode="dropdown"
                  placeholderStyle={{fontFamily:'Noto'}}
                  selectedValue={this.state.needHelpWith ? this.state.needHelpWith : 'Choose'}
                  style={styles.pickerStyle} 
                  itemTextStyle={{fontFamily:'Noto',color:'grey'}}
                  onValueChange={(val)=> {
                    this.setState({needHelpWith:val})
                    }}
                >
                  <Picker.Item label="Choose..." value={null} />
                  <Picker.Item label="Profile Management" value="49" />
                  <Picker.Item label="IT Support" value="46" />
    
                </Picker>
                </View>
                {this.isFieldInError('needHelpWith') &&
                        <CustomText style={styles.errorStyle} content="Please select an option"/>
                        }
                        <Button onPress={() => {this.onSubmit()}} disabled={!this.isFormValid()} primary block rounded style={{margin:10}}>
                            <CustomText content="Submit"/>
                        </Button>
                    </Form>
                    </KeyboardAwareScrollView>
                    <MessageDialog ref="dialog"/>
                    </Content>
                    
                </View>
            );
        }

    }
}

const styles = StyleSheet.create({
    inputStyle: {
        fontFamily:'Noto', 
        color:'grey',
        fontSize:15
      },
      errorStyle: {
        fontSize:10,
        color:'red',
        textAlign:'center'
      }
})

export default ContactUsScreen;