'use strict';
 
var React = require('react-native');

var HomePage = require('./HomePage');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component
} = React;

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  buttonText: {
  fontSize: 18,
  color: 'white',
  alignSelf: 'center'
	},
  button: {
	height: 36,
	flex: 1,
	flexDirection: 'row',
	backgroundColor: '#48BBEC',
	borderColor: '#48BBEC',
	borderWidth: 1,
	borderRadius: 8,
	marginBottom: 10,
	alignSelf: 'stretch',
	justifyContent: 'center'
  },
});

class LoginScreen extends Component {
	constructor(props) {
	  super(props);
	}
	onLoginPressed() {
	  this.props.navigator.push({
		  title: 'Home',
		  component: HomePage,
	  });
	}
	render() {
		    return (
		      <View style={styles.container}>
		        <Text style={styles.description}>
		          Login page for Treasure Hunt!
		        </Text>
		         <TouchableHighlight style={styles.button}
		         	onPress={this.onLoginPressed.bind(this)}
		      		underlayColor='#99d9f4'>
		    		<Text style={styles.buttonText}>Login</Text>
		  		</TouchableHighlight>
		      </View>
		    );
		  }
		}

module.exports = LoginScreen;