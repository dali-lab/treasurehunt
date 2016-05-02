var React = require('react-native');
var LoginScreen = require('./src/components/LoginScreen');

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
  render() {
    return (
      <React.NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Login',
          component: LoginScreen,
        }}/>
    );
  }
}


React.AppRegistry.registerComponent('treasurehunt', function() { return treasurehunt });
