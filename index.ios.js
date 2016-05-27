var React = require('react-native');
var LoginScreen = require('./src/components/LoginScreen');
var HomePage = require('./src/components/HomePage');

var styles = React.StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1, 
  }
});

class treasurehunt extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      user: null,
      loggingIn: true,
    };
  }

  onLogin(user) {
    this.setState({
      user: user,
      loggingIn: false,
    })
  }

  onLogout() {
    this.setState({
      user: null,
      loggingIn: true,
    })
  }

  onSkipLogin() {
    this.setState({
      loggingIn: false,
    })
  }

  isLoggingIn() {
    return this.state.user == null && this.state.loggingIn
  }

  render() {
    if (this.isLoggingIn()) {
      return (
        <LoginScreen onLogin={this.onLogin.bind(this)} onSkipLogin={this.onSkipLogin.bind(this)}/>
      );
    }else{
      var rightButton = "Login"
      if (this.state.loggedIn)
        rightButton = "Logout"
      return (
        <React.NavigatorIOS
          style={styles.container}
          initialRoute={{
            title: 'TREASURE HUNT',
            component: HomePage,
            rightButtonTitle: rightButton,
            onRightButtonPress: this.onLogout.bind(this),
            barTintColor: '#5da990',
            titleTextColor: '#FFFFFF'
          }}/>
      );
    }
  }
}


React.AppRegistry.registerComponent('treasurehunt', function() { return treasurehunt });
