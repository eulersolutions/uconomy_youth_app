import React, { Component } from 'react';
import {View, Text} from 'native-base';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }
    
    componentDidCatch(error, errorInfo) {
      // Catch errors in any components below and re-render with error message
      this.setState({
        error: error,
        errorInfo: errorInfo
      })
      // You can also log error messages to an error reporting service here
    }
    render() {
        if (this.state.errorInfo) {
            // Error path
            return (
              <View>
                <Text>Something went wrong.
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                  </Text>
              </View>
            );
          }
          // Normally, just render children
          return this.props.children;
    }
}

export default ErrorBoundary;