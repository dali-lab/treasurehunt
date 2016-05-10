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
    flex: 1
  }
});

class treasurehunt extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedIn: false,
    };
  }

  onLogin() {
    this.setState({
      loggedIn: true,
    })
  }

  onLogout() {
    this.setState({
      loggedIn: false,
    })
  }

  render() {
    if (!this.state.loggedIn) {
      return (
        <LoginScreen onLogin={this.onLogin.bind(this)}/>
      );
    }else{
      return (
        <React.NavigatorIOS
          style={styles.container}
          initialRoute={{
            title: 'Treasure Hunt',
            component: HomePage,
            rightButtonTitle: "Logout",
            onRightButtonPress: this.onLogout.bind(this),
          }}/>
      );
    }
  }
}


React.AppRegistry.registerComponent('treasurehunt', function() { return treasurehunt });
