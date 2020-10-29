import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import FeedScreen from '../screens/Feed/FeedScreen';
import {Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NestedHome from '../screens/NestedHome';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import ViewUserProfileScreen from '../screens/Feed/ViewUserProfileScreen';
import {Button, Icon} from 'native-base';
import ViewPostScreen from '../screens/Feed/ViewPostScreen';
import MyProfileScreen from '../screens/Profile/MyProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import KnowledgeScreen from '../screens/KnowledgeBase/KnowledgeScreen';
import DocumentsScreen from '../screens/KnowledgeBase/DocumentsScreen';
import BlogsScreen from '../screens/KnowledgeBase/BlogsScreen';
import ViewBlogScreen from '../screens/KnowledgeBase/ViewBlogScreen';
import ContactUsScreen from '../screens/Contact/ContactUsScreen';


function HeaderRight(props) {
  return (
    <Button transparent onPress={() => {props.navigation.toggleDrawer()}}>
      <Icon type="AntDesign" name="bars" style={{fontSize:30,color:'darkslategrey'}} />
    </Button>
  )
}

function HeaderLeft(props) {
  return  (
    <Button transparent onPress={() => {props.navigation.navigate('Main',{screen:'Feed'})}}>
    <Icon type="AntDesign" name="home" style={{fontSize:30,color:'darkslategrey'}} />
  </Button>
  )
}

function HeaderImage(props) {
  return (
    <Image source = {require('../assets/img/ucon_youth_small.png')} style={{width:150,resizeMode:'contain'}}/>
  )
}

const FeedStack = createStackNavigator();

export function FeedStackNavigator({ navigation }) {
  return (
    <FeedStack.Navigator screenOptions={{ headerTitle: () => <HeaderImage navigation={navigation}/>,headerRight: () => <HeaderRight navigation={navigation}/>}}>
      <FeedStack.Screen name="Feed" options={{headerTitleAlign:'center',headerLeft: null}} component={FeedScreen} />
      <FeedStack.Screen name="NestedHome" options={{title:'Nested Home',headerTitleAlign:'center'}} component={NestedHome} />
      <FeedStack.Screen name="ViewUserProfile" options={{title:'View User Profile',headerTitleAlign:'center',headerBackTitle:'Back'}} component={ViewUserProfileScreen} />
      <FeedStack.Screen name="ViewPost" options={{title:'View Post',headerTitleAlign:'center',headerBackTitle:'Back'}} component={ViewPostScreen} />
    </FeedStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

export function ProfileStackNavigator({navigation}) {
  return (
    <ProfileStack.Navigator screenOptions={{ headerTitle: () => <HeaderImage navigation={navigation}/>,headerRight: () => <HeaderRight navigation={navigation}/>}}>
    <ProfileStack.Screen name="MyProfile" component={MyProfileScreen} options={{headerTitleAlign:'center',headerBackTitle:'Back'}} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{headerTitleAlign:'center',headerBackTitle:'Back'}} />
    </ProfileStack.Navigator>
  )
}

const KnowledgeStack = createStackNavigator();

export function KnowledgeStackNavigator({navigation}) {
  return (
    <KnowledgeStack.Navigator screenOptions={{ headerTitle: () => <HeaderImage navigation={navigation}/>,headerRight: () => <HeaderRight navigation={navigation}/>}}>
    <KnowledgeStack.Screen name="Knowledge" component={KnowledgeScreen} options={{headerTitleAlign:'center',headerBackTitle:'Back'}} />
    <KnowledgeStack.Screen name="Documents" component={DocumentsScreen} options={{headerTitleAlign:'center',headerBackTitle:'Back'}} />
    <KnowledgeStack.Screen name="Blogs" component={BlogsScreen} options={{headerTitleAlign:'center',headerBackTitle:'Back'}} />
    <KnowledgeStack.Screen name="ViewBlog" component={ViewBlogScreen} options={{headerTitleAlign:'center',headerBackTitle:'Back'}} />
    </KnowledgeStack.Navigator>
  )
}


const AboutStack = createStackNavigator();

export function AboutStackNavigator({navigation}) {
  return (
    <AboutStack.Navigator screenOptions={{headerRight: () => <HeaderRight navigation={navigation}/>}}>
    <AboutStack.Screen name="About" options={{title:'About Screen',headerTitleAlign:'center'}} component={AboutScreen} />
    {/* You can add more screens to your stack navigator and they will not appear in your drawer. */}
    </AboutStack.Navigator>
  )
}

const ContactStack = createStackNavigator();

export function ContactStackNavigator({navigation}) {
  return (
    <ContactStack.Navigator screenOptions={{ headerTitle: () => <HeaderImage navigation={navigation}/>,headerRight: () => <HeaderRight navigation={navigation}/>}}>
    <ContactStack.Screen name="Contact" component={ContactUsScreen} options={{headerTitleAlign:'center',headerBackTitle:'Back'}} />
    </ContactStack.Navigator>
  )
}