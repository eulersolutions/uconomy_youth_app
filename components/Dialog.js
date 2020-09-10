import React, { Component } from 'react';
import {View} from 'native-base'; 
import { StyleSheet} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

class MessageDialog extends Component {
  constructor(props) {
    super(props);
    this.state = { showAlert: false, dialogTitle:'',dialogMessage:'' };
  };

  showAlert = (title,msg) => {
    this.setState({
      showAlert: true,
      dialogTitle: title,
      dialogMessage: msg
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  render() {
    const {showAlert, dialogTitle,dialogMessage} = this.state;

    return (
      <View style={styles.container}>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={dialogTitle}
          titleStyle={{textAlign:'center',fontFamily:'Noto'}}
          message={dialogMessage}
          messageStyle={{textAlign:'center',fontFamily:'Noto'}}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          onDismiss={() => {this.hideAlert()}}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
      </View>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: "#AEDEF4",
  },
  text: {
    color: '#fff',
    fontSize: 15
  }
});

export default MessageDialog;