var React = require('react-native');
var LoginScreen = require('./src/components/LoginScreen');
var HomePage = require('./src/components/HomePage');
var User = require('./src/components/User').default;

var {
    Navigator,
    View
} = React;

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

console.disableYellowBox = true;

var treasurehunt = React.createClass ({
    getInitialState: function() {
      var user = User.getCurrentUser()
      User.updateCurrentUserFromStore().then((user) => {
        console.log("Got a user!");
        this.setState({
            user: user,
            loggingIn: user === null,
        });
      }, () => {
        console.log("Rejected");
      });

      console.log(user);
        return {
            user: user,
            loggingIn: user === null,
        };
    },

    onLogin: function(user) {
        this.setState({
            user: user,
            loggingIn: false,
        })
    },

    onLogout: function() {
        this.setState({
            user: null,
            loggingIn: true,
        })
    },

    onSkipLogin: function() {
        this.setState({
            loggingIn: false,
        })
    },

    isLoggingIn: function() {
        return this.state.user == null && this.state.loggingIn
    },

    renderScene: function(route, navigator) {
        var Component = route.component;
        return (
            <View style={styles.container}>
                <Component
                    route={route}
                    navigator = {navigator}
                    topNavigator={navigator} />
            </View>
        )
    },

    render: function() {
        if (this.isLoggingIn()) {
            return (
                <LoginScreen onLogin={this.onLogin} onSkipLogin={this.onSkipLogin}/>
            );
        }
        else {
            // var rightButton = "Login"
            // if (this.state.user != null)
            //     rightButton = "Logout"
            return (
                <HomePage onLogout={this.onLogout}/>
            );
        }
    },
});

React.AppRegistry.registerComponent('treasurehunt', function() { return treasurehunt });
