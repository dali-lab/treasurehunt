var ReactNative = require('react-native');
var React = require('react');
var LoginScreen = require('./src/components/LoginScreen');
var HomePage = require('./src/components/HomePage');
var User = require('./src/components/User').default;

var {
    Navigator,
    View
} = ReactNative;

var styles = ReactNative.StyleSheet.create({
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
        var user = User.getCurrentUser();

        // This is so we know what the starting hunt is
        User.getStartingHuntID()

        console.log("Start loading the user from storage");
        User.loadUserFromStore().then((user) => {
            if (user != null) {
                console.log("Got something back for autologin");
                if (this.state.user == null) {
                    this.setState({
                        user: user,
                        loggingIn: user === null,
                    });
                }
            }else{
                console.log("Found no user! Continuing...")
                User.addListener((user) => {
                    console.log("Listener Payed off! We logged in");
                    this.onLogin(user);
                });
            }
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
            loggingIn: user === null,
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

    render: function() {
        console.log("Rendering...");
        if (this.isLoggingIn()) {

            console.log("   LoginScreen");
            return (
                <LoginScreen onLogin={this.onLogin} onSkipLogin={this.onSkipLogin}/>
            );
        }
        else {

            console.log("   HomePage");
            // var rightButton = "Login"
            // if (this.state.user != null)
            //     rightButton = "Logout"
            return (
                <HomePage onLogout={this.onLogout}/>
            );
        }
    },
});

ReactNative.AppRegistry.registerComponent('TreasureHunt', function() { return treasurehunt });
