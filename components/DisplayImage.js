import React, { Component } from 'react';
import {View,Image} from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'native-base';
import CustomText from './CustomText';

class DisplayImage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            isModalVisible: false,
            imageUri: ''
         };
    }
    showModal = (uri) => {
        this.setState({imageUri:uri,isModalVisible:true});
    }

    hideModal = () => {
        this.setState({isModalVisible:false});
    }

    render() {
        const {isModalVisible,imageUri} = this.state;
        return (
            <View style={{flex:1}}>
            <Modal
            isVisible={isModalVisible}
            coverScreen={true} backdropOpacity={0.95} hasBackdrop={true} backdropColor='ghostwhite'
            >
            <Image
            source={{uri:`https://youth.uconomy.co.za:8000${imageUri}`}}
            style={{width:'50%',height:'50%',alignSelf:'center'}}
            />
            <Button block transparent onPress={() => {this.hideModal()}}>
                <CustomText content="CLOSE"/>
            </Button>
                
            </Modal>
            </View>

        );
    }
}

export default DisplayImage;