import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {FeedStackNavigator, ProfileStackNavigator, ContactStackNavigator, KnowledgeStackNavigator} from './createStackNavigator';
import { Icon } from 'native-base';
import CustomText from '../components/CustomText';


const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator hideStatusBar={true} initialRouteName="Feed">
            <Drawer.Screen  name="Feed" options={{drawerIcon: () => <Icon type="AntDesign" name="home" style={{color:'grey'}}/>,drawerLabel: () => <CustomText content="Feed" style={{fontSize:14,color:'darkgrey'}}/> }} component={FeedStackNavigator}/>
            <Drawer.Screen   name="MyProfile" options={{drawerIcon: () => <Icon type="AntDesign" name="profile" style={{color:'grey'}}/>,drawerLabel: () => <CustomText content="My Profile" style={{fontSize:14,color:'darkgrey'}}/>}} component={ProfileStackNavigator}/>
            <Drawer.Screen  name="KnowledgeBase" options={{drawerIcon: () => <Icon type="AntDesign" name="cloudo" style={{color:'grey'}}/>,drawerLabel: () => <CustomText content="Knowledge Base" style={{fontSize:14,color:'darkgrey'}}/>}} component={KnowledgeStackNavigator}/>
            <Drawer.Screen  name="Contact" options={{drawerIcon: () => <Icon type="AntDesign" name="customerservice" style={{color:'grey'}}/>,drawerLabel: () => <CustomText content="Contact Us" style={{fontSize:14,color:'darkgrey'}}/>}} component={ContactStackNavigator}/>
        </Drawer.Navigator>
    )

}