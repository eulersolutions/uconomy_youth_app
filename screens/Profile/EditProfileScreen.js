import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomText from "../../components/CustomText";
import Global from "../../constants/Global";
import Spinner from "../../components/Spinner";
import Requests from "../../api/Requests";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import ValidationComponent from "react-native-form-validator";
import MessageDialog from "../../components/Dialog";
import {Picker} from 'react-native';
import {
  Label,
  Input,
  Form,
  Item,
  Icon,
  Button,
  List,
  ListItem,
  Body,
  Right,
  CheckBox,
  Thumbnail,
  H3
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import Divider from "../../components/Divider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TouchableOpacity } from "react-native-gesture-handler";
import EducationHistory from "../../components/EducationHistory";
import WorkHistory from "../../components/WorkHistory";
import  moment from 'moment';

{
  /* 

This component is a fucking beast. RIP to you, the reader, trying to get through this.
    
Heres a prayer for you:

Hail Mary full of grace, the lord is with thee. 
Blessed are thou amongst women and Blessed is the fruit of thy womb Jesus
Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death, amen. 

Check out this tutorial for more help: 

https://www.youtube.com/watch?v=dQw4w9WgXcQ

*/
}

class EditProfileScreen extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      isLoading: false,
      profile: "",
      companyName: "",
      jobTitle: "",
      duty: "",
      workStartDate: "",
      workEndDate: "",
      showWorkStartDatePicker: false,
      showWorkEndDatePicker: false,
      personalSkill: "",
      professionalSkill: "",
      currentlyWorking: false,
      instituteName: '',
      qualificationName: '',
      eduStartDate: '',
      eduEndDate: '',
      showEduStartDatePicker: false,
      showEduEndDatePicker: false,
      currentlyStudying: false,
      image: null,
      showDebug: false
    };
  }

  componentDidMount() {

    this.getPermissionAsync();
    this.setState({ token: Global.token }, () => {
      this.retrieveOwnProfileData();
    });
  }

  setDate = (newDate) => {

    this.setState({ chosenDate: newDate, showWorkStartDatePicker: false });
  };

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setTrait = () => {

/**
 * Takes the existing set of
 * unl_personal_skills, parses it as JSON, appends the new trait,
 * stringifies the array again, and updates the unl_personal_skills in state
 */

    let trait = this.state.personalSkill;
    if (!trait) {
      this.refs.dialog.showAlert('','Please enter a trait')
      return;
    }
    let currentTraits = this.parseItem(this.state.profile.unl_personal_skills);
    //User does not have any existing traits so we must initialize
    if (!currentTraits) {
      currentTraits = [];
    }
    currentTraits.push(trait);
    currentTraits = JSON.stringify(currentTraits);
    this.setState(
      (prevState) => ({
        profile: {
          ...prevState.profile,
          unl_personal_skills: currentTraits,
        },
      }),
      () => {
        this.refs.dialog.showAlert("", "Personal Skills updated");
      }
    );
  };

  setSkill = () => {
      /**
 * Takes the existing set of
 * unl_professional_skills, parses it as JSON, appends the new trait,
 * stringifies the array again, and updates the unl_professional_skills in state
 */
    let trait = this.state.professionalSkill;
    if (!trait) {
      this.refs.dialog.showAlert('','Please enter a skill')
      return;
    }
    let currentSkills = this.parseItem(
      this.state.profile.unl_professional_skills
    );
    if (!currentSkills) {
      currentSkills = [];
    }
    currentSkills.push(trait);
    currentSkills = JSON.stringify(currentSkills);
    this.setState(
      (prevState) => ({
        profile: {
          ...prevState.profile,
          unl_professional_skills: currentSkills,
        },
      }),
      () => {
        this.refs.dialog.showAlert("", "Professional Skills updated");
      }
    );
  };

  saveWorkHistory = () => {
    this.validate({
      companyName: {required: true},
      jobTitle: {required: true},
      duty: {required: true},
      workStartDate: {required: true},
      workEndDate: {required: true},
    });
    if (!this.isFormValid()){
      return;
    }
      const {profile,workEndDate,workStartDate,companyName,jobTitle,duty} = this.state;
      let historyObject = {
          company: companyName,
          title: jobTitle,
          startDate: workStartDate,
          endDate: workEndDate 
      }

      let currentWorkHistory = this.parseItem(profile.unl_work_experience);
      //If a user has no existing work history, initialise with an empty array
      if (!currentWorkHistory) {
        currentWorkHistory = [];
      }
      currentWorkHistory.push(historyObject);
      currentWorkHistory = JSON.stringify(currentWorkHistory)
      this.setState(
        (prevState) => ({
          profile: {
            ...prevState.profile,
            unl_work_experience: currentWorkHistory,
          },
        }),
        () => {
          this.refs.dialog.showAlert("", "Work History updated");
        }
      );
  }

  saveEducationHistory = () => {
    this.validate({
      qualificationName: {required: true},
      instituteName: {required: true},
      eduEndDate: {required: true},
      eduStartDate: {required: true}
    });
    if (!this.isFormValid()){
      return;
    }
    const {profile,eduEndDate,eduStartDate,qualificationName,instituteName} = this.state;
    let historyObject = {
        institute: instituteName,
        qualification: qualificationName,
        startDate: eduStartDate,
        endDate: eduEndDate 
    }

    let currentEducationHistory = this.parseItem(profile.unl_education);
    if (!currentEducationHistory) {
      currentEducationHistory = [];
    }
    currentEducationHistory.push(historyObject);
    currentEducationHistory = JSON.stringify(currentEducationHistory)
    this.setState(
      (prevState) => ({
        profile: {
          ...prevState.profile,
          unl_education: currentEducationHistory,
        },
      }),
      () => {
        this.refs.dialog.showAlert("", "Education History updated");
      }
    );
  }

  updateProfile = () => {
    //User must complete every field. If any field is null, show an error.
    let allFieldsCaptured = Object.values(this.state.profile).every(field => field !== null);
    if (!allFieldsCaptured) {
      this.refs.dialog.showAlert('','Please complete your profile first')
      return
    }
    const {image,profile,token} = this.state; 
    let hasNewImage = false;
    image ? hasNewImage = true : hasNewImage = false;
    /**
     * A boolean for checking if the user has a new image is necessary
     * to determine how to handle the formData object in the request
     */


    this.setState({ isLoading: true }, () => {
      Requests.updateProfile(token,profile,hasNewImage)
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
            console.log(error.response.data);
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
    });

  }

  retrieveOwnProfileData() {
    this.setState({ isLoading: true }, () => {
      Requests.retrieveOwnProfileData(this.state.token)
        .then((response) => {
          if (response.data.success) {
            this.setState({ isLoading: false, profile: response.data.data });
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
    });
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState(prevState => ({
          profile: {
              ...prevState.profile,    
              unl_avatar: result.uri   
          },
          image: true
      })
      )
      }

    } catch (E) {
      console.log(E);
    }
  };

  parseItem = (item) => {
      /**
 * Parses an item as JSON
 * @param  {any} item a stringified JSON object
 * @return {Object} a JSON object
 */

    if (item == 'null' || null) {
      return false;
    }
    return JSON.parse(item);
  };


  render() {
    const {
      isLoading,
      profile,
      showWorkStartDatePicker,
      showWorkEndDatePicker,
      showEduStartDatePicker,
      showEduEndDatePicker,
      showDebug
    } = this.state;
    if (isLoading) {
      return <Spinner />;
    }
    return (
      <View style={{ flex: 1 }}>
        <ProgressSteps
          completedStepIconColor="blue"
          activeStepIconBorderColor="blue"
          completedProgressBarColor="blue"
          labelFontFamily="Noto"
          labelFontSize={12}
          activeLabelColor="blue"
        >
          
                    <ProgressStep label="Basics" nextBtnText="Next" previousBtnText="Back">
                      <Button transparent onPress={() => {this.setState({showDebug:!this.state.showDebug})}}>
                        <CustomText content="Reveal Your Secrets"/>
                      </Button>
                      {
                        showDebug ?
                        Object.entries(profile).map(item => (
                          <CustomText key={Global.getKey()} style={{fontSize:10,margin:5}} content={item[0]+': '+item[1]}/>
                        ))
                        
                        :
                        null
                      }
                    
                      <H3 style={{textDecorationLine:'underline',margin:10}}>Add basic profile information</H3>
                <Form>
                <Item stackedLabel error={profile.unl_tagline ? false : true}>
                        <Label>
                            <CustomText content="Tagline"/>
                        </Label>
                        <Input onChangeText={(val)=> {
                            this.setState(prevState => ({
                                profile: {
                                    ...prevState.profile,    
                                    unl_tagline: val   
                                }
                            }))
                            }} 
                            style={styles.inputStyle} 
                            value={profile.unl_tagline}
                            ref="tagline"
                            />
                        {!profile.unl_tagline ? 
                    <CustomText note={true} content="You must provide a tagline" style={{color:'red',fontSize:11}}/> :
                    null    
                    }
                    </Item>
                    <Item stackedLabel error={profile.unl_about ? false : true}>
                    <Label>
                    <CustomText content="About"/>
                        </Label>
                        <Input onChangeText={(val)=> {
                            this.setState(prevState => ({
                                profile: {
                                    ...prevState.profile,    
                                    unl_about: val   
                                }
                            }))
                            }} style={styles.textAreaStyle} value={profile.unl_about} multiline={true}/>
                                            {!profile.unl_about ? 
                    <CustomText note={true} content="You must provide an about" style={{color:'red',fontSize:11}}/> :
                    null    
                    }
                    </Item>
                    <Item stackedLabel>
                        {
                            this.state.image ?
                                <Thumbnail
                                square
                                source={{uri:profile.unl_avatar}}

                                />
                            :
                            profile.unl_avatar ?
                            <Thumbnail
                            square
                            source={{uri:`https://youth.uconomy.co.za:8000${profile.unl_avatar}`}}
                            /> :
                            <CustomText note={true} content="Please select an avatar"/>

                        }

                    <Label>
                    <CustomText content="Choose an avatar"/>
                    </Label>
                    <Button transparent onPress={() => {this._pickImage()}}>
                        <Icon type="AntDesign" name="camera"/>
                        <CustomText content="Pick Image"/>
                    </Button>

                    </Item>
            <Item stackedLabel error={profile.unl_location ? false : true}>
                <Label>
                    <CustomText content="Location"/>
                </Label>
                <Input onChangeText={(val)=> {
                            this.setState(prevState => ({
                                profile: {
                                    ...prevState.profile,    
                                    unl_location: val   
                                }
                            }))
                            }} style={styles.inputStyle} value={profile.unl_location} />
                 {
                 !profile.unl_location ? 
                    <CustomText note={true} content="You must provide a location" style={{color:'red',fontSize:11}}/> :
                    null    
                    }
            </Item>
            <Item stackedLabel error={profile.unl_province ? false : true}>
                <Label>
                    <CustomText content="Province"/>
                </Label>
                <Input onChangeText={(val)=> {
                            this.setState(prevState => ({
                                profile: {
                                    ...prevState.profile,    
                                    unl_province: val   
                                }
                            }))
                            }} style={styles.inputStyle} value={profile.unl_province} />
                             {
                 !profile.unl_province ? 
                    <CustomText note={true} content="You must provide a province" style={{color:'red',fontSize:11}}/> :
                    null    
                    }
            </Item>
            <Item stackedLabel error={profile.unl_disability ? false : true}>
                <Label>
                    <CustomText content="Disability"/>
                </Label>
                <Input onChangeText={(val)=> {
                            this.setState(prevState => ({
                                profile: {
                                    ...prevState.profile,    
                                    unl_disability: val   
                                }
                            }))
                            }} style={styles.inputStyle} value={profile.unl_disability} />
                             {
                 !profile.unl_disability ? 
                    <CustomText note={true} content="You must provide a disability" style={{color:'red',fontSize:11}}/> :
                    null    
                    }
            </Item>
            <Item stackedLabel error={profile.unl_mobile ? false : true}>
                <Label>
                    <CustomText content="Mobile Number"/>
                </Label>
                <Input onChangeText={(val)=> {
                            this.setState(prevState => ({
                                profile: {
                                    ...prevState.profile,    
                                    unl_mobile: val   
                                }
                            }))
                            }} style={styles.inputStyle} value={profile.unl_mobile} />

{
                 !profile.unl_mobile ? 
                    <CustomText note={true} content="You must provide a mobile number" style={{color:'red',fontSize:11}}/> :
                    null    
                    }
            </Item>
            <Item stackedLabel error={profile.unl_identity ? false : true}>
                <Label>
                    <CustomText content="ID Number"/>
                </Label>
                <Input onChangeText={(val)=> {
                            this.setState(prevState => ({
                                profile: {
                                    ...prevState.profile,    
                                    unl_identity: val   
                                }
                            }))
                            }} style={styles.inputStyle} value={profile.unl_identity} />

{
                 !profile.unl_identity ? 
                    <CustomText note={true} content="You must provide an ID number" style={{color:'red',fontSize:11}}/> :
                    null    
                    }
            </Item>
            <View style={{marginLeft:15,marginTop:10}}>
                        <Label>
        <CustomText content="Highest NQF Level Achieved"/>
                        </Label>
                    <Picker
              mode="dropdown"
              placeholder="Choose a race"
              placeholderStyle={{fontFamily:'Noto'}}
              selectedValue={profile.unl_highest_nqf_level ? profile.unl_highest_nqf_level : 'Choose'}
              style={styles.pickerStyle} 
              itemTextStyle={styles.pickerItemStyle}
              onValueChange={(val)=> {
                this.setState(prevState => ({
                    profile: {
                        ...prevState.profile,    
                        unl_highest_nqf_level: val   
                    }
                }))
                }}
            >
              <Picker.Item label="Choose..." value={null} />
              <Picker.Item label="Grade 9" value="1" />
              <Picker.Item label="Grade 10 and National (vocational) Certificates level 2" value="2" />
              <Picker.Item label="Grade 11 and National (vocational) Certificates level 3" value="3" />
              <Picker.Item label="Grade 12 (National Senior Certificate) and National (vocational) Cert. level 4" value="4" />
              <Picker.Item label="Higher Certificates and Advanced National (vocational) Cert" value="5" />
              <Picker.Item label="National Diploma and Advanced certificates" value="6" />
              <Picker.Item label="Bachelor's degree, Advanced Diplomas, Post Graduate Certificate and B-tech" value="7" />
              <Picker.Item label="Honours degree, Post Graduate diploma and Professional Qualifications" value="8" />
              <Picker.Item label="Master's degree" value="9" />
              <Picker.Item label="Doctor's degree" value="10" />


            </Picker>
            </View>
            <Divider/>
            <View style={{marginLeft:15,marginTop:10}}>
                        <Label>
                            <CustomText content="Gender"/>
                        </Label>
                    <Picker
              mode="dropdown"
              placeholder="Choose a gender"
              placeholderStyle={{fontFamily:'Noto'}}
              selectedValue={profile.unl_gender ? profile.unl_gender : 'Choose'}
              style={styles.pickerStyle} 
              itemTextStyle={styles.pickerItemStyle}
              onValueChange={(val)=> {
                this.setState(prevState => ({
                    profile: {
                        ...prevState.profile,    
                        unl_gender: val   
                    }
                }))
                }}
            >
              <Picker.Item label="Choose..." value={null} />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
            </View>
            <Divider/>
            <View style={{marginLeft:15,marginTop:10}}>
                        <Label>
        <CustomText content="Race"/>
                        </Label>
                    <Picker
              mode="dropdown"
              placeholder="Choose a race"
              placeholderStyle={{fontFamily:'Noto'}}
              selectedValue={profile.unl_race ? profile.unl_race : 'Choose'}
              style={styles.pickerStyle}  
              itemTextStyle={styles.pickerItemStyle}
              onValueChange={(val)=> {
                this.setState(prevState => ( {
                    profile: {
                        ...prevState.profile,    
                        unl_race: val   
                    }
                }))
                }}
            >
              <Picker.Item label="Choose..." value={null} />
              <Picker.Item label="White" value="White" />
              <Picker.Item label="Black" value="Black" />
              <Picker.Item label="Coloured" value="Coloured" />
              <Picker.Item label="Indian" value="Indian" />
              <Picker.Item label="Asian" value="Asian" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
            </View>
                </Form>
        </ProgressStep>

          <ProgressStep
            label="Traits"
            nextBtnText="Next"
            previousBtnText="Back"
          >
            <H3 style={{textDecorationLine:'underline',margin:5}}>Add personal traits to your profile</H3>
 
            <View>
              <CustomText
                content="Enter a personal trait and click the save button"
                style={{ padding: 15, textAlign: "center" }}
              />
              <Form>
                <Item stackedLabel>
                  <Label>
                    <CustomText content="Add a trait" />
                  </Label>
                  <Input
                    onChangeText={(val) => {
                      this.setState({ personalSkill: val });
                    }}
                    placeholder="Enter a trait"
                    style={styles.inputStyle}
                  />
                </Item>
                <Button
                  primary
                  rounded
                  style={{ alignSelf: "center", margin: 10 }}
                  onPress={() => {
                    this.setTrait();
                  }}
                >
                  <CustomText content="Save Trait" />
                </Button>
              </Form>
              <List>
                <ListItem itemHeader key={Global.getKey()}>
                  <Body>
                  <CustomText content="Existing Traits" />
                  </Body>
                </ListItem>
                {profile.unl_personal_skills  ?
                
                    this.parseItem(profile.unl_personal_skills).map((item) => (
                      <ListItem key={Global.getKey()}>
                        <CustomText content={item} />
                      </ListItem>
                    ))

                  :
                  <CustomText note={true} content="You do not have any traits" style={{textAlign:'center'}}/>
              }
                {/*  */}
              </List>
            </View>
          </ProgressStep>
          <ProgressStep
            label="Skills"
            nextBtnText="Next"
            previousBtnText="Back"
          >
            <H3 style={{textDecorationLine:'underline',margin:5}}>Add professional skills to your profile</H3>
            <View>
              <CustomText
                content="Enter a skill and click the save button"
                style={{ padding: 15, textAlign: "center" }}
              />
              <Form>
                <Item stackedLabel>
                  <Label>
                    <CustomText content="Add a skill" />
                  </Label>
                  <Input
                    onChangeText={(val) => {
                      this.setState({ professionalSkill: val });
                    }}
                    placeholder="Enter a skill"
                    style={styles.inputStyle}
                  />
                </Item>
                <Button
                  primary
                  rounded
                  style={{ alignSelf: "center", margin: 10 }}
                  onPress={() => {
                    this.setSkill();
                  }}
                >
                  <CustomText content="Save skill" />
                </Button>
              </Form>
              <List>
                <ListItem itemHeader key={Global.getKey()}>
                  <Body>
                  <CustomText content="Existing Skills" />
                  </Body>
                </ListItem>
                {profile.unl_professional_skills  ?
              
                    this.parseItem(profile.unl_professional_skills).map((item) => (
                      <ListItem key={Global.getKey()}>
                        <CustomText content={item} />
                      </ListItem>
                    ))
                  :
                  <CustomText note={true} content="You do not have any professional skills" style={{textAlign:'center'}}/>
              }
              </List>
            </View>
          </ProgressStep>
          <ProgressStep label="Work" nextBtnText="Next" previousBtnText="Back">
          <H3 style={{textDecorationLine:'underline',margin:10}}>Add Employment History</H3>

            <View>
              <Form>
                <Item stackedLabel error={this.isFieldInError('companyName')}>
                  <Label>
                    <CustomText content="Company Name" />
                  </Label>
                  <Input
                    onChangeText={(val) => {
                      this.setState({ companyName: val });
                    }}
                    placeholder="Enter a company name"
                    style={styles.inputStyle}
                    onBlur={() => {
                      this.validate({
                        companyName: { required: true },
                      });
                    }}
                    ref="companyName"
                  />
                </Item>
                <Item stackedLabel error={this.isFieldInError('jobTitle')}>
                  <Label>
                    <CustomText content="Job Title" />
                  </Label>
                  <Input
                    onChangeText={(val) => {
                      this.setState({ jobTitle: val });
                    }}
                    placeholder="Enter a job title"
                    style={styles.inputStyle}
                    onBlur={() => {
                      this.validate({
                        jobTitle: { required: true },
                      });
                    }}
                    ref="jobTitle"
                  />
                </Item>
                <Item stackedLabel error={this.isFieldInError('duty')}>
                  <Label>
                    <CustomText content="Duties Performed" />
                  </Label>
                  <Input
                    onChangeText={(val) => {
                      this.setState({ duty: val });
                    }}
                    placeholder="Enter a duty"
                    style={styles.inputStyle}
                    onBlur={() => {
                      this.validate({
                        duty: { required: true },
                      });
                    }}
                    ref="duty"
                  />
                </Item>
                <View style={{ marginLeft: 15, marginTop: 10 }}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "space-evenly",
                      flexDirection: "row",
                    }}
                  >
                    <Item error={this.isFieldInError('workStartDate')}>
                    <TouchableOpacity
                      style={{ flexDirection: "row" }}
                      onPress={() => {
                        this.setState({ showWorkStartDatePicker: true });
                      }}
                    >
                      <Label>
                        <CustomText content="Start Date" />
                      </Label>
                      <Icon
                        type="AntDesign"
                        name="calendar"
                        style={{
                          fontSize: 24,
                          color: "deepskyblue",
                          paddingLeft: 10,
                        }}
                      />
                    </TouchableOpacity>
                    </Item>
                    <Item error={this.isFieldInError('workEndDate')}>
                    <TouchableOpacity
                      style={{ flexDirection: "row" }}
                      onPress={() => {
                        this.setState({ showWorkEndDatePicker: true });
                      }}
                    >
                      <Label>
                        <CustomText content="End Date" />
                      </Label>

                      <Icon
                        type="AntDesign"
                        name="calendar"
                        style={{
                          fontSize: 24,
                          color: "deepskyblue",
                          paddingLeft: 10,
                        }}
                      />

                    </TouchableOpacity>
                    </Item>
                  </View>
                  <View style={{flexDirection:'row',alignContent:'center',margin:5,justifyContent:'center'}}>
                      <CustomText note={true} content="Currently Employed"/>
                    <CheckBox checked={this.state.currentlyWorking} 
                    onPress={()=> {
                        this.setState({
                        currentlyWorking:!this.state.currentlyWorking,
                        workEndDate:'Current'
                        })
                    }} 
                    />

                      </View>
                  <View style={{flex:1,justifyContent:"space-evenly",flexDirection:'row'}}>
                  <CustomText note={true} content={this.state.workStartDate ? "From: "+this.state.workStartDate : 'Select a date' }/>
                  <CustomText note={true} content={this.state.workEndDate ? "Until: "+this.state.workEndDate : 'Select a date'}/>

                  </View>
                  {showWorkStartDatePicker && (
                    <DateTimePicker
                      value={new Date()}
                      minimumDate={new Date(1990, 1, 1)}
                      maximumDate={new Date()}
                      mode={"date"}
                      onChange={(val) => {
                        this.setState(
                          {
                            workStartDate: moment(val['nativeEvent']['timestamp']).format("MMMM YYYY"),
                            showWorkStartDatePicker: false,
                          }
                        );
                      }}
                    />
                  )}

                  {showWorkEndDatePicker && (
                    <DateTimePicker
                      value={new Date()}
                      minimumDate={new Date(1990, 1, 1)}
                      maximumDate={new Date()}
                      mode={"date"}
                      onChange={(val) => {
                        this.setState(
                          { workEndDate: moment(val['nativeEvent']['timestamp']).format("MMMM YYYY"), 
                          showWorkEndDatePicker: false }
                        );
                      }}
                    />
                  )}
                  <Button primary disabled={!this.isFormValid()} rounded block style={{ margin: 10 }} onPress={() => {this.saveWorkHistory()}}>
                    <CustomText content="Save work history" />
                  </Button>
                </View>

                <Divider />
                <List>
                  <ListItem itemHeader first key={Global.getKey()}>
                    <Body>
                      <CustomText content="Existing work history" />
                    </Body>
                    <Right>
                      <Icon
                        type="AntDesign"
                        name="sync"
                        style={{ color: "deepskyblue", fontSize: 24 }}
                      />
                    </Right>
                  </ListItem>
                  {profile.unl_work_experience  ?
                
                    this.parseItem(profile.unl_work_experience).map((item) => (
                      <WorkHistory key={Global.getKey()} item={item} />
                    ))
                  :
                  <CustomText note={true} content="You do not have any work experience" style={{textAlign:'center'}}/>
              }
                    
                </List>
              </Form>
            </View>
          </ProgressStep>
          <ProgressStep
            label="Education"
            nextBtnText="Next"
            previousBtnText="Back"
            finishBtnText="Update Profile"
            onSubmit={() => {this.updateProfile()}}
          >
          <H3 style={{textDecorationLine:'underline',margin:10}}>Add Education History</H3>

            <View>
              <Form>
                <Item stackedLabel error={this.isFieldInError('instituteName')}>
                  <Label>
                    <CustomText content="Institution" />
                  </Label>
                  <Input
                    placeholder="Enter an institution name"
                    style={styles.inputStyle}
                    onChangeText={(val) => {
                        this.setState({ instituteName: val });
                      }}
                      onBlur={() => {
                        this.validate({
                          instituteName: { required: true },
                        });
                      }}
                      ref="instituteName"
                  />
                </Item>
                <Item stackedLabel error={this.isFieldInError('qualificationName')}>
                  <Label>
                    <CustomText content="Qualification" />
                  </Label>
                  <Input
                    placeholder="Enter a qualification"
                    style={styles.inputStyle}
                    onChangeText={(val) => {
                        this.setState({ qualificationName: val });
                      }}
                      onBlur={() => {
                        this.validate({
                          qualificationName: { required: true },
                        });
                      }}
                      ref="qualificationName"
                  />
                </Item>
                <View style={{ marginLeft: 15, marginTop: 10 }}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "space-evenly",
                      flexDirection: "row",
                    }}
                  >
                    <Item error={this.isFieldInError('eduStartDate')}>
                    <TouchableOpacity
                      style={{ flexDirection: "row" }}
                      onPress={() => {
                        this.setState({ showEduStartDatePicker: true });
                      }}
                    >
                      <Label>
                        <CustomText content="Start Date" />
                      </Label>
                      <Icon
                        type="AntDesign"
                        name="calendar"
                        style={{
                          fontSize: 24,
                          color: "deepskyblue",
                          paddingLeft: 10,
                        }}
                      />
                    </TouchableOpacity>
                    </Item>
                    <Item error={this.isFieldInError('eduEndDate')}>
                    <TouchableOpacity
                      style={{ flexDirection: "row" }}
                      onPress={() => {
                        this.setState({ showEduEndDatePicker: true });
                      }}
                    >
                      <Label>
                        <CustomText content="End Date" />
                      </Label>

                      <Icon
                        type="AntDesign"
                        name="calendar"
                        style={{
                          fontSize: 24,
                          color: "deepskyblue",
                          paddingLeft: 10,
                        }}
                      />
                    </TouchableOpacity>
                    </Item>
                  </View>
                  <View style={{flexDirection:'row',alignContent:'center',margin:5,justifyContent:'center'}}>
                      <CustomText note={true} content="Current"/>
                    <CheckBox checked={this.state.currentlyStudying} 
                    onPress={()=> {
                        this.setState({
                            currentlyStudying:!this.state.currentlyStudying,
                        eduEndDate:'Current'
                        })
                    }} 
                    />

                      </View>
                      <View style={{flex:1,justifyContent:"space-evenly",flexDirection:'row'}}>
                  <CustomText note={true} content={this.state.eduStartDate ? "From: "+this.state.eduStartDate : 'Select a date' }/>
                  <CustomText note={true} content={this.state.eduEndDate ? "Until: "+this.state.eduEndDate : 'Select a date'}/>

                  </View>
                  {showEduStartDatePicker && (
                    <DateTimePicker
                      value={new Date()}
                      minimumDate={new Date(2000, 1, 1)}
                      maximumDate={new Date()}
                      mode={"date"}
                      onChange={(val) => {this.setState({eduStartDate:moment(val['nativeEvent']['timestamp']).format("MMMM YYYY"),showEduStartDatePicker:false})
                      }}
                    />
                  )}

                {showEduEndDatePicker && (
                    <DateTimePicker
                      value={new Date()}
                      minimumDate={new Date(2000, 1, 1)}
                      maximumDate={new Date()}
                      mode={"date"}
                      onChange={(val) => {this.setState({eduEndDate:moment(val['nativeEvent']['timestamp']).format("MMMM YYYY"),showEduEndDatePicker:false})}}
                    />
                  )}
                  <Button disabled={!this.isFormValid()} primary rounded block style={{ margin: 10 }} onPress={() => {
                      this.saveEducationHistory();
                  }}>
                    <CustomText content="Save education history" />
                  </Button>
                </View>

                <Divider />
                <List>
                  <ListItem itemHeader first key={Global.getKey()}>
                    <Body>
                      <CustomText content="Existing education history" />
                    </Body>
                    <Right>
                      <Icon
                        type="AntDesign"
                        name="sync"
                        style={{ color: "deepskyblue", fontSize: 24 }}
                      />
                    </Right>
                  </ListItem>
                                      {profile.unl_education  ?
                
                    this.parseItem(profile.unl_education).map((item) => (
                      <EducationHistory key={Global.getKey()} item={item} />
                    ))
                  :
                  <CustomText note={true} content="You do not have any education history" style={{textAlign:'center'}}/>
              }
                </List>
              </Form>
            </View>
          </ProgressStep>
        </ProgressSteps>
        <View>
          <MessageDialog ref="dialog" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    fontFamily: "Noto",
    fontSize: 14,
  },
  textAreaStyle: {
    fontFamily: "Noto",
    fontSize: 14,
    height: 60,
  },
  pickerStyle: {

  },
  pickerItemStyle: {
    fontSize: 14,
  },
});

export default EditProfileScreen;
