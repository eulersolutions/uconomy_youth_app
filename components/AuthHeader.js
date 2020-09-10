import React, { Component } from 'react';
import {ImageBackground,Image,View, StyleSheet} from 'react-native';

class AuthHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <View style={{flex:1,justifyContent:'center'}}>
              <ImageBackground  source={ require('../assets/img/bg3.jpg')} style={Styles.image}>
              </ImageBackground>
                <Image
                style={Styles.bannerImageStyle}
                resizeMode='contain'
                source={require('../assets/img/unl.png')}
                />
            </View>
        );
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

export default AuthHeader;