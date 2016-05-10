'use strict';
 
var React = require('react-native');

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
		marginBottom: 40,
		width: 90,
		height: 90,
	},
	container: {
		padding: 30,
		marginTop: 50,
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
	textField: {
		height: 40,
		flex: 1,
		flexDirection: 'row',
		fontSize: 20,
		paddingLeft: 20,
		paddingRight: 20,
	},
	loginTextInputStyle: {
		height: 45,
		borderColor: 'gray',
		borderWidth: 3,
		flex: 1,
		flexDirection: 'row',
		alignSelf: 'stretch',
		bottom: 20,
	},
	loginIcons: {
		top: 5,
		left: 5,
		height: 30,
		width: 30,
		alignSelf: 'stretch',
		flexDirection: 'row',
	},
});

class LoginScreen extends Component {
	propTypes: {
		onLogin: React.PropTypes.func,
    }

	constructor(props) {
	  super(props);
	}

	onLoginPressed() {
		if (typeof this.props.onLogin == 'function') {
			this.props.onLogin();
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Image
					style={styles.description}
					source={require('../../loginLogo.png')}/>

				<View style={styles.loginTextInputStyle}>
					<Image
						style={styles.loginIcons}
						source={require('../../user.png')}/>
					<TextInput style= {styles.textField}
						placeholder="Username"/>
				</View>
				<View style={styles.loginTextInputStyle}>
					<Image
						style={styles.loginIcons}
						source={require('../../password.png')}/>
					<TextInput style={styles.textField}
						secureTextEntry={true}
						placeholder="Password"/>
				</View>

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